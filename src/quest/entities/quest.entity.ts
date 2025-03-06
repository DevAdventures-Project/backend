import { ApiProperty } from "@nestjs/swagger";
import type { Quest } from "@prisma/client";

export class QuestEntity implements Quest {
  constructor(partial: Partial<QuestEntity>) {
    Object.assign(this, partial);
  }

  @ApiProperty()
  id: number;

  @ApiProperty()
  title: string;

  @ApiProperty()
  content: string;

  @ApiProperty()
  link: string;

  @ApiProperty()
  nbHelpers: number;

  @ApiProperty()
  category: string;

  @ApiProperty()
  minimumRank: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  @ApiProperty()
  authorId: number;
}
