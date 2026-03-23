import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ErrorFieldDetailDto {
  @ApiProperty({ example: 'email' })
  field!: string;

  @ApiProperty({ example: 'already exists' })
  reason!: string;
}

export class ErrorResponseDto {
  @ApiProperty({ description: 'HTTP status code.' })
  statusCode!: number;

  @ApiProperty({
    description: 'Application-specific or HTTP fallback error code.',
  })
  code!: string;

  @ApiProperty({ description: 'Human-readable error message.' })
  message!: string;

  @ApiPropertyOptional({
    type: 'object',
    nullable: true,
    additionalProperties: true,
    description:
      'Additional error payload. Validation errors use details.fields; other errors may include different keys.',
  })
  details!: {
    fields?: ErrorFieldDetailDto[];
    [key: string]: unknown;
  } | null;

  @ApiProperty({ description: 'Request URL path.' })
  path!: string;

  @ApiProperty({ description: 'ISO 8601 timestamp when the error occurred.' })
  timestamp!: string;
}
