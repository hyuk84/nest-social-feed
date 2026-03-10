import { Entity, Column, PrimaryColumn, OneToOne, JoinColumn } from 'typeorm';
import { User } from '@/users/entities/user.entity';

@Entity('user_stats')
export class UserStats {
  @PrimaryColumn({ type: 'bigint', name: 'user_id' })
  userId!: string;

  @OneToOne(() => User, (user) => user.userStats, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user!: User;

  @Column({ type: 'int', default: 0, name: 'followers_count' })
  followersCount!: number;

  @Column({ type: 'int', default: 0, name: 'following_count' })
  followingCount!: number;

  @Column({ type: 'int', default: 0, name: 'posts_count' })
  postsCount!: number;
}
