import { Module } from "@nestjs/common";
import { QuestModule } from "src/quest/quest.module";
import { UsersModule } from "src/users/users.module";
import { PrismaModule } from "../prisma/prisma.module";
import { JiraWebhookController } from "./jira-webhook.controller";
import { JiraController } from "./jira.controller";
import { JiraService } from "./jira.service";

@Module({
  controllers: [JiraController, JiraWebhookController],
  providers: [JiraService],
  imports: [PrismaModule, QuestModule, UsersModule],
})
export class JiraModule {}
