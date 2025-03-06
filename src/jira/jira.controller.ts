import * as process from "node:process";
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from "@nestjs/common";
import { ApiCreatedResponse, ApiOkResponse, ApiTags } from "@nestjs/swagger";
import axios from "axios";
import { JiraService } from "./jira.service";

@ApiTags("jira")
@Controller("jira")
export class JiraController {
  jiraService: JiraService;
  constructor() {
    this.jiraService = new JiraService();
  }

  @Patch(":id")
  @ApiOkResponse()
  async update(@Param("id") id: string) {
    const urlJiraForTicket = `${process.env.JIRA_URL}/rest/api/3/issue/${id}/transitions`;
    return await this.jiraService.update(urlJiraForTicket);
  }

  @Post()
  @ApiCreatedResponse()
  async create() {
    const auth = Buffer.from(
      `${process.env.JIRA_EMAIL}:${process.env.JIRA_TOKEN}`,
    ).toString("base64");

    axios.post(
      `${process.env.JIRA_URL}/rest/api/3/issue`,
      {
        fields: {
          project: {
            key: "SCRUM",
          },
          summary: "New issue created via API",
          description: "This is a description of the new issue.",
          issuetype: {
            name: "Task",
          },
        },
      },
      {
        headers: {
          Authorization: `Basic ${auth}`, // Pass the authorization header with base64-encoded email and API token
          "Content-Type": "application/json", // Set content type to JSON
        },
      },
    );
  }
}
