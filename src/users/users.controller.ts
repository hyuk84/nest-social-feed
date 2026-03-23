import { Controller, Get, HttpCode, HttpStatus } from '@nestjs/common';
import { UsersService } from './users.service';
import { ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '@/auth/decorators/current-user.decorator';
import { AccessTokenProtected } from '@/auth/decorators/access-token-protected.decorator';
import { ApiUsersMeDocs } from '@/users/swagger/users-docs.decorator';
import { UserMeResponseDto } from './dto/response/user-me-response.dto';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiUsersMeDocs()
  @AccessTokenProtected()
  @HttpCode(HttpStatus.OK)
  @Get('me')
  async getMe(@CurrentUser('id') userId: string): Promise<UserMeResponseDto> {
    return this.usersService.getMe(userId);
  }
}
