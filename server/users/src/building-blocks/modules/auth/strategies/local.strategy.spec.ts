import { Test } from '@nestjs/testing';
import { UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { AuthModule } from '../auth.module';
import { LocalStrategy } from './local.strategy';
import { UserAuthDto } from '../dtos/user-auth.dto';

describe('Local Strategy', () => {
  let authService: AuthService;
  let localStrategy: LocalStrategy;
  const user: UserAuthDto = {
    username: 'username',
    password: 'password',
  };

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AuthModule],
    }).compile();

    authService = moduleRef.get<AuthService>(AuthService);
    localStrategy = moduleRef.get<LocalStrategy>(LocalStrategy);
  });

  describe('validate', () => {
    it('should return user if payload was validated properly', async () => {
      const id = '1';
      jest.spyOn(authService, 'validateUser').mockImplementation(async () => {
        return { id, ...user };
      });

      const res = await localStrategy.validate(user.username, user.password);

      expect(res).toBe(id);
    });

    it('should throw an error if user payload failed validation', async () => {
      jest
        .spyOn(authService, 'validateUser')
        .mockImplementation(async () => undefined);

      expect(() =>
        localStrategy.validate(user.username, user.password),
      ).rejects.toThrow(UnauthorizedException);
    });
  });
});
