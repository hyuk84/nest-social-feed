import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { AUTH_ERROR_CODES } from '@/common/errors/codes/auth-error.codes';
import { AppException } from '@/common/errors/exceptions/app.exception';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  handleRequest<TUser>(err: unknown, user: TUser): TUser {
    if (err || !user) {
      throw new AppException(AUTH_ERROR_CODES.INVALID_ACCESS_TOKEN);
    }

    return user;
  }
}
