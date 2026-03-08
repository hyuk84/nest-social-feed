import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('profiles')
export class Profile {
  @PrimaryColumn({ type: 'bigint' })
  user_id!: bigint;

  @Column({ type: 'varchar', length: 50 })
  display_name!: string;

  @Column({ type: 'varchar', length: 6, nullable: true })
  bio!: string;

  @Column({ nullable: true })
  profile_image_url!: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  location!: string;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updated_at!: Date;
}
