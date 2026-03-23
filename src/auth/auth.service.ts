import { Inject, Injectable } from '@nestjs/common';
import type { ConfigType } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { DataSource, Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { OAuth2Client } from 'google-auth-library';
import { v4 as uuidv4 } from 'uuid';
import { createHash } from 'crypto';

import authConfig, { type JwtExpiresIn } from '@/config/auth.config';

import { User } from '@/users/entities/user.entity';
import { Profile } from '@/users/entities/profile.entity';
import { UserStats } from '@/users/entities/user-stats.entity';
import { Account } from '@/auth/entities/account.entity';
import { AuthSession } from '@/auth/entities/auth-session.entity';

import { EmailLoginDto } from '@/auth/dto/request/email-login.dto';
import { EmailSignupDto } from '@/auth/dto/request/email-signup.dto';
import { GoogleLoginDto } from '@/auth/dto/request/google-login.dto';
import { RefreshTokenDto } from '@/auth/dto/request/refresh-token.dto';
import type { AuthResponseDto } from '@/auth/dto/response/auth-response.dto';
import type { TokenPairResponseDto } from '@/auth/dto/response/token-pair-response.dto';
import type { SessionMeta } from '@/auth/types/session-meta.type';
import { AppException } from '@/common/errors/exceptions/app.exception';
import { AUTH_ERROR_CODES } from '@/common/errors/codes/auth-error.codes';

type RefreshTokenPayload = {
  sub: string;
  accountId: string;
  sessionId: string;
  typ: 'refresh';
};

@Injectable()
export class AuthService {
  private readonly googleClient: OAuth2Client;

  constructor(
    @Inject(authConfig.KEY)
    private readonly authConfiguration: ConfigType<typeof authConfig>,

    private readonly jwtService: JwtService,
    private readonly dataSource: DataSource,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    @InjectRepository(Profile)
    private readonly profileRepository: Repository<Profile>,

    @InjectRepository(UserStats)
    private readonly userStatsRepository: Repository<UserStats>,

    @InjectRepository(Account)
    private readonly accountRepository: Repository<Account>,

    @InjectRepository(AuthSession)
    private readonly authSessionRepository: Repository<AuthSession>,
  ) {
    this.googleClient = new OAuth2Client(
      this.authConfiguration.google.clientId,
    );
  }

  async emailSignup(
    dto: EmailSignupDto,
    meta: SessionMeta,
  ): Promise<AuthResponseDto> {
    const email = this.normalizeEmail(dto.email);
    const userName = this.normalizeUserName(dto.userName);

    await this.ensureEmailAndUserNameAvailable(email, userName);

    const passwordHash = await bcrypt.hash(
      dto.password,
      this.authConfiguration.bcrypt.rounds,
    );

    const result = await this.dataSource.transaction(async (manager) => {
      const userRepo = manager.getRepository(User);
      const profileRepo = manager.getRepository(Profile);
      const userStatsRepo = manager.getRepository(UserStats);
      const accountRepo = manager.getRepository(Account);

      const user = userRepo.create({
        publicId: uuidv4(),
        email,
        userName,
        isActive: true,
      });
      await userRepo.save(user);

      const profile = profileRepo.create({
        userId: user.id,
        displayName: dto.displayName.trim(),
        bio: null,
        profileImageUrl: null,
        location: null,
      });
      await profileRepo.save(profile);

      const userStats = userStatsRepo.create({
        userId: user.id,
        followersCount: 0,
        followingCount: 0,
        postsCount: 0,
      });
      await userStatsRepo.save(userStats);

      const account = accountRepo.create({
        user,
        provider: 'local',
        providerAccountId: email,
        email,
        passwordHash,
      });
      await accountRepo.save(account);

      return { user, profile, account };
    });

    return this.issueTokensAndCreateSession(
      result.user,
      result.account,
      result.profile.displayName,
      result.profile.profileImageUrl,
      meta,
    );
  }

  async emailLogin(
    dto: EmailLoginDto,
    meta: SessionMeta,
  ): Promise<AuthResponseDto> {
    const email = this.normalizeEmail(dto.email);

    const account = await this.accountRepository.findOne({
      where: {
        provider: 'local',
        providerAccountId: email,
      },
      relations: ['user', 'user.profile'],
    });

    if (!account || !account.passwordHash) {
      throw new AppException(AUTH_ERROR_CODES.INVALID_CREDENTIALS);
    }

    if (!account.user.isActive) {
      throw new AppException(AUTH_ERROR_CODES.ACCOUNT_INACTIVE);
    }

    const isValid = await bcrypt.compare(dto.password, account.passwordHash);
    if (!isValid) {
      throw new AppException(AUTH_ERROR_CODES.INVALID_CREDENTIALS);
    }

    return this.issueTokensAndCreateSession(
      account.user,
      account,
      account.user.profile.displayName,
      account.user.profile.profileImageUrl,
      meta,
    );
  }

  async googleLogin(
    dto: GoogleLoginDto,
    meta: SessionMeta,
  ): Promise<AuthResponseDto> {
    let ticket;
    try {
      ticket = await this.googleClient.verifyIdToken({
        idToken: dto.idToken,
        audience: this.authConfiguration.google.clientId,
      });
    } catch {
      throw new AppException(AUTH_ERROR_CODES.INVALID_GOOGLE_TOKEN);
    }

    const payload = ticket.getPayload();
    if (!payload) {
      throw new AppException(AUTH_ERROR_CODES.INVALID_GOOGLE_TOKEN);
    }

    const googleSub = payload.sub;
    const email = payload.email?.toLowerCase();
    const emailVerified = payload.email_verified;
    const displayName = payload.name?.slice(0, 50) ?? 'Google User';
    const picture = payload.picture ?? null;

    if (!googleSub || !email || !emailVerified) {
      throw new AppException(AUTH_ERROR_CODES.INVALID_GOOGLE_USER_INFO);
    }

    let account = await this.accountRepository.findOne({
      where: { provider: 'google', providerAccountId: googleSub },
      relations: ['user', 'user.profile'],
    });

    if (account) {
      if (!account.user.isActive) {
        throw new AppException(AUTH_ERROR_CODES.ACCOUNT_INACTIVE);
      }

      return this.issueTokensAndCreateSession(
        account.user,
        account,
        account.user.profile.displayName,
        account.user.profile.profileImageUrl,
        meta,
      );
    }

    const existingUser = await this.userRepository.findOne({
      where: { email },
      relations: ['profile'],
    });

    if (existingUser) {
      if (!existingUser.isActive) {
        throw new AppException(AUTH_ERROR_CODES.ACCOUNT_INACTIVE);
      }

      account = this.accountRepository.create({
        user: existingUser,
        provider: 'google',
        providerAccountId: googleSub,
        email,
        passwordHash: null,
      });
      await this.accountRepository.save(account);

      if (!existingUser.profile.profileImageUrl && picture) {
        existingUser.profile.profileImageUrl = picture;
        await this.profileRepository.save(existingUser.profile);
      }

      return this.issueTokensAndCreateSession(
        existingUser,
        account,
        existingUser.profile.displayName,
        existingUser.profile.profileImageUrl,
        meta,
      );
    }

    const result = await this.dataSource.transaction(async (manager) => {
      const userRepo = manager.getRepository(User);
      const profileRepo = manager.getRepository(Profile);
      const userStatsRepo = manager.getRepository(UserStats);
      const accountRepo = manager.getRepository(Account);

      const generatedUserName = await this.generateUniqueUserName(
        email.split('@')[0],
        userRepo,
      );

      const user = userRepo.create({
        publicId: uuidv4(),
        email,
        userName: generatedUserName,
        isActive: true,
      });
      await userRepo.save(user);

      const profile = profileRepo.create({
        userId: user.id,
        displayName,
        bio: null,
        profileImageUrl: picture,
        location: null,
      });
      await profileRepo.save(profile);

      const userStats = userStatsRepo.create({
        userId: user.id,
        followersCount: 0,
        followingCount: 0,
        postsCount: 0,
      });
      await userStatsRepo.save(userStats);

      const account = accountRepo.create({
        user,
        provider: 'google',
        providerAccountId: googleSub,
        email,
        passwordHash: null,
      });
      await accountRepo.save(account);

      return { user, profile, account };
    });

    return this.issueTokensAndCreateSession(
      result.user,
      result.account,
      result.profile.displayName,
      result.profile.profileImageUrl,
      meta,
    );
  }

  async refresh(dto: RefreshTokenDto): Promise<TokenPairResponseDto> {
    const refreshTokenHash = this.hashToken(dto.refreshToken);

    const session = await this.authSessionRepository.findOne({
      where: { refreshTokenHash },
      relations: ['user', 'account'],
    });

    if (!session) {
      throw new AppException(AUTH_ERROR_CODES.INVALID_REFRESH_TOKEN);
    }

    if (session.revokedAt) {
      await this.revokeAllUserSessions(session.user.id);
      throw new AppException(AUTH_ERROR_CODES.REVOKED_REFRESH_TOKEN);
    }

    if (session.expiresAt.getTime() < Date.now()) {
      session.revokedAt = new Date();
      await this.authSessionRepository.save(session);
      throw new AppException(AUTH_ERROR_CODES.EXPIRED_REFRESH_TOKEN);
    }

    const payload = this.verifyRefreshToken(dto.refreshToken);

    if (String(payload.sessionId) !== String(session.id)) {
      await this.revokeAllUserSessions(session.user.id);
      throw new AppException(
        AUTH_ERROR_CODES.REFRESH_TOKEN_VERIFICATION_FAILED,
      );
    }

    session.revokedAt = new Date();
    session.lastUsedAt = new Date();
    await this.authSessionRepository.save(session);

    const accessToken = this.signAccessToken(session.user);
    const refreshExpiresAt = this.calculateExpiresAt(
      this.authConfiguration.jwt.refreshExpiresIn,
    );

    const newSession = this.authSessionRepository.create({
      user: session.user,
      account: session.account,
      refreshTokenHash: 'pending',
      userAgent: session.userAgent,
      ipAddress: session.ipAddress,
      deviceName: session.deviceName,
      expiresAt: refreshExpiresAt,
      revokedAt: null,
      lastUsedAt: new Date(),
    });

    const savedSession = await this.authSessionRepository.save(newSession);

    const rotatedRefreshToken = this.signRefreshToken(
      session.user,
      session.account,
      savedSession.id,
    );

    savedSession.refreshTokenHash = this.hashToken(rotatedRefreshToken);
    await this.authSessionRepository.save(savedSession);

    return {
      accessToken,
      refreshToken: rotatedRefreshToken,
    };
  }

  async logout(userId: string, dto: RefreshTokenDto): Promise<void> {
    const refreshTokenHash = this.hashToken(dto.refreshToken);

    const session = await this.authSessionRepository.findOne({
      where: { refreshTokenHash },
      relations: ['user'],
    });

    if (!session) {
      return;
    }

    if (session.user.id !== userId) {
      throw new AppException(AUTH_ERROR_CODES.FORBIDDEN_SESSION_LOGOUT);
    }

    if (!session.revokedAt) {
      session.revokedAt = new Date();
      await this.authSessionRepository.save(session);
    }
  }

  async logoutAll(userId: string): Promise<void> {
    await this.revokeAllUserSessions(userId);
  }

  private async issueTokensAndCreateSession(
    user: User,
    account: Account,
    displayName: string,
    profileImageUrl: string | null,
    meta: SessionMeta,
  ): Promise<AuthResponseDto> {
    const accessToken = this.signAccessToken(user);
    const refreshExpiresAt = this.calculateExpiresAt(
      this.authConfiguration.jwt.refreshExpiresIn,
    );

    const session = this.authSessionRepository.create({
      user,
      account,
      refreshTokenHash: 'pending',
      userAgent: meta.userAgent ?? null,
      ipAddress: meta.ipAddress ?? null,
      deviceName: meta.deviceName ?? null,
      expiresAt: refreshExpiresAt,
      revokedAt: null,
      lastUsedAt: new Date(),
    });

    const savedSession = await this.authSessionRepository.save(session);

    const refreshToken = this.signRefreshToken(user, account, savedSession.id);

    savedSession.refreshTokenHash = this.hashToken(refreshToken);
    await this.authSessionRepository.save(savedSession);

    return {
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        publicId: user.publicId,
        email: user.email,
        userName: user.userName,
        displayName,
        profileImageUrl,
      },
    };
  }

  private signAccessToken(user: User): string {
    return this.jwtService.sign(
      {
        sub: user.id,
        publicId: user.publicId,
        typ: 'access',
      },
      {
        secret: this.authConfiguration.jwt.accessSecret,
        expiresIn: this.authConfiguration.jwt.accessExpiresIn,
      },
    );
  }

  private signRefreshToken(
    user: User,
    account: Account,
    sessionId: AuthSession['id'],
  ): string {
    return this.jwtService.sign(
      {
        sub: user.id,
        accountId: account.id,
        sessionId,
        typ: 'refresh',
      },
      {
        secret: this.authConfiguration.jwt.refreshSecret,
        expiresIn: this.authConfiguration.jwt.refreshExpiresIn,
      },
    );
  }

  private verifyRefreshToken(token: string): RefreshTokenPayload {
    try {
      return this.jwtService.verify<RefreshTokenPayload>(token, {
        secret: this.authConfiguration.jwt.refreshSecret,
      });
    } catch {
      throw new AppException(
        AUTH_ERROR_CODES.REFRESH_TOKEN_VERIFICATION_FAILED,
      );
    }
  }

  private hashToken(token: string): string {
    return createHash('sha256').update(token).digest('hex');
  }

  private calculateExpiresAt(expiresIn: JwtExpiresIn): Date {
    const now = new Date();

    if (expiresIn.endsWith('d')) {
      const days = Number(expiresIn.slice(0, -1));
      return new Date(now.getTime() + days * 24 * 60 * 60 * 1000);
    }

    if (expiresIn.endsWith('h')) {
      const hours = Number(expiresIn.slice(0, -1));
      return new Date(now.getTime() + hours * 60 * 60 * 1000);
    }

    const minutes = Number(expiresIn.slice(0, -1));
    return new Date(now.getTime() + minutes * 60 * 1000);
  }

  private async revokeAllUserSessions(userId: string): Promise<void> {
    await this.authSessionRepository
      .createQueryBuilder()
      .update(AuthSession)
      .set({ revokedAt: new Date() })
      .where('user_id = :userId', { userId })
      .andWhere('revoked_at IS NULL')
      .execute();
  }

  private async ensureEmailAndUserNameAvailable(
    email: string,
    userName: string,
  ): Promise<void> {
    const [existingUserByEmail, existingUserByUserName] = await Promise.all([
      this.userRepository.findOne({ where: { email }, select: ['id'] }),
      this.userRepository.findOne({ where: { userName }, select: ['id'] }),
    ]);

    if (existingUserByEmail) {
      throw new AppException(AUTH_ERROR_CODES.EMAIL_ALREADY_EXISTS, {
        field: 'email',
      });
    }

    if (existingUserByUserName) {
      throw new AppException(AUTH_ERROR_CODES.USER_NAME_ALREADY_EXISTS, {
        field: 'userName',
      });
    }
  }

  private async generateUniqueUserName(
    base: string,
    userRepo: Repository<User>,
  ): Promise<string> {
    const sanitized =
      base
        .toLowerCase()
        .replace(/[^a-z0-9._]/g, '')
        .slice(0, 20) || 'user';

    let candidate = sanitized;
    let seq = 0;

    while (true) {
      const exists = await userRepo.findOne({
        where: { userName: candidate },
        select: ['id', 'userName'],
      });

      if (!exists) {
        return candidate;
      }

      seq += 1;
      candidate = `${sanitized}${seq}`.slice(0, 30);
    }
  }

  private normalizeEmail(email: string): string {
    return email.trim().toLowerCase();
  }

  private normalizeUserName(userName: string): string {
    return userName.trim();
  }
}
