import { Injectable } from '@nestjs/common';
import { UsersService } from '../../users/application/services/users.service';
import { HashingService } from '../../../utils/hashing.service';
import { JwtService } from '@nestjs/jwt';
import { AccessTokenDto } from '../dtos/token.auth.dto';
import { UserDto } from './../../../../src/modules/users/application/dtos/user.dto';
import { UserRepository } from './../../../../src/modules/users/infrastructure/user.repository';
import { UserMapper } from './../../../../src/modules/users/application/mappers/user.mapper';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly hashingService: HashingService,
    private readonly jwtService: JwtService,
    private readonly userRepository: UserRepository,
  ) {}

  async validateUser(
    username: string,
    password: string,
  ): Promise<UserDto | null> {
    const user = await this.userRepository.findOneByUsername(username);
    if (!user) return null;

    if (user.props.password.comparePassword(password)) {
      const userDto = UserMapper.fromUserToDto(user);
      delete userDto.password;
      return userDto;
    }
    return null;
  }

  async login(userId: string): Promise<AccessTokenDto> {
    const payload = { sub: userId };
    return {
      accessToken: this.jwtService.sign(payload),
    };
  }
}
