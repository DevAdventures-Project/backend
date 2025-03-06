import { Module } from "@nestjs/common";
import { PrismaModule } from "../prisma/prisma.module";
import { JiraController } from "./jira.controller";
import { JiraService } from "./jira.service";
import { JiraWebhookController } from "./jira-webhook.controller";
import { QuestModule } from "src/quest/quest.module";

@Module({
  controllers: [JiraController,JiraWebhookController],
  providers: [JiraService],
  imports: [PrismaModule,QuestModule],
})
export class JiraModule {}
