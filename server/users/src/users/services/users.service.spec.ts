import { UsersService } from './users.service';
import { Test } from '@nestjs/testing';
import { UserDto } from './../dtos/user.dto';
import { UserRepository } from './../repository/user.repository';

describe('UserService', () => {
  let usersService: UsersService;
  let userRepository: UserRepository;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [],
      providers: [UsersService, UserRepository],
    }).compile();

    usersService = moduleRef.get<UsersService>(UsersService);
    userRepository = moduleRef.get<UserRepository>(UserRepository);
  });

  describe('findAll', () => {
    it('should return all users', async () => {
      const users: UserDto[] = [
        { id: '1', username: 'username', password: 'password' },
      ];
      jest.spyOn(userRepository, 'findAll').mockImplementation(async () => {
        console.log('sadasds');
        return users;
      });

      const res = await usersService.findAll();

      expect(res).toBe(users);
    });
  });
});
