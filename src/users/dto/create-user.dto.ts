// src/users/dto/create-user.dto.ts

import { IsEmail, IsNotEmpty, MinLength, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

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
