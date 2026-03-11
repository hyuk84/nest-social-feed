import * as Joi from 'joi';

export const envValidationSchema: Joi.ObjectSchema = Joi.object({
  NODE_ENV: Joi.string()
    .valid('local', 'development', 'production', 'test')
    .default('development'),

  DB_HOST: Joi.string().required(),
  DB_PORT: Joi.number().default(5432),
  DB_USERNAME: Joi.string().required(),
  DB_PASSWORD: Joi.string().required(),
  DB_NAME: Joi.string().required(),
  DB_SYNCHRONIZE: Joi.boolean().default(false),
  DB_LOGGING: Joi.boolean().default(false),

  JWT_ACCESS_SECRET: Joi.string().min(32).required(),
  JWT_REFRESH_SECRET: Joi.string().min(32).required(),
  JWT_ACCESS_EXPIRES_IN: Joi.string()
    .valid('15m', '30m', '1h', '7d', '14d')
    .default('15m'),
  JWT_REFRESH_EXPIRES_IN: Joi.string()
    .valid('15m', '30m', '1h', '7d', '14d')
    .default('14d'),
  BCRYPT_ROUNDS: Joi.number().integer().min(8).max(15).default(10),

  GOOGLE_CLIENT_ID: Joi.string().required(),
});
