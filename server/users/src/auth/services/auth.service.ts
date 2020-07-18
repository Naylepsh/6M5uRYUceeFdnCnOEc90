import { Injectable } from '@nestjs/common';
import { UsersService } from './../../users/services/users.service';
import { HashingService } from './../../utils/hashing.service';
import { JwtService } from '@nestjs/jwt';
import { AccessTokenDto } from '../dtos/token.auth.dto';
import { UserDto } from 'src/users/dtos/user.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly hashingService: HashingService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(
    username: string,
    password: string,
  ): Promise<UserDto | null> {
    const user = await this.usersService.findOneByUsername(username);

    if (!user) return null;

    const isPasswordMatching = await this.hashingService.compare(
      password,
      user.password,
    );
    if (isPasswordMatching) {
      delete user.password;
      return user;
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
