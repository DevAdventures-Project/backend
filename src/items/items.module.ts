import { Module } from "@nestjs/common";
import { PrismaModule } from "../prisma/prisma.module";
import { ItemsController } from "./items.controller";
import { ItemsService } from "./items.service";

@Module({
  controllers: [ItemsController],
  providers: [ItemsService],
  imports: [PrismaModule],
})
export class ItemsModule {}
