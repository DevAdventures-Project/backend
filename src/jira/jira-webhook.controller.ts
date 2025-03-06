import {
  Body,
  Controller,
  Headers,
  HttpCode,
  HttpStatus,
  Post,
} from "@nestjs/common";
import { QuestService } from "../quest/quest.service";

interface JiraWebhookBody {
  issue: {
    id: string;
  };
}

@Controller("jira/webhook")
export class JiraWebhookController {
  constructor(private readonly questService: QuestService) {}

  @Post()
  @HttpCode(HttpStatus.OK)
  async webhook(@Body() body: JiraWebhookBody, @Headers() headers: unknown) {
    const id = body.issue.id;
    console.log(id);
    const quest = await this.questService.findByJiraId(id);
    if (quest) {
      await this.questService.updateStatus(quest.id, "closed");
    }
    console.log("Webhook received:", body);
    console.log("Headers:", headers);
    
    return { status: "success" };
  }
}
