import { registerAs } from '@nestjs/config';

export type JwtExpiresIn = '15m' | '30m' | '1h' | '7d' | '14d';

export default registerAs('auth', () => ({
  jwt: {
    accessSecret: process.env.JWT_ACCESS_SECRET!,
    refreshSecret: process.env.JWT_REFRESH_SECRET!,
    accessExpiresIn: (process.env.JWT_ACCESS_EXPIRES_IN ??
      '15m') as JwtExpiresIn,
    refreshExpiresIn: (process.env.JWT_REFRESH_EXPIRES_IN ??
      '14d') as JwtExpiresIn,
  },
  bcrypt: {
    rounds: Number(process.env.BCRYPT_ROUNDS ?? 10),
  },
  google: {
    clientId: process.env.GOOGLE_CLIENT_ID!,
  },
}));
