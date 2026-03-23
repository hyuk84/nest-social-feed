import { Injectable } from '@nestjs/common';
import { UserMeResponseDto } from './dto/response/user-me-response.dto';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { USER_ERROR_CODES } from '@/common/errors/codes/user-error.codes';
import { AppException } from '@/common/errors/exceptions/app.exception';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async getMe(userId: string): Promise<UserMeResponseDto> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['profile'],
    });

    if (!user) {
      throw new AppException(USER_ERROR_CODES.USER_NOT_FOUND);
    }

    return {
      user: {
        id: user.id,
        publicId: user.publicId,
        email: user.email,
        userName: user.userName,
        displayName: user.profile?.displayName,
        profileImageUrl: user.profile?.profileImageUrl,
      },
    };
  }
}
