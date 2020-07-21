import { ProfileRepository } from './profile.repository';
import { populateDatabase, cleanDatabase } from '../tests/tests.db.helpers';

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
    populateDatabase([sampleProfile]);
  });

  afterAll(async () => {
    cleanDatabase();
  });

  describe('findById', () => {
    it('should return a profile if valid id was passed', async () => {
      const profile = await profileRepository.findById(sampleProfile.id);

      expect(profile).toHaveProperty('id', sampleProfile.id);
    });

    it('should return null if profile does not exist in database', async () => {
      const id = '42';
      const profile = await profileRepository.findById(id);

      expect(profile).toBeNull();
    });
  });
});
