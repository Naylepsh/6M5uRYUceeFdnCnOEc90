import { ProfileRepository } from './profile.repository';
import { FakeDatabase } from '../../../database/database.fake';

describe('Profile Repository integration with database', () => {
  const profileRepository = new ProfileRepository();
  const sampleProfile = {
    id: '1',
    username: 'john the user',
    password: 'password',
    firstName: 'john',
    lastName: 'doe',
    avatarUrl: 'path/to/avatar',
  };

  beforeAll(async () => {
    FakeDatabase.createUser(sampleProfile);
  });

  afterAll(async () => {
    const users = FakeDatabase.findAll();
    for (const user of users) {
      FakeDatabase.deleteUser(user.id);
    }
  });

  describe('findById', () => {
    it('should return user if valid id was passed', async () => {
      const profile = await profileRepository.findById(sampleProfile.id);

      expect(profile).toHaveProperty('id', sampleProfile.id);
    });

    it('should return null if user does not exist in database', async () => {
      const profile = await profileRepository.findById('42');

      expect(profile).toBe(null);
    });
  });
});
