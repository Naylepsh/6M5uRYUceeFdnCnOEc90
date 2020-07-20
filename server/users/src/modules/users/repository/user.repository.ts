import { Injectable } from '@nestjs/common';
import { UserDto } from '../dtos/user.dto';
import { FakeDatabase } from '../../../database/database.fake';
import { User } from '../domain/user';

@Injectable()
export class UserRepository {
  async findAll(): Promise<User[]> {
    return FakeDatabase.findAll();
  }

  async findById(id: string): Promise<User> {
    return FakeDatabase.findById(id);
  }

  async findOneByUsername(username: string): Promise<User> {
    return FakeDatabase.findOneByUsername(username);
  }

  async createUser(user: User): Promise<void> {
    return FakeDatabase.createUser(user);
  }

  async updateUser(user: User): Promise<void> {
    return FakeDatabase.updateUser(user);
  }

  async deleteUser(id: string): Promise<void> {
    return FakeDatabase.deleteUser(id);
  }
}
