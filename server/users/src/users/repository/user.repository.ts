import { Injectable } from '@nestjs/common';
import { UserDto } from '../dtos/user.dto';
import { FakeDatabase } from '../../database/database.fake';

@Injectable()
export class UserRepository {
  async findAll(): Promise<UserDto[]> {
    return FakeDatabase.findAll();
  }

  async findById(id: string): Promise<UserDto> {
    return FakeDatabase.findById(id);
  }

  async createUser(user: UserDto): Promise<void> {
    return FakeDatabase.createUser(user);
  }

  async updateUser(user: UserDto): Promise<void> {
    return FakeDatabase.updateUser(user);
  }

  async deleteUser(id: string): Promise<void> {
    return FakeDatabase.deleteUser(id);
  }
}
