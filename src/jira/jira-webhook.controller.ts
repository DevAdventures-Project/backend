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
  async webhook(@Body() body: JiraWebhookBody, @Headers() headers: unknown) {
    const id = body.issue.id;
    const urlJiraForTicket = `${process.env.JIRA_URL}rest/api/3/issue/${id}`;
    console.log(`Issue id:: ${id}`);
    const jiraTicket = await this.jiraService.getTicketById(urlJiraForTicket);
    console.log(`JiraTicket:: ${jiraTicket}`);
    if (jiraTicket.status === "Terminé(e)") {
      const quest = await this.questService.findByJiraId(id);
      console.log(`Quest:: ${quest}`);
      if (quest) {
        await this.questService.updateStatus(quest.id, "closed");
      }
      return { status: "success" };
    }
    console.log("Webhook received:", body);
    console.log("Headers:", headers);

    return { status: "fail" };
  }
}
