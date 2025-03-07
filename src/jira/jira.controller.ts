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
import { JiraLinkToTicketDto } from "./dto/jira.dto";
import { JiraService } from "./jira.service";

@ApiTags("jira")
@Controller("jira")
export class JiraController {
  jiraService: JiraService;
  constructor() {
    this.jiraService = new JiraService();
  }

  //https://hackathonjirajirajirajirajira.atlassian.net/rest/api/3/issue/10011/transitions
  @Patch() // pass the ticket at done
  @ApiOkResponse()
  async update(@Body() { link }: JiraLinkToTicketDto) {
    const url = new URL(link);
    const ticketKey = url.searchParams.get("selectedIssue");
    if (!ticketKey) {
      throw new Error("Invalid link");
    }
    const ticketDetail = await this.jiraService.getTicketById(
      `${process.env.JIRA_URL}rest/api/3/issue/${ticketKey}`,
    );
    const urlToPatch = `${process.env.JIRA_URL}rest/api/3/issue/${ticketDetail.id}/transitions`;
    return await this.jiraService.update(urlToPatch);
  }

  @Post(":id") //get ticket by id
  @ApiCreatedResponse()
  async getOneTicketById(@Param("id") id: string) {
    const urlJiraForTicket = `${process.env.JIRA_URL}rest/api/3/issue/${id}`;
    return await this.jiraService.getTicketById(urlJiraForTicket);
  }

  @Get(":id")
  @ApiCreatedResponse()
  async getOne(@Param("id") id: string) {
    const jql = `project="${id}" AND status != "Done"`;
    const urlJiraForTicketOfProject = `${process.env.JIRA_URL}rest/api/3/search`;
    const fullUrl = `${urlJiraForTicketOfProject}?jql=${encodeURIComponent(jql)}`;
    return await this.jiraService.getDataTicketProjectId(fullUrl);
  }

  @Get()
  @ApiCreatedResponse()
  async getAllProject() {
    const urlJiraForTicket = `${process.env.JIRA_URL}rest/api/3/project`;
    return await this.jiraService.getAllProject(urlJiraForTicket);
  }
}
