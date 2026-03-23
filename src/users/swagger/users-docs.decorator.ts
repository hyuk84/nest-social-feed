import { applyDecorators } from '@nestjs/common';
import {
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

import { AUTH_ERROR_CODES } from '@/common/errors/codes/auth-error.codes';
import { USER_ERROR_CODES } from '@/common/errors/codes/user-error.codes';
import { ErrorResponseDto } from '@/common/errors/dto/error-response.dto';
import { createAppErrorResponseExample } from '@/common/swagger/utils/error-response-examples.util';

import { UserMeResponseDto } from '../dto/response/user-me-response.dto';

const USERS_ROUTE_PATHS = {
  me: '/v1/users/me',
} as const;

export function ApiUsersMeDocs() {
  return applyDecorators(
    ApiOperation({ summary: 'Get my profile' }),
    ApiOkResponse({
      description: 'Current authenticated user was retrieved successfully',
      type: UserMeResponseDto,
    }),
    ApiUnauthorizedResponse({
      description: 'Access token is missing or invalid',
      type: ErrorResponseDto,
      examples: {
        invalidAccessToken: createAppErrorResponseExample(
          'Missing or invalid access token',
          AUTH_ERROR_CODES.INVALID_ACCESS_TOKEN,
          USERS_ROUTE_PATHS.me,
        ),
      },
    }),
    ApiNotFoundResponse({
      description: 'Authenticated user could not be found',
      type: ErrorResponseDto,
      examples: {
        userNotFound: createAppErrorResponseExample(
          'Authenticated user not found',
          USER_ERROR_CODES.USER_NOT_FOUND,
          USERS_ROUTE_PATHS.me,
        ),
      },
    }),
  );
}
