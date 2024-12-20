import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, Length } from 'class-validator';

export class SigninDto {
  @IsNotEmpty()
  @Length(3, 20)
  @ApiProperty()
  username: string;
  @IsNotEmpty()
  @Length(6, 20)
  @ApiProperty()
  password: string;
}
