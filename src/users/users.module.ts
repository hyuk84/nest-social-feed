import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '@/users/entities/user.entity';
import { Profile } from '@/users/entities/profile.entity';
import { UserStats } from '@/users/entities/user-stats.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Profile, UserStats])],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
