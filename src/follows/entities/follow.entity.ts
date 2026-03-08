import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('follows')
export class Follow {
  @PrimaryColumn({ type: 'bigint' })
  follower_id!: bigint;

  @PrimaryColumn({ type: 'bigint' })
  following_id!: bigint;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at!: Date;
}
