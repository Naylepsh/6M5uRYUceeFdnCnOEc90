import { UserDto } from '../../../../modules/users/application/dtos/user.dto';
import { Test } from '@nestjs/testing';
import { UserRepository } from '../../../../modules/users/infrastructure/user.repository';
import { AuthService } from './auth.service';
import { AuthModule } from '../auth.module';
import { JwtService } from '@nestjs/jwt';
import { UserMapper } from '../../../../modules/users/application/mappers/user.mapper';

describe('AuthService', () => {
  let authService: AuthService;
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
    jwtService = moduleRef.get<JwtService>(JwtService);
  });

  describe('validateUser', () => {
    it('should return user if user was properly authenticated', async () => {
      jest
        .spyOn(userRepository, 'findOneByUsername')
        .mockImplementation(async () => {
          const usr = await UserMapper.fromDtoToUser(user);
          usr.props.password.comparePassword = async () => true;
          return usr;
        });

      const res = await authService.validateUser(user.username, user.password);

      expect(res).toHaveProperty('username', user.username);
    });

    it('should return null if user was not found', async () => {
      jest
        .spyOn(userRepository, 'findOneByUsername')
        .mockImplementation(async () => null);
      const res = await authService.validateUser(user.username, user.password);

      expect(res).toBe(null);
    });

    it('should return null if password didnt match', async () => {
      jest
        .spyOn(userRepository, 'findOneByUsername')
        .mockImplementation(async () => {
          const usr = await UserMapper.fromDtoToUser(user);
          usr.props.password.comparePassword = async () => false;
          return usr;
        });
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
