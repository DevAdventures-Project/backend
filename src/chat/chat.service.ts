import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { CreateMessageDto } from "./dto/create-message.dto";

@Injectable()
export class ChatService {
  constructor(private prisma: PrismaService) {}

  async create(createMessageDto: CreateMessageDto) {
    return this.prisma.message.create({
      data: createMessageDto,
    });
  }

  async findAllMessages() {
    return this.prisma.message.findMany({
      orderBy: { createdAt: "asc" },
      include: {
        author: {
          select: {
            id: true,
            pseudo: true,
          },
        },
        quest: {
          select: {
            id: true,
            title: true,
          },
        },
      },
    });
  }
}
