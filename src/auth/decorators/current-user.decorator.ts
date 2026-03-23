import { createParamDecorator, ExecutionContext } from '@nestjs/common';

import { AUTH_ERROR_CODES } from '@/common/errors/codes/auth-error.codes';
import { AppException } from '@/common/errors/exceptions/app.exception';
import { AuthUser } from '@/auth/types/auth-user.type';

export const CurrentUser = createParamDecorator(
  (data: keyof AuthUser | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<{ user?: AuthUser }>();
    const user = request.user;

    if (!user) {
      throw new AppException(AUTH_ERROR_CODES.INVALID_ACCESS_TOKEN);
    }

    if (!data) {
      return user;
    }

    const value = user[data];

    if (value == null) {
      throw new AppException(AUTH_ERROR_CODES.INVALID_ACCESS_TOKEN);
    }

    return value;
  },
);
