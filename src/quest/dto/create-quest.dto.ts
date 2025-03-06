import { IsNotEmpty, IsString, IsInt, IsUrl } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

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
    minimumRank: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsInt()
    authorId: number;
}
