import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from "@nestjs/common";
import { ApiCreatedResponse, ApiOkResponse, ApiTags } from "@nestjs/swagger";
import { CreateItemDto } from "./dto/create-item.dto";
import { UpdateItemDto } from "./dto/update-item.dto";
import { ItemEntity } from "./entities/item.entity";
import { ItemsService } from "./items.service";

@ApiTags("items")
@Controller("items")
export class ItemsController {
  constructor(private readonly itemsService: ItemsService) {}

  @Post()
  @ApiCreatedResponse({ type: ItemEntity })
  async create(@Body() createItemDto: CreateItemDto) {
    const item = await this.itemsService.create(createItemDto);
    return new ItemEntity(item);
  }

  @Get()
  @ApiOkResponse({ type: ItemEntity, isArray: true })
  async findAll() {
    const items = await this.itemsService.findAll();
    return items.map((item) => new ItemEntity(item));
  }

  @Get(":id")
  @ApiOkResponse({ type: ItemEntity })
  async findOne(@Param("id", ParseIntPipe) id: number) {
    const item = await this.itemsService.findOne(id);
    return new ItemEntity(item);
  }

  @Patch(":id")
  @ApiCreatedResponse({ type: ItemEntity })
  async update(
    @Param("id", ParseIntPipe) id: number,
    @Body() updateItemDto: UpdateItemDto,
  ) {
    const item = await this.itemsService.update(id, updateItemDto);
    return new ItemEntity(item);
  }

  @Delete(":id")
  @ApiOkResponse({ type: ItemEntity })
  async remove(@Param("id", ParseIntPipe) id: number) {
    const item = await this.itemsService.remove(id);
    return new ItemEntity(item);
  }
}
