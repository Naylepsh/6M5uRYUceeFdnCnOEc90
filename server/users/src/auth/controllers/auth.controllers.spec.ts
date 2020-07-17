import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controllers';

describe('UserController', () => {
  let moduleRef: TestingModule;

  beforeEach(async () => {
    moduleRef = await Test.createTestingModule({
      imports: [AuthController],
    }).compile();
  });

  it('should be defined', async () => {
    const authController = moduleRef.get<AuthController>(AuthController);

    expect(authController).toBeDefined();
  });
});
