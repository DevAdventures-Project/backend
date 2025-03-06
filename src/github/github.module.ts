import { Module } from "@nestjs/common";
import { PrismaModule } from "../prisma/prisma.module";
import { QuestModule } from "../quest/quest.module";
import { GithubWebhookController } from "./github-webhook.controller";
import { GithubController } from "./github.controller";
import { GithubService } from "./github.service";

@Module({
  controllers: [GithubController, GithubWebhookController],
  providers: [GithubService],
  imports: [PrismaModule, QuestModule],
})
export class GithubModule {}
