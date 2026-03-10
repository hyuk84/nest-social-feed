import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Profile } from '@/users/entities/profile.entity';
import { UserStats } from '@/users/entities/user-stats.entity';
import { Account } from '@/auth/entities/account.entity';
import { AuthSession } from '@/auth/entities/auth-session.entity';
import { Post } from '@/posts/entities/post.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id!: string;

  @Column({ type: 'uuid', unique: true, name: 'public_id' })
  publicId!: string;

  @Column({ type: 'varchar', length: 255, unique: true })
  email!: string;

  @Column({ type: 'varchar', length: 30, unique: true, name: 'user_name' })
  userName!: string;

  @Column({ type: 'boolean', default: true, name: 'is_active' })
  isActive!: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;

  @OneToOne(() => Profile, (profile) => profile.user)
  profile!: Profile;

  @OneToOne(() => UserStats, (userStats) => userStats.user)
  userStats!: UserStats;

  @OneToMany(() => Account, (account) => account.user)
  accounts!: Account[];

  @OneToMany(() => Post, (post) => post.user)
  posts!: Post[];

  @OneToMany(() => AuthSession, (authSession) => authSession.user)
  authSessions!: AuthSession[];
}
