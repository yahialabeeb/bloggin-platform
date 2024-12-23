import { BadRequestException, Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { hash, compare } from 'bcryptjs';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import {
  AccessTokenPayload,
  AccountWithTokens,
} from 'src/auth/dto/account-with-tokens.dto';

@Injectable()
export class AuthService {
  constructor(
    private configService: ConfigService,
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async signup(createUserDto: CreateUserDto): Promise<AccountWithTokens> {
    const { name, username, email, password } = createUserDto;

    const user = await this.usersService.findOne(username);
    if (user) throw new BadRequestException('username is exist');

    const createdUser = await this.usersService.create({
      ...createUserDto,
      password: await hash(password, 10),
    });

    const payload = {
      sub: createdUser.id,
      username,
      email,
      iss: 'blog.com',
    };

    const { accessToken, refreshToken } =
      await this._generateAuthTokens(payload);
    return {
      id: createdUser.id,
      name,
      username,
      email,
      accessToken,
      refreshToken,
      expiresIn: this.configService.get<number>('JWT_EXPIRES_IN'),
    };
  }

  async login({ username, password }): Promise<AccountWithTokens> {
    const user = await this.validateUserCredentials({
      username,
      password,
    });
    if (!user) return null;
    const { id, email, name } = user;
    const payload = { sub: id, username, email, iss: 'blog.com' };
    const { accessToken, refreshToken } =
      await this._generateAuthTokens(payload);
    return {
      id,
      name,
      username,
      email,
      accessToken,
      refreshToken,
      expiresIn: this.configService.get<number>('JWT_EXPIRES_IN'),
    };
  }

  async refresh(payload: AccessTokenPayload) {
    const tokens = await this._generateAuthTokens({
      email: payload.email,
      username: payload.username,
      sub: payload.sub,
      iss: 'blog.com',
    });
    return tokens;
  }

  async _generateAuthTokens(payload: AccessTokenPayload) {
    const accessToken = await this.jwtService.signAsync(payload);
    const refreshToken = await this.jwtService.signAsync(payload, {
      expiresIn: this.configService.get('JWT_REFRESH_EXPIRES_IN'),
    });
    return {
      accessToken,
      refreshToken,
      expiresIn: this.configService.get<number>('JWT_EXPIRES_IN'),
    };
  }

  async validateUserCredentials(userCredentials: {
    username: string;
    password: string;
  }) {
    const user = await this.usersService.findOne(userCredentials.username);
    if (!user) return null;

    const matched = await compare(userCredentials.password, user.password);

    if (!matched) return null;

    return user;
  }

  async validateUser(id: string) {
    const user = await this.usersService.findOneById(id);
    if (!user) return null;
    return user;
  }
}
