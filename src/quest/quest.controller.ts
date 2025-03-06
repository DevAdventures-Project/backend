import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe } from '@nestjs/common';
import { QuestService } from './quest.service';
import { CreateQuestDto } from './dto/create-quest.dto';
import { UpdateQuestDto } from './dto/update-quest.dto';
import { QuestEntity } from './entities/quest.entity';
import { ApiTags, ApiCreatedResponse, ApiOkResponse } from '@nestjs/swagger';

@ApiTags('quests')
@Controller('quests')
export class QuestController {
    constructor(private readonly questService: QuestService) {}

    @Post()
    @ApiCreatedResponse({ type: QuestEntity })
    async create(@Body() createQuestDto: CreateQuestDto) {
        const quest = await this.questService.create(createQuestDto);
        return new QuestEntity(quest);
    }

    @Get()
    @ApiOkResponse({ type: QuestEntity, isArray: true })
    async findAll() {
        const quests = await this.questService.findAll();
        return quests.map(quest => new QuestEntity(quest));
    }

    @Get(':id')
    @ApiOkResponse({ type: QuestEntity })
    async findOne(@Param('id', ParseIntPipe) id: number) {
        const quest = await this.questService.findOne(id);
        return new QuestEntity(quest);
    }

    //find by category
    @Get('category/:category')
    @ApiOkResponse({ type: QuestEntity, isArray: true })
    async findByCategory(@Param('category') category: string) {
        const quests = await this.questService.findByCategory(category);
        return quests.map(quest => new QuestEntity(quest));
    }

    @Patch(':id')
    @ApiCreatedResponse({ type: QuestEntity })
    async update(@Param('id', ParseIntPipe) id: number, @Body() updateQuestDto: UpdateQuestDto) {
        const quest = await this.questService.update(id, updateQuestDto);
        return new QuestEntity(quest);
    }

    @Delete(':id')
    @ApiOkResponse({ type: QuestEntity })
    async remove(@Param('id', ParseIntPipe) id: number) {
        const quest = await this.questService.remove(id);
        return new QuestEntity(quest);
    }
}
