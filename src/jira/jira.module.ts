import { Module } from "@nestjs/common";
import { PrismaModule } from "../prisma/prisma.module";
import { JiraController } from "./jira.controller";
import { JiraService } from "./jira.service";

@Module({
  controllers: [JiraController],
  providers: [JiraService],
  imports: [PrismaModule],
})
export class JiraModule {}
