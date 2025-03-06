import { Module } from "@nestjs/common";
import { PrismaModule } from "../prisma/prisma.module";
import { GithubController } from "./github.controller";
import { GithubService } from "./github.service";

@Module({
  controllers: [GithubController],
  providers: [GithubService],
  imports: [PrismaModule],
})
export class GithubModule {}
