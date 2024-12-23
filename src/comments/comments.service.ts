import { Injectable } from '@nestjs/common';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotFoundHandler } from '../utils/not-found-handler';
import { findRequest } from '../utils/find-request';
import { Comment } from './entities/comment.entity';

const relations = ['blog', 'author'];

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(Comment)
    private commentsRepository: Repository<Comment>,
  ) {}

  create(createCommentDto: CreateCommentDto) {
    return this.commentsRepository.save(createCommentDto).then((res) => res);
  }

  findAll(query) {
    return this.commentsRepository.find(
      findRequest({
        relations,
        query,
        fields: Object.keys(this.commentsRepository.metadata.propertiesMap),
      }),
    );
  }

  async findOne(id: string) {
    return NotFoundHandler({
      action: 'find',
      result: await this.commentsRepository.findOne({
        where: { id },
      }),
    });
  }

  async update(id: string, updateCommentDto: UpdateCommentDto) {
    return NotFoundHandler({
      action: 'update',
      result: await this.commentsRepository.update(id, updateCommentDto),
    });
  }

  async remove(id: string) {
    return NotFoundHandler({
      action: 'delete',
      result: await this.commentsRepository.delete(id),
    });
  }
}
