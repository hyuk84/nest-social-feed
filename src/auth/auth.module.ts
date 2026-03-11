import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Account } from '@/auth/entities/account.entity';
import { AuthSession } from '@/auth/entities/auth-session.entity';
import { ConfigModule } from '@nestjs/config';
import authConfig from '@/config/auth.config';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from '@/auth/strategies/jwt.strategy';
import { User } from '@/users/entities/user.entity';
import { Profile } from '@/users/entities/profile.entity';
import { UserStats } from '@/users/entities/user-stats.entity';

@Module({
  imports: [
    ConfigModule.forFeature(authConfig),
    JwtModule.register({}),
    TypeOrmModule.forFeature([Account, AuthSession, User, Profile, UserStats]),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  exports: [AuthService],
})
export class AuthModule {}
