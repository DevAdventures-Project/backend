import { Module } from "@nestjs/common";
import { ScheduleModule } from "@nestjs/schedule";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { AuthModule } from "./auth/auth.module";
import { ChatModule } from "./chat/chat.module";
import { ItemsModule } from "./items/items.module";
import { PrismaModule } from "./prisma/prisma.module";
import { QuestModule } from "./quest/quest.module";
import { UsersModule } from "./users/users.module";
import { WebsocketsGateway } from "./ws/websockets.gateway";

@Module({
  imports: [
    PrismaModule,
    UsersModule,
    QuestModule,
    ItemsModule,
    ChatModule,
    AuthModule,
    ScheduleModule.forRoot()
  ],
  controllers: [AppController],
  providers: [AppService, WebsocketsGateway]
})
export class AppModule {}
