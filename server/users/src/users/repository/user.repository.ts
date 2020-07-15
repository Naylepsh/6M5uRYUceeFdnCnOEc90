import { Injectable } from '@nestjs/common';
import { UserDto } from '../dtos/user.dto';
import { FakeDatabase } from '../../database/database.fake';

@Injectable()
export class UserRepository {
  async findAll(): Promise<UserDto[]> {
    return FakeDatabase.findAll();
  }

  async createUser(user: UserDto): Promise<void> {
    FakeDatabase.createUser(user);
  }
}
