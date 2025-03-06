import * as process from "node:process";
import { Injectable } from "@nestjs/common";

export interface JiraProject {
  id: string;
  name: string;
}

export interface JiraTicket {
  link: string;
  title: string;
  description: string;
}

export interface JiraTicketNoUrl {
  title: string;
  description: string;
  status: string;
  id: string;
}

@Injectable()
export class JiraService {
  token: string;
  constructor() {
    this.token = Buffer.from(
      `${process.env.JIRA_EMAIL}:${process.env.JIRA_TOKEN}`,
    ).toString("base64");
  }

  async update(url: string) {
    //rest/api/3/issue/${ticket.id}/transitions
    const response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Basic ${this.token}`,
        "Content-Type": "application/json",
      },
    });
    const json = await response.json();

    for (const transition of json.transitions) {
      if (transition.name === "Terminé") {
        await fetch(url, {
          method: "POST",
          headers: {
            Authorization: `Basic ${this.token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            transition: {
              id: transition.id,
            },
          }),
        });
      }
    }
    return { message: `Ticket at ${url} updated` };
  }

  async getDataTicketProjectId(url: string) {
    const data = await fetch(url, {
      headers: {
        Authorization: `Basic ${this.token}`,
        "Content-Type": "application/json",
      },
    });
    const json = await data.json();
    const tickets: JiraTicket[] = [];

    for (const ticket of json.issues) {
      tickets.push({
        //rest/api/3/issue/${ticket.id}/transitions
        link: `${process.env.JIRA_URL}jira/software/projects/HACK/boards/2/backlog?selectedIssue=${ticket.key}`,
        title: ticket.fields.summary,
        description: extractDescription(ticket.fields.description),
      });
    }
    return tickets;
  }

  async getTicketById(url: string) {
    const data = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Basic ${this.token}`,
        "Content-Type": "application/json",
      },
    });
    const json = await data.json();
    const status = json.fields.status.name;
    const description = extractDescription(json.fields.description);
    const title = json.fields.summary;
    const ticket: JiraTicketNoUrl = {
      title: title,
      description: description,
      status: status,
      id: json.id,
    };
    return ticket;
  }

  async getAllProject(url: string): Promise<JiraProject[]> {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Basic ${this.token}`,
        "Content-Type": "application/json",
      },
    });
    const json = await response.json();
    const projects: JiraProject[] = [];
    for (const project of json) {
      projects.push({
        id: project.id,
        name: project.name,
      });
    }
    return projects;
  }
}

type JiraDescriptionContent = {
  type: string;
  text?: string;
  content?: JiraDescriptionContent[]; // For nested content like paragraphs
};

type JiraDescription = {
  type: string;
  version: number;
  content: JiraDescriptionContent[];
};

function extractDescription(description: JiraDescription): string {
  if (!description || !description.content) {
    return "No description available";
  }

  const text: string[] = [];

  description.content.forEach((block) => {
    if (block.type === "paragraph") {
      block.content?.forEach((content) => {
        if (content.type === "text" && content.text) {
          text.push(content.text); // TypeScript now knows that content.text is a string
        }
      });
    }
  });

  return text.join("\n");
}
