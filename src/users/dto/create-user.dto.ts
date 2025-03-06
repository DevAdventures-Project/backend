import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString, MinLength } from "class-validator";

export class CreateUserDto {
  @ApiProperty()
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ required: false })
  pseudo: string;

  @ApiProperty()
  @MinLength(6)
  @IsNotEmpty()
  @IsString()
  password: string;
}
