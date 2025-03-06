import { Injectable } from "@nestjs/common";
import type { PrismaService } from "../prisma/prisma.service";
import type { CreateMessageDto } from "./dto/create-message.dto";

@Injectable()
export class ChatService {
  constructor(private prisma: PrismaService) {}

  async create(createMessageDto: CreateMessageDto) {
    return this.prisma.message.create({
      data: createMessageDto,
    });
  }

  async findAllByRoom(room: string) {
    return this.prisma.message.findMany({
      where: { room },
      orderBy: { createdAt: "asc" },
    });
  }
}
