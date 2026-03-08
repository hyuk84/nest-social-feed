import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('post_likes')
export class PostLike {
  @PrimaryColumn({ type: 'bigint' })
  user_id!: bigint;

  @PrimaryColumn({ type: 'bigint' })
  post_id!: bigint;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at!: Date;
}
