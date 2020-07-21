import { Injectable } from '@nestjs/common';
import { User } from '../../domain/user';
import { UserDbMapper } from '../mappers/user.mapper';
import { FakeDatabase } from '../../../../../database/database.fake';

@Injectable()
export class UserRepository {
  async findOneByUsername(username: string): Promise<User> {
    const user = FakeDatabase.findOneByUsername(username);
    if (!user) return null;
    return UserDbMapper.fromPersistance(user);
  }
}
