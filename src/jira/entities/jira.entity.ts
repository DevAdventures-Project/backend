import { ApiProperty } from "@nestjs/swagger";


export class JiraEntity {
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
