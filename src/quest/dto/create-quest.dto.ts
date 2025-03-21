import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsDate, IsInt, IsNotEmpty, IsString, IsUrl } from "class-validator";

export class CreateQuestDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  content: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsUrl()
  link: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsInt()
  nbHelpers: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  category: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  status: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  minimumRank: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsInt()
  authorId: number;

  @ApiProperty({ type: Date })
  @IsNotEmpty()
  @IsDate()
  @Type(() => Date)
  deadline: Date;
}
