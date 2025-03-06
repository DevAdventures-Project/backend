import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import {PrismaModule} from "./prisma/prisma.module";
import {UsersModule} from "./users/users.module";
import {AuthModule} from "./auth/auth.module";
import { ScheduleModule } from '@nestjs/schedule';
import {QuestModule} from "./quest/quest.module";
import {ItemsModule} from "./items/items.module";
import {ChatModule} from "./chat/chat.module";

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
  providers: [AppService],
})
export class AppModule {}