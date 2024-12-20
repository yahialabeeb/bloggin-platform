import {
  Body,
  Controller,
  Post,
  UseGuards,
  Request,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { plainToInstance } from 'class-transformer';
import { LocalAuthGuard } from '../auth/guard/local-auth.guard';
import { JwtRefreshAuthGuard } from '../auth/guard/jwt-refresh.guard';
import { ApiTags } from '@nestjs/swagger';
import { User } from 'src/users/entities/user.entity';
import { CreateUserDto } from 'src/users/dto/create-user.dto';

@Controller('auth')
@ApiTags('Auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('/signup')
  async signup(@Body() signUpDto: CreateUserDto) {
    console.log(signUpDto);
    const user = await this.authService.signup(signUpDto);
    console.log(user);
    return {
      data: plainToInstance(User, user),
    };
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async logiIn(@Request() req) {
    const user = await this.authService.login(req.user);
    return {
      data: plainToInstance(User, user),
    };
  }

  @UseGuards(JwtRefreshAuthGuard)
  @Post('refresh')
  async refresh(@Request() req) {
    return {
      data: await this.authService.refresh(req.user.refreshToken),
    };
  }
}
