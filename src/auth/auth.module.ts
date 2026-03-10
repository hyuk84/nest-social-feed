import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Account } from '@/auth/entities/account.entity';
import { AuthSession } from '@/auth/entities/auth-session.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Account, AuthSession])],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
