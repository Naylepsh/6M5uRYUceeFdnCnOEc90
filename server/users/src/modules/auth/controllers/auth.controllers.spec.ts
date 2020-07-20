import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controllers';
import { AuthModule } from '../auth.module';

describe('UserController', () => {
  let moduleRef: TestingModule;

  beforeEach(async () => {
    moduleRef = await Test.createTestingModule({
      imports: [AuthModule],
    }).compile();
  });

  it('should be defined', async () => {
    const authController = moduleRef.get<AuthController>(AuthController);

    expect(authController).toBeDefined();
  });
});
