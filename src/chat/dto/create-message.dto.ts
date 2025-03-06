import { IsNotEmpty, IsString, IsInt } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateMessageDto {
    @ApiProperty({ description: 'Contenu du message' })
    @IsNotEmpty()
    @IsString()
    content: string;

    @ApiProperty({ description: "Identifiant de l'auteur (User)" })
    @IsNotEmpty()
    @IsInt()
    authorId: number;

    @ApiProperty({
        description: 'Identifiant de la room (ex. "global" pour le chat global ou l’id d’une quête)',
    })
    @IsNotEmpty()
    @IsString()
    room: string;
}
