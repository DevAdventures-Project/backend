import { ApiProperty } from "@nestjs/swagger";
import { Message } from "@prisma/client";
import { Type } from "class-transformer";
import { UserEntity } from "../../users/entities/user.entity";

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

  @ApiProperty({ type: () => UserEntity, required: false })
  @Type(() => UserEntity)
  author?: Partial<UserEntity>;
}
