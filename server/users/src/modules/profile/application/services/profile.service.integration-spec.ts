import { ProfileService } from './profile.service';
import { Test } from '@nestjs/testing';
import { ProfileRepository } from '../../infrastructure/profile.repository';
import {
  populateDatabase,
  cleanDatabase,
} from '../../tests/helpers/tests.db.helpers';

describe('Profile Service integration with Profile Repository', () => {
  let profileService: ProfileService;
  const sampleProfile = {
    id: '1',
    username: 'john the user',
    password: 'password',
    firstName: 'john',
    lastName: 'doe',
    avatarUrl: 'path/to/avatar',
  };

  beforeAll(async () => {
    await loadDependencies();
    await populateDatabase([sampleProfile]);
  });

  const loadDependencies = async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [ProfileService, ProfileRepository],
    }).compile();

    profileService = moduleRef.get<ProfileService>(ProfileService);
  };

  afterAll(() => {
    cleanDatabase();
  });

  describe('findById', () => {
    it('should return a profile if valid id was passed', async () => {
      const profile = await profileService.findById(sampleProfile.id);

      expect(profile).toHaveProperty('id', sampleProfile.id);
    });

    it('should return null if user is not in database', async () => {
      const id = '42';
      const profile = await profileService.findById(id);

      expect(profile).toBeNull();
    });
  });
});
