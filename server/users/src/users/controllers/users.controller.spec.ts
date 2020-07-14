import { Test } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from '../services/users.service';
import { UserDto } from '../dtos/user.dto';

describe('UserController', () => {
  let usersController: UsersController;
  let usersService: UsersService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [UsersService],
    }).compile();

    usersController = moduleRef.get<UsersController>(UsersController);
    usersService = moduleRef.get<UsersService>(UsersService);
  });

  describe('findAll', () => {
    it('should return all users', async () => {
      const result: UserDto[] = [
        { id: '1', username: 'username', password: 'password' },
      ];

      jest
        .spyOn(usersService, 'findAll')
        .mockImplementation(async () => result);

      expect(await usersController.findAll()).toBe(result);
    });
  });
});
