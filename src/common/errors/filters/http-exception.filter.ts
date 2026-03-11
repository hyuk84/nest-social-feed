import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import type { Request, Response } from 'express';
import { ErrorResponse } from '@/common/errors/types/error-response.type';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    if (exception instanceof HttpException) {
      const status = exception.getStatus();
      const exceptionResponse = exception.getResponse();

      const payload: Partial<ErrorResponse> =
        typeof exceptionResponse === 'string'
          ? {
              message: exceptionResponse,
            }
          : (exceptionResponse as Partial<ErrorResponse>);

      const errorResponse: ErrorResponse = {
        statusCode: status,
        code: payload.code ?? `HTTP_${status}`,
        message: payload.message ?? 'HTTP Exception',
        details: payload.details ?? null,
        path: request.url,
        timestamp: new Date().toISOString(),
      };

      response.status(status).json(errorResponse);
      return;
    }

    const errorResponse: ErrorResponse = {
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      code: 'COMMON_500',
      message: 'An unexpected error occurred.',
      details: null,
      path: request.url,
      timestamp: new Date().toISOString(),
    };

    response.status(HttpStatus.INTERNAL_SERVER_ERROR).json(errorResponse);
  }
}
