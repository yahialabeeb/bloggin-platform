import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotFoundHandler } from '../utils/not-found-handler';
import { findRequest } from '../utils/find-request';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';
import { UpdateUserDto } from './dto/update-user.dto';

const relations = ['blogs'];

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  findAll(query) {
    return this.usersRepository.find(findRequest({ relations, query }));
  }

  count(query) {
    return this.usersRepository.count(findRequest({ relations, query }));
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

  create(userDto: CreateUserDto) {
    return this.usersRepository.save(userDto).then((res) => res);
  }

  createMany(userDtos: CreateUserDto[]) {
    const batch = [];
    userDtos.forEach((userDto) => {
      batch.push(this.usersRepository.create(userDto));
    });
    return this.usersRepository.save(batch).then((res) => res);
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
