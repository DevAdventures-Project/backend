import { Module } from "@nestjs/common";
import { UsersModule } from "src/users/users.module";
import { PrismaModule } from "../prisma/prisma.module";
import { QuestModule } from "../quest/quest.module";
import { GithubWebhookController } from "./github-webhook.controller";
import { GithubController } from "./github.controller";
import { GithubService } from "./github.service";

@Module({
  controllers: [GithubController, GithubWebhookController],
  providers: [GithubService],
  imports: [PrismaModule, QuestModule, UsersModule],
})
export class GithubModule {}
