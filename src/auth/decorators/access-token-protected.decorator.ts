import { applyDecorators, UseGuards } from '@nestjs/common';

import { JwtAuthGuard } from '@/auth/guards/jwt-auth.guard';
import { ApiAccessTokenAuth } from '@/common/swagger/decorators/api-access-token-auth.decorator';

export function AccessTokenProtected() {
  return applyDecorators(UseGuards(JwtAuthGuard), ApiAccessTokenAuth());
}
