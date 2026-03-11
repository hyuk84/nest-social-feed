import { HttpException } from '@nestjs/common';
import { AppErrorCode } from '@/common/errors/types/app-error.type';
import { ErrorDetails } from '@/common/errors/types/error-response.type';

export class AppException extends HttpException {
  constructor(error: AppErrorCode, details: ErrorDetails = null) {
    super(
      {
        code: error.code,
        message: error.message,
        details,
      },
      error.status,
    );
  }
}
