import { randomInt } from "node:crypto";
import {
  Body,
  Controller,
  Headers,
  HttpCode,
  HttpStatus,
  Post,
} from "@nestjs/common";
import { UsersService } from "src/users/users.service";
import { QuestService } from "../quest/quest.service";
import { JiraService } from "./jira.service";

@Controller("jira/webhook")
export class JiraWebhookController {
  constructor(
    private readonly questService: QuestService,
    private readonly jiraService: JiraService,
    private readonly userService: UsersService,
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
      const randomValue = randomInt(10, 100);
      for (const helper of quest.helpers) {
        await this.userService.updateCoins(helper.id, randomValue);
      }
    }
    return { status: "success" };
  }
}
