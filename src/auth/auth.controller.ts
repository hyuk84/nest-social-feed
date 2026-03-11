import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Ip,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiHeader,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiOperation,
  ApiProperty,
  ApiPropertyOptional,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import type { Request } from 'express';

import { AuthService } from '@/auth/auth.service';
import { EmailSignupDto } from '@/auth/dto/email-signup.dto';
import { EmailLoginDto } from '@/auth/dto/email-login.dto';
import { GoogleLoginDto } from '@/auth/dto/google-login.dto';
import { RefreshTokenDto } from '@/auth/dto/refresh-token.dto';
import { JwtAuthGuard } from '@/auth/guards/jwt-auth.guard';
import { CurrentUser } from '@/auth/decorators/current-user.decorator';

type SessionMeta = {
  userAgent?: string;
  ipAddress?: string;
  deviceName?: string;
};

class AuthUserResponseDto {
  @ApiProperty({ example: '1234' })
  id!: string;

  @ApiProperty({ example: 'c77f12d9-9aa0-4b56-9e73-117bb3b6f779' })
  publicId!: string;

  @ApiProperty({ example: 'user@example.com' })
  email!: string;

  @ApiProperty({ example: 'andy_dev' })
  userName!: string;

  @ApiProperty({ example: 'Andy' })
  displayName!: string | null;

  @ApiProperty({
    example: 'https://cdn.example.com/profiles/andy.png',
    nullable: true,
  })
  profileImageUrl!: string | null;
}

class AuthResponseDto {
  @ApiProperty({ example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.access' })
  accessToken!: string;

  @ApiProperty({ example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.refresh' })
  refreshToken!: string;

  @ApiProperty({ type: AuthUserResponseDto })
  user!: AuthUserResponseDto;
}

class TokenPairResponseDto {
  @ApiProperty({ example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.access' })
  accessToken!: string;

  @ApiProperty({ example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.refresh' })
  refreshToken!: string;
}

class ErrorFieldDetailDto {
  @ApiProperty({ example: 'email' })
  field!: string;

  @ApiProperty({ example: 'already exists' })
  reason!: string;
}

class ErrorResponseDto {
  @ApiProperty({ example: 401 })
  statusCode!: number;

  @ApiProperty({ example: 'AUTH_INVALID_CREDENTIALS' })
  code!: string;

  @ApiProperty({ example: 'Email or password is incorrect.' })
  message!: string;

  @ApiPropertyOptional({
    type: 'object',
    nullable: true,
    additionalProperties: true,
  })
  details!: {
    fields?: ErrorFieldDetailDto[];
    [key: string]: unknown;
  } | null;

  @ApiProperty({ example: '/auth/login/email' })
  path!: string;

  @ApiProperty({ example: '2026-03-11T09:00:00.000Z' })
  timestamp!: string;
}

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({ summary: 'Sign up with email' })
  @ApiHeader({
    name: 'x-device-name',
    required: false,
    description: 'Device name used for this session (optional)',
  })
  @ApiCreatedResponse({
    description: 'Signup succeeded and tokens were issued',
    type: AuthResponseDto,
  })
  @ApiBadRequestResponse({
    description: 'Request body validation failed',
    type: ErrorResponseDto,
  })
  @ApiConflictResponse({
    description: 'Email or username already exists',
    type: ErrorResponseDto,
  })
  @Post('signup/email')
  async emailSignup(
    @Body() dto: EmailSignupDto,
    @Req() req: Request,
    @Ip() ip: string,
  ) {
    return this.authService.emailSignup(dto, this.extractSessionMeta(req, ip));
  }

  @ApiOperation({ summary: 'Log in with email' })
  @ApiHeader({
    name: 'x-device-name',
    required: false,
    description: 'Device name used for this session (optional)',
  })
  @ApiOkResponse({
    description: 'Login succeeded and tokens were issued',
    type: AuthResponseDto,
  })
  @ApiBadRequestResponse({
    description: 'Request body validation failed',
    type: ErrorResponseDto,
  })
  @ApiUnauthorizedResponse({
    description: 'Authentication failed',
    type: ErrorResponseDto,
  })
  @HttpCode(HttpStatus.OK)
  @Post('login/email')
  async emailLogin(
    @Body() dto: EmailLoginDto,
    @Req() req: Request,
    @Ip() ip: string,
  ) {
    return this.authService.emailLogin(dto, this.extractSessionMeta(req, ip));
  }

  @ApiOperation({ summary: 'Log in with Google' })
  @ApiHeader({
    name: 'x-device-name',
    required: false,
    description: 'Device name used for this session (optional)',
  })
  @ApiOkResponse({
    description: 'Google login succeeded and tokens were issued',
    type: AuthResponseDto,
  })
  @ApiBadRequestResponse({
    description: 'Request body validation failed',
    type: ErrorResponseDto,
  })
  @ApiUnauthorizedResponse({
    description: 'Invalid Google token',
    type: ErrorResponseDto,
  })
  @HttpCode(HttpStatus.OK)
  @Post('login/google')
  async googleLogin(
    @Body() dto: GoogleLoginDto,
    @Req() req: Request,
    @Ip() ip: string,
  ) {
    return this.authService.googleLogin(dto, this.extractSessionMeta(req, ip));
  }

  @ApiOperation({ summary: 'Refresh tokens' })
  @ApiOkResponse({
    description: 'Token refresh succeeded',
    type: TokenPairResponseDto,
  })
  @ApiBadRequestResponse({
    description: 'Request body validation failed',
    type: ErrorResponseDto,
  })
  @ApiUnauthorizedResponse({
    description: 'Refresh token verification failed',
    type: ErrorResponseDto,
  })
  @HttpCode(HttpStatus.OK)
  @Post('refresh')
  async refresh(@Body() dto: RefreshTokenDto) {
    return this.authService.refresh(dto);
  }

  @ApiOperation({ summary: 'Log out current session' })
  @ApiBearerAuth('access-token')
  @ApiNoContentResponse({ description: 'Logout succeeded' })
  @ApiBadRequestResponse({
    description: 'Request body validation failed',
    type: ErrorResponseDto,
  })
  @ApiUnauthorizedResponse({
    description: 'Invalid access token or refresh token',
    type: ErrorResponseDto,
  })
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  @Post('logout')
  async logout(
    @CurrentUser('id') userId: string,
    @Body() dto: RefreshTokenDto,
  ): Promise<void> {
    await this.authService.logout(userId, dto);
  }

  @ApiOperation({ summary: 'Log out all sessions' })
  @ApiBearerAuth('access-token')
  @ApiNoContentResponse({ description: 'Logout from all sessions succeeded' })
  @ApiUnauthorizedResponse({
    description: 'Invalid access token',
    type: ErrorResponseDto,
  })
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  @Post('logout-all')
  async logoutAll(@CurrentUser('id') userId: string): Promise<void> {
    await this.authService.logoutAll(userId);
  }

  private extractSessionMeta(req: Request, ip: string): SessionMeta {
    const deviceNameHeader = req.headers['x-device-name'];

    return {
      userAgent: req.get('user-agent') ?? undefined,
      ipAddress: ip ?? undefined,
      deviceName:
        typeof deviceNameHeader === 'string' ? deviceNameHeader : undefined,
    };
  }
}
