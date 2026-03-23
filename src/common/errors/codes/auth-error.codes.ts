import { AppErrorCode } from '@/common/errors/types/app-error.type';

export const AUTH_ERROR_CODES = {
  EMAIL_ALREADY_EXISTS: {
    code: 'AUTH_EMAIL_ALREADY_EXISTS',
    message: 'The email address is already in use.',
    status: 409,
  },
  USER_NAME_ALREADY_EXISTS: {
    code: 'AUTH_USER_NAME_ALREADY_EXISTS',
    message: 'The user name is already in use.',
    status: 409,
  },
  INVALID_CREDENTIALS: {
    code: 'AUTH_INVALID_CREDENTIALS',
    message: 'Email or password is incorrect.',
    status: 401,
  },
  ACCOUNT_INACTIVE: {
    code: 'AUTH_ACCOUNT_INACTIVE',
    message: 'The account is inactive.',
    status: 401,
  },
  INVALID_ACCESS_TOKEN: {
    code: 'AUTH_INVALID_ACCESS_TOKEN',
    message: 'The access token is missing, invalid, or expired.',
    status: 401,
  },
  INVALID_GOOGLE_TOKEN: {
    code: 'AUTH_INVALID_GOOGLE_TOKEN',
    message: 'The Google token is invalid.',
    status: 401,
  },
  INVALID_GOOGLE_USER_INFO: {
    code: 'AUTH_INVALID_GOOGLE_USER_INFO',
    message: 'The Google user information is invalid.',
    status: 401,
  },
  INVALID_REFRESH_TOKEN: {
    code: 'AUTH_INVALID_REFRESH_TOKEN',
    message: 'The refresh token is invalid.',
    status: 401,
  },
  REVOKED_REFRESH_TOKEN: {
    code: 'AUTH_REVOKED_REFRESH_TOKEN',
    message:
      'The refresh token has already been revoked. Please sign in again.',
    status: 401,
  },
  EXPIRED_REFRESH_TOKEN: {
    code: 'AUTH_EXPIRED_REFRESH_TOKEN',
    message: 'The refresh token has expired. Please sign in again.',
    status: 401,
  },
  REFRESH_TOKEN_VERIFICATION_FAILED: {
    code: 'AUTH_REFRESH_TOKEN_VERIFICATION_FAILED',
    message: 'Refresh token verification failed.',
    status: 401,
  },
  FORBIDDEN_SESSION_LOGOUT: {
    code: 'AUTH_FORBIDDEN_SESSION_LOGOUT',
    message: 'You cannot terminate another user’s session.',
    status: 403,
  },
} satisfies Record<string, AppErrorCode>;
