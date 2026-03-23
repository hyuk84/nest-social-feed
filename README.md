# Nest Social Feed API

![Framework](https://img.shields.io/badge/Framework-NestJS-e0234e)
![Language](https://img.shields.io/badge/Language-TypeScript-3178c6)
![Database](https://img.shields.io/badge/Database-PostgreSQL-336791)
![License](https://img.shields.io/badge/License-UNLICENSED-lightgrey)

A backend starter for a social feed product, built with NestJS and TypeScript.

The current focus is production-style authentication (email + Google login, JWT session lifecycle, centralized error responses), with domain modules ready for expansion.

---

## Features

- **NestJS + TypeScript**: Modular backend architecture with strict typing
- **Auth Foundation**: Email signup/login, Google ID token login, refresh token rotation, session-based logout/logout-all
- **JWT Security Model**: Access/refresh token split with hashed refresh token storage in DB
- **Validation & Config Safety**: DTO validation (`class-validator`) + environment validation (`Joi`)
- **Centralized Error Response**: Unified error format via custom exception + global exception filter
- **Swagger API Docs**: OpenAPI docs served at `/docs` (versioned routes)
- **Database Ready**: PostgreSQL + TypeORM (`autoLoadEntities`, module-based entities)
- **Scalable Module Layout**: `auth`, `users`, `posts`, `comments`, `likes`, `follows`, `feeds`
- **Absolute Imports**: `@/` path alias for cleaner imports

---

## Tech Stack

- **Framework**: [NestJS](https://nestjs.com)
- **Language**: TypeScript
- **Database**: PostgreSQL
- **ORM**: [TypeORM](https://typeorm.io)
- **Authentication**: `@nestjs/jwt`, `passport-jwt`, `bcrypt`, `google-auth-library`
- **API Documentation**: `@nestjs/swagger`, `swagger-ui-express`
- **Validation**: `class-validator`, `class-transformer`, `joi`
- **Package Manager**: pnpm

---

## Getting Started

### 1) Install dependencies

```bash
pnpm install
```

### 2) Configure environment variables

Create `.env` from `.env.example` and fill in required values.

Required auth/database keys:

- `DB_HOST`
- `DB_PORT`
- `DB_USERNAME`
- `DB_PASSWORD`
- `DB_NAME`
- `JWT_ACCESS_SECRET` (min 32 chars)
- `JWT_REFRESH_SECRET` (min 32 chars)
- `GOOGLE_CLIENT_ID`

Optional:

- `JWT_ACCESS_EXPIRES_IN` (default: `15m`)
- `JWT_REFRESH_EXPIRES_IN` (default: `14d`)
- `BCRYPT_ROUNDS` (default: `10`)
- `DB_SYNCHRONIZE` (default: `false`)
- `DB_LOGGING` (default: `false`)
- `PORT` (default: `8000`)

### 3) Run PostgreSQL (Docker)

```bash
docker compose up -d
```

### 4) Start the server

```bash
# local profile
pnpm run start:local

# development profile (watch)
pnpm run start:dev
```

### 5) Open Swagger docs

When the app is running:

- `http://localhost:8000/docs`

---

## Available Scripts

```bash
pnpm run build
pnpm run start
pnpm run start:local
pnpm run start:dev
pnpm run start:debug
pnpm run start:prod
pnpm run lint
pnpm run format
pnpm run test
pnpm run test:e2e
pnpm run test:cov
```

---

## Auth API (Implemented)

- `POST /v1/auth/signup/email`
- `POST /v1/auth/login/email`
- `POST /v1/auth/login/google`
- `POST /v1/auth/refresh`
- `POST /v1/auth/logout`
- `POST /v1/auth/logout-all`

Auth endpoints are documented in Swagger under the **Auth** tag.

---

## Project Structure

```bash
.
├── src/
│   ├── app.module.ts
│   ├── main.ts
│   ├── auth/
│   │   ├── decorators/
│   │   ├── dto/
│   │   ├── entities/
│   │   ├── guards/
│   │   ├── strategies/
│   │   ├── types/
│   │   ├── auth.controller.ts
│   │   ├── auth.module.ts
│   │   └── auth.service.ts
│   ├── common/errors/
│   ├── config/
│   ├── users/
│   ├── posts/
│   ├── comments/
│   ├── likes/
│   ├── follows/
│   └── feeds/
├── docker-compose.yml
├── .env.example
├── package.json
└── tsconfig.json
```

---

## Status

- **Auth module**: implemented and documented
- **Users/Posts/Comments/Likes/Follows/Feeds modules**: generated scaffolding, ready for domain logic

---

## License

This project is currently marked as **UNLICENSED** in `package.json`.
