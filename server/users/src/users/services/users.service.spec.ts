import { UsersService } from './users.service';
import { Test } from '@nestjs/testing';
import { UserDto } from './../dtos/user.dto';
import { UserRepository } from './../repository/user.repository';
import { NotFoundException } from './../../exceptions/not-found.exception';

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
        return users;
      });

      const res = await usersService.findAll();

      expect(res).toBe(users);
    });
  });

  describe('findById', () => {
    const user: UserDto = {
      id: '1',
      username: 'username',
      password: 'password',
    };

    it('should return an user if a valid id is passed', async () => {
      jest
        .spyOn(userRepository, 'findById')
        .mockImplementation(async () => user);

      const res = await usersService.findById(user.id);

      expect(res).toBe(user);
    });

    it('should throw an error if a user was not found', async () => {
      jest
        .spyOn(userRepository, 'findById')
        .mockImplementation(async () => null);

      expect(() => usersService.findById(user.id)).rejects.toThrow(
        NotFoundException,
      );
    });

    // TODO:
    // it('should throw an error if invalid id is passed')
  });

  describe('createUser', () => {
    const user: UserDto = {
      id: '1',
      username: 'username',
      password: 'password',
    };

    it('should call repository to create a new user', async () => {
      const fn = jest
        .spyOn(userRepository, 'createUser')
        .mockImplementation(async () => null);

      await usersService.createUser(user);

      expect(fn).toBeCalled();
    });

    // TODO: validation check
  });
});
