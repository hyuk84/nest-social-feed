import type { AppErrorCode } from '@/common/errors/types/app-error.type';
import type {
  ErrorDetails,
  ErrorFieldDetail,
  ErrorResponse,
} from '@/common/errors/types/error-response.type';

const SWAGGER_EXAMPLE_TIMESTAMP = '2026-03-11T09:00:00.000Z';

type SwaggerErrorResponseExample = {
  summary: string;
  value: ErrorResponse;
};

export function createAppErrorResponseExample(
  summary: string,
  error: AppErrorCode,
  path: string,
  details: ErrorDetails = null,
): SwaggerErrorResponseExample {
  return {
    summary,
    value: {
      statusCode: error.status,
      code: error.code,
      message: error.message,
      details,
      path,
      timestamp: SWAGGER_EXAMPLE_TIMESTAMP,
    },
  };
}

export function createHttpErrorResponseExample(
  summary: string,
  statusCode: number,
  message: string,
  path: string,
  details: ErrorDetails = null,
): SwaggerErrorResponseExample {
  return {
    summary,
    value: {
      statusCode,
      code: `HTTP_${statusCode}`,
      message,
      details,
      path,
      timestamp: SWAGGER_EXAMPLE_TIMESTAMP,
    },
  };
}

export function createValidationErrorResponseExample(
  path: string,
  fields: ErrorFieldDetail[],
): ErrorResponse {
  return {
    statusCode: 400,
    code: 'COMMON_VALIDATION_ERROR',
    message: 'Request body validation failed.',
    details: {
      fields,
    },
    path,
    timestamp: SWAGGER_EXAMPLE_TIMESTAMP,
  };
}
