import { ApiProperty } from "@nestjs/swagger";
import { Quest } from "@prisma/client";

export class JiraEntity{
  constructor() {
    
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
  status: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  @ApiProperty()
  authorId: number;
}
