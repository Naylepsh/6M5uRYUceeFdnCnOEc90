import { Injectable } from '@nestjs/common';
import { FakeDatabase } from '../../../database/database.fake';
import { User } from '../domain/user';
import { UserDbMapper } from './user.mapper';

@Injectable()
export class UserRepository {
  async findAll(): Promise<User[]> {
    const users = await FakeDatabase.findAll();
    return Promise.all([...users.map(UserDbMapper.fromPersistance)]);
  }

  async findById(id: string): Promise<User> {
    const user = FakeDatabase.findById(id);
    return UserDbMapper.fromPersistance(user);
  }

  async findOneByUsername(username: string): Promise<User> {
    const user = FakeDatabase.findOneByUsername(username);
    return UserDbMapper.fromPersistance(user);
  }

  async createUser(user: User): Promise<void> {
    return FakeDatabase.createUser(UserDbMapper.toPersistance(user));
  }

  async updateUser(user: User): Promise<void> {
    return FakeDatabase.updateUser(UserDbMapper.toPersistance(user));
  }

  async deleteUser(id: string): Promise<void> {
    return FakeDatabase.deleteUser(id);
  }
}
