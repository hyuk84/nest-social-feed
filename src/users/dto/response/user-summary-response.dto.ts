import { ApiProperty } from '@nestjs/swagger';

export class UserSummaryResponseDto {
  @ApiProperty({ example: '1234' })
  id!: string;

  @ApiProperty({ example: 'c77f12d9-9aa0-4b56-9e73-117bb3b6f779' })
  publicId!: string;

  @ApiProperty({ example: 'user@example.com' })
  email!: string;

  @ApiProperty({ example: 'andy_dev' })
  userName!: string;

  @ApiProperty({ example: 'Andy', nullable: true })
  displayName!: string | null;

  @ApiProperty({
    example: 'https://cdn.example.com/profiles/andy.png',
    nullable: true,
  })
  profileImageUrl!: string | null;
}
