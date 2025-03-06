import { ApiProperty } from "@nestjs/swagger";
import type { User } from "@prisma/client";
import { Exclude } from "class-transformer";

export class UserEntity implements User {
  constructor(partial: Partial<UserEntity>) {
    Object.assign(this, partial);
  }

  @ApiProperty()
  id: number;

  @ApiProperty()
  email: string;

  @ApiProperty()
  pseudo: string;

  @Exclude()
  password: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
