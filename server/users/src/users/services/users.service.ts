import { Injectable } from '@nestjs/common';
import { UserDto } from '../dtos/user.dto';

@Injectable()
export class UsersService {
  async findAll(): Promise<UserDto[]> {
    return null;
  }
}
