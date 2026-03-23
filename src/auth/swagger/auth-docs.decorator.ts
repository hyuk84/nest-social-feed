import { applyDecorators } from '@nestjs/common';
import {
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiOperation,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

import { AuthResponseDto } from '@/auth/dto/response/auth-response.dto';
import { TokenPairResponseDto } from '@/auth/dto/response/token-pair-response.dto';
import { AUTH_ERROR_CODES } from '@/common/errors/codes/auth-error.codes';
import { ErrorResponseDto } from '@/common/errors/dto/error-response.dto';
import { ApiDeviceNameHeader } from '@/common/swagger/decorators/api-device-name-header.decorator';
import { ApiValidationErrorResponse } from '@/common/swagger/decorators/api-validation-error-response.decorator';
import { createAppErrorResponseExample } from '@/common/swagger/utils/error-response-examples.util';

const AUTH_ROUTE_PATHS = {
  emailSignup: '/v1/auth/signup/email',
  emailLogin: '/v1/auth/login/email',
  googleLogin: '/v1/auth/login/google',
  refresh: '/v1/auth/refresh',
  logout: '/v1/auth/logout',
  logoutAll: '/v1/auth/logout-all',
} as const;

export function ApiAuthEmailSignupDocs() {
  return applyDecorators(
    ApiOperation({ summary: 'Sign up with email' }),
    ApiDeviceNameHeader(),
    ApiCreatedResponse({
      description: 'Signup succeeded and tokens were issued',
      type: AuthResponseDto,
    }),
    ApiValidationErrorResponse(
      AUTH_ROUTE_PATHS.emailSignup,
      'email',
      'email must be an email',
    ),
    ApiConflictResponse({
      description: 'Email or username already exists',
      type: ErrorResponseDto,
      examples: {
        emailAlreadyExists: createAppErrorResponseExample(
          'Email already exists',
          AUTH_ERROR_CODES.EMAIL_ALREADY_EXISTS,
          AUTH_ROUTE_PATHS.emailSignup,
          { field: 'email' },
        ),
        userNameAlreadyExists: createAppErrorResponseExample(
          'User name already exists',
          AUTH_ERROR_CODES.USER_NAME_ALREADY_EXISTS,
          AUTH_ROUTE_PATHS.emailSignup,
          { field: 'userName' },
        ),
      },
    }),
  );
}

export function ApiAuthEmailLoginDocs() {
  return applyDecorators(
    ApiOperation({ summary: 'Log in with email' }),
    ApiDeviceNameHeader(),
    ApiOkResponse({
      description: 'Login succeeded and tokens were issued',
      type: AuthResponseDto,
    }),
    ApiValidationErrorResponse(
      AUTH_ROUTE_PATHS.emailLogin,
      'email',
      'email must be an email',
    ),
    ApiUnauthorizedResponse({
      description: 'Authentication failed or account is inactive',
      type: ErrorResponseDto,
      examples: {
        invalidCredentials: createAppErrorResponseExample(
          'Invalid credentials',
          AUTH_ERROR_CODES.INVALID_CREDENTIALS,
          AUTH_ROUTE_PATHS.emailLogin,
        ),
        accountInactive: createAppErrorResponseExample(
          'Account inactive',
          AUTH_ERROR_CODES.ACCOUNT_INACTIVE,
          AUTH_ROUTE_PATHS.emailLogin,
        ),
      },
    }),
  );
}

export function ApiAuthGoogleLoginDocs() {
  return applyDecorators(
    ApiOperation({ summary: 'Log in with Google' }),
    ApiDeviceNameHeader(),
    ApiOkResponse({
      description: 'Google login succeeded and tokens were issued',
      type: AuthResponseDto,
    }),
    ApiValidationErrorResponse(
      AUTH_ROUTE_PATHS.googleLogin,
      'idToken',
      'idToken must be longer than or equal to 10 characters',
    ),
    ApiUnauthorizedResponse({
      description:
        'Google token or user info is invalid, or account is inactive',
      type: ErrorResponseDto,
      examples: {
        invalidGoogleToken: createAppErrorResponseExample(
          'Invalid Google token',
          AUTH_ERROR_CODES.INVALID_GOOGLE_TOKEN,
          AUTH_ROUTE_PATHS.googleLogin,
        ),
        invalidGoogleUserInfo: createAppErrorResponseExample(
          'Invalid Google user info',
          AUTH_ERROR_CODES.INVALID_GOOGLE_USER_INFO,
          AUTH_ROUTE_PATHS.googleLogin,
        ),
        accountInactive: createAppErrorResponseExample(
          'Account inactive',
          AUTH_ERROR_CODES.ACCOUNT_INACTIVE,
          AUTH_ROUTE_PATHS.googleLogin,
        ),
      },
    }),
  );
}

export function ApiAuthRefreshDocs() {
  return applyDecorators(
    ApiOperation({ summary: 'Refresh tokens' }),
    ApiOkResponse({
      description: 'Token refresh succeeded',
      type: TokenPairResponseDto,
    }),
    ApiValidationErrorResponse(
      AUTH_ROUTE_PATHS.refresh,
      'refreshToken',
      'refreshToken must be longer than or equal to 10 characters',
    ),
    ApiUnauthorizedResponse({
      description:
        'Refresh token is invalid, expired, revoked, or verification failed',
      type: ErrorResponseDto,
      examples: {
        invalidRefreshToken: createAppErrorResponseExample(
          'Invalid refresh token',
          AUTH_ERROR_CODES.INVALID_REFRESH_TOKEN,
          AUTH_ROUTE_PATHS.refresh,
        ),
        revokedRefreshToken: createAppErrorResponseExample(
          'Revoked refresh token',
          AUTH_ERROR_CODES.REVOKED_REFRESH_TOKEN,
          AUTH_ROUTE_PATHS.refresh,
        ),
        expiredRefreshToken: createAppErrorResponseExample(
          'Expired refresh token',
          AUTH_ERROR_CODES.EXPIRED_REFRESH_TOKEN,
          AUTH_ROUTE_PATHS.refresh,
        ),
        verificationFailed: createAppErrorResponseExample(
          'Refresh token verification failed',
          AUTH_ERROR_CODES.REFRESH_TOKEN_VERIFICATION_FAILED,
          AUTH_ROUTE_PATHS.refresh,
        ),
      },
    }),
  );
}

export function ApiAuthLogoutDocs() {
  return applyDecorators(
    ApiOperation({ summary: 'Log out current session' }),
    ApiNoContentResponse({ description: 'Logout succeeded' }),
    ApiValidationErrorResponse(
      AUTH_ROUTE_PATHS.logout,
      'refreshToken',
      'refreshToken must be longer than or equal to 10 characters',
    ),
    ApiUnauthorizedResponse({
      description: 'Access token is missing or invalid',
      type: ErrorResponseDto,
      examples: {
        invalidAccessToken: createAppErrorResponseExample(
          'Missing or invalid access token',
          AUTH_ERROR_CODES.INVALID_ACCESS_TOKEN,
          AUTH_ROUTE_PATHS.logout,
        ),
      },
    }),
    ApiForbiddenResponse({
      description: 'Refresh token belongs to another user session',
      type: ErrorResponseDto,
      examples: {
        forbiddenSessionLogout: createAppErrorResponseExample(
          'Refresh token belongs to another user session',
          AUTH_ERROR_CODES.FORBIDDEN_SESSION_LOGOUT,
          AUTH_ROUTE_PATHS.logout,
        ),
      },
    }),
  );
}

export function ApiAuthLogoutAllDocs() {
  return applyDecorators(
    ApiOperation({ summary: 'Log out all sessions' }),
    ApiNoContentResponse({ description: 'Logout from all sessions succeeded' }),
    ApiUnauthorizedResponse({
      description: 'Access token is missing or invalid',
      type: ErrorResponseDto,
      examples: {
        invalidAccessToken: createAppErrorResponseExample(
          'Missing or invalid access token',
          AUTH_ERROR_CODES.INVALID_ACCESS_TOKEN,
          AUTH_ROUTE_PATHS.logoutAll,
        ),
      },
    }),
  );
}
