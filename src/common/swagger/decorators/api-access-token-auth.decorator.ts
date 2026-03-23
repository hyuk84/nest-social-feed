import { ApiBearerAuth } from '@nestjs/swagger';

export function ApiAccessTokenAuth() {
  return ApiBearerAuth('access-token');
}
