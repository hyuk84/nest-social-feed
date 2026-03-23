import { ApiProperty } from '@nestjs/swagger';
import { UserSummaryResponseDto } from './user-summary-response.dto';

export class UserMeResponseDto {
  @ApiProperty({ type: UserSummaryResponseDto })
  user!: UserSummaryResponseDto;
}
