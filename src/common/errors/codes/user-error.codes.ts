import { AppErrorCode } from '../types/app-error.type';

export const USER_ERROR_CODES = {
  USER_NOT_FOUND: {
    code: 'USERS_USER_NOT_FOUND',
    message: 'The user could not be found.',
    status: 404,
  },
} satisfies Record<string, AppErrorCode>;
