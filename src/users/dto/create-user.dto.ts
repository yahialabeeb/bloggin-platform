import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, Length } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  @Length(3, 20)
  @ApiProperty()
  name: string;
  @IsNotEmpty()
  @IsEmail()
  @Length(8, 30)
  @ApiProperty()
  email: string;
  @IsNotEmpty()
  @Length(3, 20)
  @ApiProperty()
  username: string;
  @IsNotEmpty()
  @Length(6, 20)
  @ApiProperty()
  password: string;
}
