import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from './user.entity';

@Entity('profiles')
export class Profile {
  @PrimaryColumn({ type: 'bigint', name: 'user_id' })
  userId!: string;

  @OneToOne(() => User, (user) => user.profile, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user!: User;

  @Column({ type: 'varchar', length: 50, name: 'display_name' })
  displayName!: string;

  @Column({ type: 'text', nullable: true })
  bio!: string;

  @Column({ nullable: true, name: 'profile_image_url' })
  profileImageUrl!: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  location!: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;
}
