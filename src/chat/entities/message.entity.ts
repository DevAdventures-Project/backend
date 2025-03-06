import { ApiProperty } from '@nestjs/swagger';
import { Message } from '@prisma/client';

export class MessageEntity implements Message {
    constructor(partial: Partial<MessageEntity>) {
        Object.assign(this, partial);
    }

    @ApiProperty()
    id: number;

    @ApiProperty()
    content: string;

    @ApiProperty()
    authorId: number;

    @ApiProperty()
    room: string;

    @ApiProperty()
    createdAt: Date;

    @ApiProperty()
    updatedAt: Date;
}
