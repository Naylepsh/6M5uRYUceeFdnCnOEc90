import { UserDto } from './../../users/dtos/user.dto';
import { Test } from '@nestjs/testing';
import { UserRepository } from './../../users/repository/user.repository';
import { AuthService } from './auth.service';
import { UsersService } from './../../users/services/users.service';
import { HashingService } from './../../utils/hashing.service';

describe('AuthService', () => {
  let authService: AuthService;
  let hashingService: HashingService;
  let userRepository: UserRepository;
  const user: UserDto = {
    username: 'username',
    firstName: 'john',
    lastName: 'doe',
    avatarUrl: 'path/to/avatar',
    password: 'password',
  };

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [],
      providers: [AuthService, UsersService, HashingService, UserRepository],
    }).compile();

    userRepository = moduleRef.get<UserRepository>(UserRepository);
    authService = moduleRef.get<AuthService>(AuthService);
    hashingService = moduleRef.get<HashingService>(HashingService);
  });

  it('should return user if user was properly authenticated', async () => {
    jest
      .spyOn(userRepository, 'findOneByUsername')
      .mockImplementation(async () => user);
    jest.spyOn(hashingService, 'compare').mockImplementation(async () => true);

    const res = await authService.validateUser(user.username, user.password);

    expect(res).toHaveProperty('username', user.username);
  });

  it('should return null if user was not found', async () => {
    jest
      .spyOn(userRepository, 'findOneByUsername')
      .mockImplementation(async () => undefined);
    jest.spyOn(hashingService, 'compare').mockImplementation(async () => true);
    const res = await authService.validateUser(user.username, user.password);

    expect(res).toBe(null);
  });

  it('should return null if password didnt match', async () => {
    jest
      .spyOn(userRepository, 'findOneByUsername')
      .mockImplementation(async () => user);
    jest.spyOn(hashingService, 'compare').mockImplementation(async () => false);
    const res = await authService.validateUser(user.username, user.password);

    expect(res).toBe(null);
  });
});
