import { Module } from "@nestjs/common";
import { PrismaModule } from "../prisma/prisma.module";
import { QuestController } from "./quest.controller";
import { QuestService } from "./quest.service";

@Module({
  controllers: [QuestController],
  providers: [QuestService],
  imports: [PrismaModule],
})
export class QuestModule {}
