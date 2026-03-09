import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { PostsModule } from './posts/posts.module';
import { FollowsModule } from './follows/follows.module';
import { LikesModule } from './likes/likes.module';
import { CommentsModule } from './comments/comments.module';
import { FeedsModule } from './feeds/feeds.module';

@Module({
  imports: [AuthModule, UsersModule, PostsModule, FollowsModule, LikesModule, CommentsModule, FeedsModule],
})
export class AppModule {}
