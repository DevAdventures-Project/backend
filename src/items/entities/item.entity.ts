import { ApiProperty } from "@nestjs/swagger";
import { Item } from "@prisma/client";

export class ItemEntity implements Item {
  constructor(partial: Partial<ItemEntity>) {
    Object.assign(this, partial);
  }

  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
