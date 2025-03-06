import {
  Body,
  Controller,
  Headers,
  HttpCode,
  HttpStatus,
  Post,
} from "@nestjs/common";
import { QuestService } from "../quest/quest.service";
import { JiraService } from "./jira.service";

interface JiraWebhookBody {
  issue: {
    id: string;
  };
}

@Controller("jira/webhook")
export class JiraWebhookController {
  constructor(
    private readonly questService: QuestService,
    private readonly jiraService: JiraService,
  ) {}

  @Post()
  @HttpCode(HttpStatus.OK)
  // biome-ignore lint/suspicious/noExplicitAny: easier
  async webhook(@Body() body: any, @Headers() headers: unknown) {
    const id = body.issue.id;
    const urlJiraForTicket = `${process.env.JIRA_URL}rest/api/3/issue/${id}`;
    console.log(`Issue id:: ${id}`);
    console.log(`UrlJiraForTicket:: ${urlJiraForTicket}`);
    const jiraTicket = await this.jiraService.getTicketById(urlJiraForTicket);
    console.log(`JiraTicket:: ${jiraTicket}`);
    //jiraTicket.status === "Terminé(e)") {
    const quest = await this.questService.findByJiraId(id);
    console.log(`Quest:: ${quest}`);
    if (quest) {
      await this.questService.updateStatus(quest.id, "closed");
    }
    return { status: "success" };
  }
}
