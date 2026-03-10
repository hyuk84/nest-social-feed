import { User } from '@/users/entities/user.entity';
import { AuthSession } from '@/auth/entities/auth-session.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('accounts')
export class Account {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id!: string;

  @ManyToOne(() => User, (user) => user.accounts, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user!: User;

  @Column({ type: 'varchar', length: 30 })
  provider!: string;

  @Column({ type: 'varchar', length: 255, name: 'provider_account_id' })
  providerAccountId!: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  email!: string | null;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: true,
    name: 'password_hash',
  })
  passwordHash!: string | null;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: true,
    name: 'provider_access_token',
  })
  providerAccessToken!: string;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: true,
    name: 'provider_refresh_token',
  })
  providerRefreshToken!: string;

  @Column({ type: 'int', nullable: true, name: 'provider_token_expires_at' })
  providerTokenExpiresAt!: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;

  @OneToMany(() => AuthSession, (authSession) => authSession.account)
  authSessions!: AuthSession[];
}
