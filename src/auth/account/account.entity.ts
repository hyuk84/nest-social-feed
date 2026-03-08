import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('accounts')
export class Account {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id!: bigint;

  @Column({ type: 'bigint' })
  user_id!: bigint;

  provider!: string;

  @Column({ type: 'varchar', length: 255 })
  provider_account_id!: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  email!: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  provider_access_token!: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  provider_refresh_token!: string;

  provider_token_expires_at!: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at!: Date;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updated_at!: Date;
}
