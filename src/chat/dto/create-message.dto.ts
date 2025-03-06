import { ApiProperty } from "@nestjs/swagger";
import { IsInt, IsNotEmpty, IsString } from "class-validator";

export class CreateMessageDto {
  @ApiProperty({ description: "Contenu du message" })
  @IsNotEmpty()
  @IsString()
  content: string;

  @ApiProperty({ description: "Identifiant de l'auteur (User)" })
  @IsNotEmpty()
  @IsInt()
  authorId: number;

  @ApiProperty({
    description: "Identifiant de la quête à laquelle le message est associé",
  })
  @IsNotEmpty()
  @IsInt()
  questId: number;
}
