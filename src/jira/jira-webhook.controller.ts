import {
  Body,
  Controller,
  Headers,
  HttpCode,
  HttpStatus,
  Post,
} from "@nestjs/common";
import { QuestService } from "../quest/quest.service";

@Controller("jira/webhook")
export class JiraWebhookController {
  constructor(private readonly questService: QuestService) {}

  @Post()
  @HttpCode(HttpStatus.OK)
  async webhook(@Body() body: any, @Headers() headers: any) {
    // Here, you can verify the request if Jira sends a verification token
    console.log('Webhook received:', body);
    console.log('Headers:', headers);
    
    // Process the webhook data in your service

    // Respond with a success message
    return { status: 'success' };
  }
}
