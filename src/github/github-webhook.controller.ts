import {
  Body,
  Controller,
  Headers,
  HttpCode,
  HttpStatus,
  Post,
} from "@nestjs/common";
import { QuestService } from "../quest/quest.service";

interface GithubIssue {
  html_url: string;
  number: number;
  title: string;
  // Ajoutez d'autres propriétés si nécessaire
}

interface GithubIssueWebhookPayload {
  action: "opened" | "closed" | "reopened" | string;
  issue: GithubIssue;
}

@Controller("github/webhooks")
export class GithubWebhookController {
  constructor(private readonly questService: QuestService) {}

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
        }
      }
    }
    return { success: true };
  }
}
