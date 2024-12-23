import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotFoundHandler } from '../utils/not-found-handler';
import { findRequest } from '../utils/find-request';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';
import { UpdateUserDto } from './dto/update-user.dto';

const relations = ['blogs', 'comments'];

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  findAll(query) {
    return this.usersRepository.find(
      findRequest({
        relations,
        query,
        fields: Object.keys(this.usersRepository.metadata.propertiesMap),
      }),
    );
  }

  async findOne(username: string) {
    return await this.usersRepository.findOne({
      where: { username },
    });
  }

  async findOneById(id: string) {
    return NotFoundHandler({
      action: 'find',
      result: await this.usersRepository.findOne({
        where: { id },
      }),
    });
  }

  async create(userDto: CreateUserDto) {
    const res = await this.usersRepository.save(userDto);
    return res;
  }

  async createMany(userDtos: CreateUserDto[]) {
    const batch = [];
    userDtos.forEach((userDto) => {
      batch.push(this.usersRepository.create(userDto));
    });
    const res = await this.usersRepository.save(batch);
    return res;
  }

  async update(id: string, userDto: UpdateUserDto) {
    return NotFoundHandler({
      action: 'update',
      result: await this.usersRepository.update(id, userDto),
    });
  }

  async remove(id: string) {
    return NotFoundHandler({
      action: 'delete',
      result: await this.usersRepository.delete(id),
    });
  }
}
