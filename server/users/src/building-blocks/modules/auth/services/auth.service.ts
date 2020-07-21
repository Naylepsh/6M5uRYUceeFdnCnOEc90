import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AccessTokenDto } from '../dtos/token.auth.dto';
import { UserDto } from '../../../../modules/users/application/dtos/user.dto';
import { UserRepository } from '../../../../modules/users/infrastructure/user.repository';
import { UserMapper } from '../../../../modules/users/application/mappers/user.mapper';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userRepository: UserRepository,
  ) {}

  async validateUser(username: string, password: string): Promise<UserDto> {
    const user = await this.userRepository.findOneByUsername(username);
    if (!user) return null;

    if (await user.props.password.comparePassword(password)) {
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
