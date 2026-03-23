import { ApiProperty } from '@nestjs/swagger';
import { UserSummaryResponseDto } from '@/users/dto/response/user-summary-response.dto';

export class AuthResponseDto {
  @ApiProperty({ example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.access' })
  accessToken!: string;

  @ApiProperty({ example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.refresh' })
  refreshToken!: string;

  @ApiProperty({ type: UserSummaryResponseDto })
  user!: UserSummaryResponseDto;
}
