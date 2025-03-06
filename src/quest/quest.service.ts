import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { CreateQuestDto } from "./dto/create-quest.dto";
import { UpdateQuestDto } from "./dto/update-quest.dto";

@Injectable()
export class QuestService {
  constructor(private prisma: PrismaService) {}

  async create(createQuestDto: CreateQuestDto) {
    // Vérifier si l'utilisateur existe
    const author = await this.prisma.user.findUnique({
      where: { id: createQuestDto.authorId },
    });

    if (!author) {
      throw new NotFoundException(
        `User with id ${createQuestDto.authorId} not found`,
      );
    }

    return this.prisma.quest.create({
      data: createQuestDto,
    });
  }

  //user register to a quest
  async registerToQuest(questId: number, userId: number) {
    // Vérifier si l'utilisateur existe
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException(`User with id ${userId} not found`);
    }

    // Vérifier si la quête existe
    const quest = await this.prisma.quest.findUnique({
      where: { id: questId },
    });

    if (!quest) {
      throw new NotFoundException(`Quest with id ${questId} not found`);
    }

    return this.prisma.quest.update({
      where: { id: questId },
      data: {
        helpers: {
          connect: {
            id: userId,
          },
        },
      },
    });
  }

  // Désinscription d'une quête
  async unregisterFromQuest(questId: number, userId: number) {
    // Vérifier si l'utilisateur existe
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });
    if (!user) {
      throw new NotFoundException(`User with id ${userId} not found`);
    }

    // Vérifier si la quête existe
    const quest = await this.prisma.quest.findUnique({
      where: { id: questId },
    });
    if (!quest) {
      throw new NotFoundException(`Quest with id ${questId} not found`);
    }

    // Déconnecter l'utilisateur de la relation "helpers"
    return this.prisma.quest.update({
      where: { id: questId },
      data: {
        helpers: {
          disconnect: { id: userId },
        },
      },
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
        helpers: {
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
        helpers: {
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
        helpers: {
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

  // Trouver une quête liée à une issue (en utilisant le champ "link")
  async findByIssueUrl(issueUrl: string) {
    return this.prisma.quest.findFirst({
      where: { link: issueUrl },
    });
  }

  // Mettre à jour le statut d'une quête
  async updateStatus(questId: number, status: string) {
    // Vous pouvez adapter la logique pour inclure d'autres validations
    return this.prisma.quest.update({
      where: { id: questId },
      data: { status },
    });
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
