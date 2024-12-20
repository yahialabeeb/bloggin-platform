import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUUID, Length } from 'class-validator';
export class CreateCommentDto {
  @IsNotEmpty()
  @Length(3, 20)
  @ApiProperty()
  content: string;

  @IsNotEmpty()
  @ApiProperty()
  @IsUUID()
  authorId: string;

  @IsNotEmpty()
  @ApiProperty()
  @IsUUID()
  blogId: string;
}
