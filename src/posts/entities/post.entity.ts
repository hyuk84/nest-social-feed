import { User } from '../../users/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('posts')
export class Post {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id!: string;

  @ManyToOne(() => User, (user) => user.posts, { onDelete: 'CASCADE' })
  user!: User;

  @Column({ type: 'text' })
  content!: string;

  @Column({ type: 'int', default: 0, name: 'likes_count' })
  likesCount!: number;

  @Column({ type: 'int', default: 0, name: 'comments_count' })
  commentsCount!: number;

  @Column({ type: 'boolean', default: true, name: 'is_public' })
  isPublic!: boolean;

  @Column({ type: 'boolean', default: true, name: 'is_active' })
  isActive!: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;

  @Column({ type: 'timestamp', nullable: true, name: 'delete_at' })
  deleteAt!: Date;
}
