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
import { JwtRefreshAuthGuard } from '../auth/guard/jwt-refresh.guard';
import { ApiTags } from '@nestjs/swagger';
import { User } from 'src/users/entities/user.entity';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { SigninDto } from './dto/sign-in.dto';

@Controller('auth')
@ApiTags('Auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @HttpCode(HttpStatus.CREATED)
  @Post('/signup')
  async signup(@Body() signUpDto: CreateUserDto) {
    console.log(signUpDto);
    const user = await this.authService.signup(signUpDto);
    return {
      data: plainToInstance(User, user),
    };
  }

  @Post('login')
  async login(@Body() signinDto: SigninDto) {
    const user = await this.authService.login(signinDto);
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
