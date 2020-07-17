import { Injectable } from '@nestjs/common';
import { UsersService } from './../../users/services/users.service';
import { HashingService } from './../../utils/hashing.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly hashingService: HashingService,
  ) {}

  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.usersService.findOneByUsername(username);

    if (!user) return null;

    const isPasswordMatching = await this.hashingService.compare(
      pass,
      user.password,
    );
    if (isPasswordMatching) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }
}
