import { Controller, Post, Get, Body, Param } from '@nestjs/common';
import { ChatService } from './chat.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { MessageEntity } from './entities/message.entity';
import { ApiTags, ApiCreatedResponse, ApiOkResponse } from '@nestjs/swagger';

@ApiTags('chat')
@Controller('chat')
export class ChatController {
    constructor(private readonly chatService: ChatService) {}

    @Post()
    @ApiCreatedResponse({ type: MessageEntity })
    async create(@Body() createMessageDto: CreateMessageDto) {
        const message = await this.chatService.create(createMessageDto);
        return new MessageEntity(message);
    }

    @Get('room/:room')
    @ApiOkResponse({ type: MessageEntity, isArray: true })
    async findAllByRoom(@Param('room') room: string) {
        const messages = await this.chatService.findAllByRoom(room);
        return messages.map(message => new MessageEntity(message));
    }
}
