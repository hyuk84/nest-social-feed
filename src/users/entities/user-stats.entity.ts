import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity('user_stats')
export class UserStats {
  @PrimaryColumn({ type: 'bigint' })
  user_id!: bigint;

  @Column({ type: 'int', default: 0 })
  followers_count!: number;

  @Column({ type: 'int', default: 0 })
  following_count!: number;

  @Column({ type: 'int', default: 0 })
  posts_count!: number;
}
