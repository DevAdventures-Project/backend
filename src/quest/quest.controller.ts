import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Req,
  UseGuards,
} from "@nestjs/common";
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiTags,
} from "@nestjs/swagger";
import { User } from "@prisma/client";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { CreateQuestDto } from "./dto/create-quest.dto";
import { UpdateQuestDto } from "./dto/update-quest.dto";
import { QuestEntity } from "./entities/quest.entity";
import { QuestService } from "./quest.service";

@ApiTags("quests")
@Controller("quests")
export class QuestController {
  constructor(private readonly questService: QuestService) {}

  @Post()
  @ApiCreatedResponse({ type: QuestEntity })
  async create(@Body() createQuestDto: CreateQuestDto) {
    const quest = await this.questService.create(createQuestDto);
    return new QuestEntity(quest);
  }

  // Inscription à une quête via le token
  @Post(":id/register")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiCreatedResponse({ type: QuestEntity })
  async registerToQuest(
    @Param("id", ParseIntPipe) questId: number,
    @Req() req: { user: User },
  ) {
    const quest = await this.questService.registerToQuest(questId, req.user.id);
    return new QuestEntity(quest);
  }

  // Désinscription d'une quête via le token
  @Delete(":id/unregister")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOkResponse({ type: QuestEntity })
  async unregisterFromQuest(
    @Param("id", ParseIntPipe) questId: number,
    @Req() req: { user: User },
  ) {
    const quest = await this.questService.unregisterFromQuest(
      questId,
      req.user.id,
    );
    return new QuestEntity(quest);
  }

  @Get()
  @ApiOkResponse({ type: QuestEntity, isArray: true })
  async findAll() {
    const quests = await this.questService.findAll();
    return quests.map((quest) => new QuestEntity(quest));
  }

  @Get(":id")
  @ApiOkResponse({ type: QuestEntity })
  async findOne(@Param("id", ParseIntPipe) id: number) {
    const quest = await this.questService.findOne(id);
    return new QuestEntity(quest);
  }

  //find by category
  @Get("category/:category")
  @ApiOkResponse({ type: QuestEntity, isArray: true })
  async findByCategory(@Param("category") category: string) {
    const quests = await this.questService.findByCategory(category);
    return quests.map((quest) => new QuestEntity(quest));
  }

  @Patch(":id")
  @ApiCreatedResponse({ type: QuestEntity })
  async update(
    @Param("id", ParseIntPipe) id: number,
    @Body() updateQuestDto: UpdateQuestDto,
  ) {
    const quest = await this.questService.update(id, updateQuestDto);
    return new QuestEntity(quest);
  }

  @Delete(":id")
  @ApiOkResponse({ type: QuestEntity })
  async remove(@Param("id", ParseIntPipe) id: number) {
    const quest = await this.questService.remove(id);
    return new QuestEntity(quest);
  }
}
