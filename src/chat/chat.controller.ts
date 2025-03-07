import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { ApiCreatedResponse, ApiOkResponse, ApiTags } from "@nestjs/swagger";
import { ChatService } from "./chat.service";
import { CreateMessageDto } from "./dto/create-message.dto";
import { MessageEntity } from "./entities/message.entity";

@ApiTags("chat")
@Controller("chat")
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post()
  @ApiCreatedResponse({ type: MessageEntity })
  async create(@Body() createMessageDto: CreateMessageDto) {
    const message = await this.chatService.create(createMessageDto);
    return new MessageEntity(message);
  }

  @Get("")
  @ApiOkResponse({ type: MessageEntity, isArray: true })
  async findAllMessages() {
    const messages = await this.chatService.findAllMessages();
    return messages.map((message) => new MessageEntity(message));
  }
}
