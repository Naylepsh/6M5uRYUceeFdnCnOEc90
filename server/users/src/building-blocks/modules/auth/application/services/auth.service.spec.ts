import { Test } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { UserRepository } from '../../infrastructure/repositories/user.repository';
import { AuthService } from './auth.service';
import { AuthModule } from '../../auth.module';
import { UserDbMapper } from '../../infrastructure/mappers/user.mapper';
import { User } from '../../domain/user';
import { UserPassword } from '../../domain/user.password';

describe('AuthService', () => {
  let authService: AuthService;
  let userRepository: UserRepository;
  let jwtService: JwtService;
  let user: User;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [],
      imports: [AuthModule],
    }).compile();

    userRepository = moduleRef.get<UserRepository>(UserRepository);
    authService = moduleRef.get<AuthService>(AuthService);
    jwtService = moduleRef.get<JwtService>(JwtService);

    const password = await UserPassword.create({
      value: 'password',
      hashed: true,
    });
    const props = { username: 'username', password };
    user = await User.create(props);
  });

  describe('validateUser', () => {
    it('should return user id if user was properly authenticated', async () => {
      jest
        .spyOn(userRepository, 'findOneByUsername')
        .mockImplementation(async () => {
          const usr = await UserDbMapper.fromPersistance(user);
          usr.props.password.comparePassword = async () => true;
          return usr;
        });

      const id = await authService.validateUser(user.username, user.password);

      expect(id).toBe(user.id);
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
          const usr = await UserDbMapper.fromPersistance(user);
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
