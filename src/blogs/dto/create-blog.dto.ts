import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsUUID, Length } from 'class-validator';

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
  @ApiProperty()
  content: string;

  @IsNotEmpty()
  @IsEnum(['published', 'draft'])
  @ApiProperty({ enum: ['published', 'draft'], enumName: 'status' })
  status: string;

  @IsNotEmpty()
  @ApiProperty()
  thumbnail: string;

  @IsNotEmpty()
  @ApiProperty()
  @IsUUID()
  authorId: string;
}
