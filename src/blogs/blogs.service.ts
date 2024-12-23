import { Injectable } from '@nestjs/common';
import { CreateBlogDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';
import { Blog } from './entities/blog.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotFoundHandler } from '../utils/not-found-handler';
import { findRequest } from '../utils/find-request';

const relations = ['comments', 'author'];

@Injectable()
export class BlogsService {
  constructor(
    @InjectRepository(Blog)
    private blogsRepository: Repository<Blog>,
  ) {}

  create(createBlogDto: CreateBlogDto) {
    return this.blogsRepository.save(createBlogDto).then((res) => res);
  }

  findAll(query) {
    return this.blogsRepository.find(
      findRequest({
        relations,
        query,
        fields: Object.keys(this.blogsRepository.metadata.propertiesMap),
      }),
    );
  }

  async findOne(id: string) {
    return NotFoundHandler({
      action: 'find',
      result: await this.blogsRepository.findOne({
        where: { id },
      }),
    });
  }

  async update(id: string, updateBlogDto: UpdateBlogDto) {
    return NotFoundHandler({
      action: 'update',
      result: await this.blogsRepository.update(id, updateBlogDto),
    });
  }

  async remove(id: string) {
    return NotFoundHandler({
      action: 'delete',
      result: await this.blogsRepository.delete(id),
    });
  }
}
