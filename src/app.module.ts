import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { PostsModule } from './posts/posts.module';
import { FollowsModule } from './follows/follows.module';
import { LikesModule } from './likes/likes.module';
import { CommentsModule } from './comments/comments.module';
import { FeedsModule } from './feeds/feeds.module';
import { envValidationSchema } from './config/env.valiation';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { getOrmConfig } from './config/orm.config';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [`.env.${process.env.NODE_ENV || 'development'}`, '.env'],
      validationSchema: envValidationSchema,
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => getOrmConfig(configService),
    }),
    AuthModule,
    UsersModule,
    PostsModule,
    FollowsModule,
    LikesModule,
    CommentsModule,
    FeedsModule,
  ],
})
export class AppModule {}
