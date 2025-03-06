import * as process from "node:process";
import { Injectable } from "@nestjs/common";

@Injectable()
export class JiraService {
  token: string;
  constructor() {
    this.token = Buffer.from(
      `${process.env.JIRA_EMAIL}:${process.env.JIRA_TOKEN}`,
    ).toString("base64");
  }

  async update(url: string) {
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
        console.log(transition.id);
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
  }
}
