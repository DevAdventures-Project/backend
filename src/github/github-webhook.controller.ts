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

interface GithubIssue {
  html_url: string;
  number: number;
  title: string;
}

interface GithubIssueWebhookPayload {
  action: "opened" | "closed" | "reopened" | string;
  issue: GithubIssue;
}

@Controller("github/webhooks")
export class GithubWebhookController {
  constructor(
    private readonly questService: QuestService,
    private readonly userService: UsersService,
  ) {}

  @Post()
  @HttpCode(HttpStatus.OK)
  async handleWebhook(
    @Headers("x-github-event") event: string,
    @Body() payload: GithubIssueWebhookPayload,
  ): Promise<{ success: boolean }> {
    console.log(payload);
    if (event === "issues") {
      const { action, issue } = payload;
      if (action === "closed" && issue) {
        const issueUrl = issue.html_url;
        const quest = await this.questService.findByIssueUrl(issueUrl);
        if (quest) {
          await this.questService.updateStatus(quest.id, "closed");
          const randomValue = randomInt(10, 100);
          for (const helper of quest.helpers) {
            await this.userService.updateCoins(helper.id, randomValue);
          }
        }
      }
    }
    return { success: true };
  }
}
