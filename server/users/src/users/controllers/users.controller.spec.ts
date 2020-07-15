import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersModule } from '../users.module';

describe('UserController', () => {
  let moduleRef: TestingModule;

  beforeEach(async () => {
    moduleRef = await Test.createTestingModule({
      imports: [UsersModule],
    }).compile();
  });

  it('should be defined', async () => {
    const usersController = moduleRef.get<UsersController>(UsersController);

    expect(usersController).toBeDefined();
  });
});
