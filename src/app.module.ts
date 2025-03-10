import { Module } from "@nestjs/common";
import { ScheduleModule } from "@nestjs/schedule";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { AuthModule } from "./auth/auth.module";
import { ChatModule } from "./chat/chat.module";
import { GithubModule } from "./github/github.module";
import { ItemsModule } from "./items/items.module";
import { JiraModule } from "./jira/jira.module";
import { MarketplaceModule } from "./marketplace/marketplace.module";
import { PrismaModule } from "./prisma/prisma.module";
import { QuestModule } from "./quest/quest.module";
import { UsersModule } from "./users/users.module";
import { WebsocketsGateway } from "./ws/websockets.gateway";

@Module({
  imports: [
    PrismaModule,
    JiraModule,
    UsersModule,
    QuestModule,
    ItemsModule,
    ChatModule,
    MarketplaceModule,
    GithubModule,
    AuthModule,
    ScheduleModule.forRoot(),
  ],
  controllers: [AppController],
  providers: [AppService, WebsocketsGateway],
})
export class AppModule {}
