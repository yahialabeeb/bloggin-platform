import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { hash, compare } from 'bcryptjs';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import {
  AccessTokenPayload,
  AccountWithTokens,
} from 'src/auth/dto/account-with-tokens.dto';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private configService: ConfigService,
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async signup(createUserDto: CreateUserDto): Promise<AccountWithTokens> {
    const { name, username, email, password } = createUserDto;
    console.log(123459);
    const user = await this.usersService.findOne(username);
    if (user) throw new BadRequestException('username is exist');
    console.log(333, user);
    const createdUser = await this.usersService.create({
      ...createUserDto,
      password: hash(password),
    });

    const payload = {
      sub: createdUser.id,
      username,
      email,
    };

    const { accessToken, refreshToken } =
      await this._generateAuthTokens(payload);
    console.log(accessToken);
    return {
      name,
      username,
      email,
      accessToken,
      refreshToken,
      expiresIn: this.configService.get<number>('JWT_EXPIRES_IN'),
    };
  }

  async login(user: User): Promise<AccountWithTokens> {
    const { id, email, username, name } = user;
    const payload = { sub: id, username, email };
    const { accessToken, refreshToken } =
      await this._generateAuthTokens(payload);
    return {
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
