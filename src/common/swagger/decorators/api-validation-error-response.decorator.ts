import { ApiBadRequestResponse } from '@nestjs/swagger';

import { ErrorResponseDto } from '@/common/errors/dto/error-response.dto';
import { createValidationErrorResponseExample } from '@/common/swagger/utils/error-response-examples.util';

export function ApiValidationErrorResponse(
  path: string,
  field = 'email',
  reason = 'must be a valid value',
) {
  return ApiBadRequestResponse({
    description: 'Request body validation failed',
    type: ErrorResponseDto,
    example: createValidationErrorResponseExample(path, [{ field, reason }]),
  });
}
