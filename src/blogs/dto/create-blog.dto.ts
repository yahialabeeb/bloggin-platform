import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, Length } from 'class-validator';
import { User } from 'src/users/entities/user.entity';

export class CreateBlogDto {
  @IsNotEmpty()
  @Length(3, 20)
  @ApiProperty()
  title: string;

  @IsNotEmpty()
  @Length(3, 20)
  @ApiProperty()
  brief: string;

  @IsNotEmpty()
  @Length(3, 20)
  @ApiProperty()
  content: string;

  @IsNotEmpty()
  @Length(3, 20)
  @ApiProperty()
  author: User;

  @IsNotEmpty()
  @ApiProperty()
  status: string;

  @ApiProperty()
  thumbnail: string;
}
