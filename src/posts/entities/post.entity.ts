import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('posts')
export class Post {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id!: bigint;

  @Column({ type: 'bigint' })
  user_id!: bigint;

  @Column({ type: 'text' })
  content!: string;

  @Column({ type: 'int', default: 0 })
  likes_count!: number;

  @Column({ type: 'int', default: 0 })
  comments_count!: number;

  @Column({ type: 'boolean', default: true })
  is_public!: boolean;

  @Column({ type: 'boolean', default: true })
  is_active!: boolean;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at!: Date;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updated_at!: Date;

  @Column({ type: 'timestamp', nullable: true })
  delete_at!: Date;
}
