import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateItemDto } from './dto/create-item.dto';
import { UpdateItemDto } from './dto/update-item.dto';

@Injectable()
export class ItemsService {
    constructor(private readonly prisma: PrismaService) {}

    async create(createItemDto: CreateItemDto) {
        return this.prisma.item.create({
            data: createItemDto,
        });
    }

    findAll() {
        return this.prisma.item.findMany();
    }

    async findOne(id: number) {
        const item = await this.prisma.item.findUnique({
            where: { id },
        });
        if (!item) {
            throw new NotFoundException(`Item with id ${id} not found`);
        }
        return item;
    }

    async update(id: number, updateItemDto: UpdateItemDto) {
        // Vérification de l'existence de l'item
        await this.findOne(id);
        return this.prisma.item.update({
            where: { id },
            data: updateItemDto,
        });
    }

    async remove(id: number) {
        await this.findOne(id);
        return this.prisma.item.delete({
            where: { id },
        });
    }
}
