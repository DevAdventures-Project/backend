import { ApiProperty } from "@nestjs/swagger";
import { UserQuestRank } from "@prisma/client";

export class UserQuestRankEntity implements UserQuestRank {
  constructor(partial: Partial<UserQuestRankEntity>) {
    Object.assign(this, partial);
  }

  @ApiProperty()
  id: number;

  @ApiProperty()
  rank: string;

  @ApiProperty()
  rankValue: number;

  @ApiProperty()
  category: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  @ApiProperty()
  userId: number;
}
