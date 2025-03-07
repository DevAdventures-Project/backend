import { randomInt } from "node:crypto";
import {
  Body,
  Controller,
  Headers,
  HttpCode,
  HttpStatus,
  Post,
} from "@nestjs/common";
import { ApiCreatedResponse, ApiOkResponse, ApiTags } from "@nestjs/swagger";
import { UsersService } from "src/users/users.service";
import { QuestService } from "../quest/quest.service";
import { JiraService } from "./jira.service";

@Controller("hackathonjira/webhook")
export class JiraWebhookController {
  constructor(
    private readonly questService: QuestService,
    private readonly jiraService: JiraService,
    private readonly userService: UsersService,
  ) {}

  @Post()
  // biome-ignore lint/suspicious/noExplicitAny: easier
  async webhook(@Body() body: any, @Headers() headers: unknown) {
    const id = body.issue.id;
    const key = body.issue.key;
    console.log(`Issue id:: ${id}`);

    const urlJiraForTicket = `${process.env.JIRA_URL}rest/api/3/issue/${id}`;
    const jiraTicket = await this.jiraService.getTicketById(urlJiraForTicket);
    console.log(`JiraTicket:: ${jiraTicket.status}`);

    if (jiraTicket.status === "Terminé(e)") {
      const quest = await this.questService.findByJiraKey(key);
      console.log(`Quest:: ${quest}`);
      if (quest) {
        await this.questService.updateStatus(quest.id, "closed");
        const randomValue = randomInt(10, 100);
        for (const helper of quest.helpers) {
          await this.userService.updateCoins(helper.id, randomValue);
        }
        return true;
      }
    }

    return false;
  }
}
