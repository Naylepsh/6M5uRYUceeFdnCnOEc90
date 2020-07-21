import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AccessTokenDto } from '../dtos/token.auth.dto';
import { UserRepository } from '../repositories/user.repository';
import { UserAuthMapper } from '../mappers/user.mapper';
import { UserAuthDto } from '../dtos/user-auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userRepository: UserRepository,
  ) {}

  async validateUser(username: string, password: string): Promise<UserAuthDto> {
    const user = await this.userRepository.findOneByUsername(username);
    if (!user) return null;

    if (await user.props.password.comparePassword(password)) {
      const userDto = UserAuthMapper.fromUserToDto(user);
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
