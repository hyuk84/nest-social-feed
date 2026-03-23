import {
  BadRequestException,
  ValidationPipe,
  VersioningType,
} from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import type { ValidationError } from 'class-validator';
import { AppModule } from '@/app.module';
import { HttpExceptionFilter } from '@/common/errors/filters/http-exception.filter';

type ValidationFieldDetail = {
  field: string;
  reason: string;
};

function flattenValidationErrors(
  errors: ValidationError[],
  parentPath = '',
): ValidationFieldDetail[] {
  return errors.flatMap((error) => {
    const field = parentPath
      ? `${parentPath}.${error.property}`
      : error.property;
    const currentFieldErrors = Object.values(error.constraints ?? {}).map(
      (reason) => ({
        field,
        reason,
      }),
    );
    const childFieldErrors = flattenValidationErrors(
      error.children ?? [],
      field,
    );
    return [...currentFieldErrors, ...childFieldErrors];
  });
}

async function bootstrap() {
  const apiVersion = '1';
  const app = await NestFactory.create(AppModule);
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
      validationError: {
        target: false,
        value: false,
      },
      exceptionFactory: (errors: ValidationError[]) =>
        new BadRequestException({
          code: 'COMMON_VALIDATION_ERROR',
          message: 'Request body validation failed.',
          details: {
            fields: flattenValidationErrors(errors),
          },
        }),
    }),
  );
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: apiVersion,
  });

  const swaggerConfig = new DocumentBuilder()
    .setTitle('Nest Social Feed API')
    .setDescription('Social Feed backend API documentation')
    .setVersion(`v${apiVersion}`)
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'JWT access token',
      },
      'access-token',
    )
    .build();

  const swaggerDocument = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('docs', app, swaggerDocument, {
    swaggerOptions: {
      persistAuthorization: true,
    },
  });

  await app.listen(process.env.PORT ?? 8000);
}
void bootstrap();
