import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { CreateQuestDto } from "./dto/create-quest.dto";
import { UpdateQuestDto } from "./dto/update-quest.dto";

@Injectable()
export class QuestService {
  constructor(private prisma: PrismaService) {}

  async create(createQuestDto: CreateQuestDto) {
    return this.prisma.quest.create({
      data: createQuestDto,
    });
  }

  findAll() {
    return this.prisma.quest.findMany({
      include: {
        author: {
          select: {
            id: true,
            pseudo: true,
          },
        },
      },
    });
  }

  async findOne(id: number) {
    const quest = await this.prisma.quest.findUnique({
      where: { id },
      include: {
        author: {
          select: {
            id: true,
            pseudo: true,
          },
        },
      },
    });
    if (!quest) {
      throw new NotFoundException(`Quest with id ${id} not found`);
    }
    return quest;
  }

  //find by category
  async findByCategory(category: string) {
    const quests = await this.prisma.quest.findMany({
      where: { category },
      include: {
        author: {
          select: {
            id: true,
            pseudo: true,
          },
        },
      },
    });
    if (!quests.length) {
      throw new NotFoundException(`Quest with category ${category} not found`);
    }
    return quests;
  }

  async update(id: number, updateQuestDto: UpdateQuestDto) {
    await this.findOne(id);
    return this.prisma.quest.update({
      where: { id },
      data: updateQuestDto,
    });
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.prisma.quest.delete({
      where: { id },
    });
  }
}
