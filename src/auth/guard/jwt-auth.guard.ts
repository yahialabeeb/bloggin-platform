import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private optional: boolean = false) {
    super();
  }

  handleRequest(err, user, info) {
    if ((err || !user) && !this.optional) {
      throw err || new UnauthorizedException();
    }
    return user;
  }
}
