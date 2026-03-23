import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Ip,
  Post,
  Req,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import type { Request } from 'express';

import { AuthService } from '@/auth/auth.service';
import { AccessTokenProtected } from '@/auth/decorators/access-token-protected.decorator';
import { CurrentUser } from '@/auth/decorators/current-user.decorator';
import { EmailLoginDto } from '@/auth/dto/request/email-login.dto';
import { EmailSignupDto } from '@/auth/dto/request/email-signup.dto';
import { GoogleLoginDto } from '@/auth/dto/request/google-login.dto';
import { RefreshTokenDto } from '@/auth/dto/request/refresh-token.dto';
import {
  ApiAuthEmailLoginDocs,
  ApiAuthEmailSignupDocs,
  ApiAuthGoogleLoginDocs,
  ApiAuthLogoutAllDocs,
  ApiAuthLogoutDocs,
  ApiAuthRefreshDocs,
} from '@/auth/swagger/auth-docs.decorator';
import type { SessionMeta } from '@/auth/types/session-meta.type';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiAuthEmailSignupDocs()
  @Post('signup/email')
  async emailSignup(
    @Body() dto: EmailSignupDto,
    @Req() req: Request,
    @Ip() ip: string,
  ) {
    return this.authService.emailSignup(dto, this.extractSessionMeta(req, ip));
  }

  @ApiAuthEmailLoginDocs()
  @HttpCode(HttpStatus.OK)
  @Post('login/email')
  async emailLogin(
    @Body() dto: EmailLoginDto,
    @Req() req: Request,
    @Ip() ip: string,
  ) {
    return this.authService.emailLogin(dto, this.extractSessionMeta(req, ip));
  }

  @ApiAuthGoogleLoginDocs()
  @HttpCode(HttpStatus.OK)
  @Post('login/google')
  async googleLogin(
    @Body() dto: GoogleLoginDto,
    @Req() req: Request,
    @Ip() ip: string,
  ) {
    return this.authService.googleLogin(dto, this.extractSessionMeta(req, ip));
  }

  @ApiAuthRefreshDocs()
  @HttpCode(HttpStatus.OK)
  @Post('refresh')
  async refresh(@Body() dto: RefreshTokenDto) {
    return this.authService.refresh(dto);
  }

  @ApiAuthLogoutDocs()
  @AccessTokenProtected()
  @HttpCode(HttpStatus.NO_CONTENT)
  @Post('logout')
  async logout(
    @CurrentUser('id') userId: string,
    @Body() dto: RefreshTokenDto,
  ): Promise<void> {
    await this.authService.logout(userId, dto);
  }

  @ApiAuthLogoutAllDocs()
  @AccessTokenProtected()
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
