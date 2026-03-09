import { Column, CreateDateColumn, Entity, PrimaryColumn } from 'typeorm';

@Entity('post_likes')
export class PostLike {
  @PrimaryColumn({ type: 'bigint' })
  user_id!: string;

  @PrimaryColumn({ type: 'bigint' })
  post_id!: string;

  @CreateDateColumn()
  created_at!: Date;
}
