import { Injectable } from '@nestjs/common';
import { FakeDatabase } from '../../../database/database.fake';
import { Profile } from '../domain/profile';
import { ProfileDbMapper } from './profile.mapper';

@Injectable()
export class ProfileRepository {
  async findById(id: string): Promise<Profile> {
    const profile = FakeDatabase.findById(id);
    if (!profile) return null;
    return ProfileDbMapper.fromPersistance(profile);
  }
}
