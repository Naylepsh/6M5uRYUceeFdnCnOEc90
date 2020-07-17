import { UserDto } from './../../users/dtos/user.dto';
import { Test } from '@nestjs/testing';
import { UserRepository } from './../../users/repository/user.repository';
import { AuthService } from './auth.service';
import { HashingService } from './../../utils/hashing.service';
import { AuthModule } from '../auth.module';
import { JwtService } from '@nestjs/jwt';

describe('AuthService', () => {
  let authService: AuthService;
  let hashingService: HashingService;
  let userRepository: UserRepository;
  let jwtService: JwtService;
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
      imports: [AuthModule],
    }).compile();

    userRepository = moduleRef.get<UserRepository>(UserRepository);
    authService = moduleRef.get<AuthService>(AuthService);
    hashingService = moduleRef.get<HashingService>(HashingService);
    jwtService = moduleRef.get<JwtService>(JwtService);
  });

  describe('validateUser', () => {
    it('should return user if user was properly authenticated', async () => {
      jest
        .spyOn(userRepository, 'findOneByUsername')
        .mockImplementation(async () => user);
      jest
        .spyOn(hashingService, 'compare')
        .mockImplementation(async () => true);

      const res = await authService.validateUser(user.username, user.password);

      expect(res).toHaveProperty('username', user.username);
    });

    it('should return null if user was not found', async () => {
      jest
        .spyOn(userRepository, 'findOneByUsername')
        .mockImplementation(async () => undefined);
      jest
        .spyOn(hashingService, 'compare')
        .mockImplementation(async () => true);
      const res = await authService.validateUser(user.username, user.password);

      expect(res).toBe(null);
    });

    it('should return null if password didnt match', async () => {
      jest
        .spyOn(userRepository, 'findOneByUsername')
        .mockImplementation(async () => user);
      jest
        .spyOn(hashingService, 'compare')
        .mockImplementation(async () => false);
      const res = await authService.validateUser(user.username, user.password);

      expect(res).toBe(null);
    });
  });

  describe('login', () => {
    it('should provide a jwt which when decoded gives the same id as the one passed', async () => {
      const id = '1';

      const { accessToken } = await authService.login(id);
      const { sub: decodedId } = jwtService.decode(accessToken);

      expect(id).toBe(decodedId);
    });
  });
});
