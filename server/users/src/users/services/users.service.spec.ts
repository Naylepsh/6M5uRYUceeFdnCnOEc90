import { UsersService } from './users.service';
import { Test } from '@nestjs/testing';
import { UserDto } from './../dtos/user.dto';
import { UserRepository } from './../repository/user.repository';
import { HashingService } from './../../utils/hashing.service';

describe('UserService', () => {
  let usersService: UsersService;
  let userRepository: UserRepository;
  let repoCall;
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
      providers: [UsersService, HashingService, UserRepository],
    }).compile();

    usersService = moduleRef.get<UsersService>(UsersService);
    userRepository = moduleRef.get<UserRepository>(UserRepository);
  });

  const initRepoCallMock = (
    repo: any,
    functionName: string,
    mockImpl: () => any,
  ) => {
    repoCall = jest.spyOn(repo, functionName).mockImplementation(mockImpl);
  };

  describe('findAll', () => {
    const users: UserDto[] = [user];

    beforeEach(() => {
      initRepoCallMock(userRepository, 'findAll', async () => users);
    });

    it('should call repository to find all users', async () => {
      await usersService.findAll();

      expect(repoCall).toBeCalled();
    });

    it('should return all users', async () => {
      const res = await usersService.findAll();

      expect(res).toBe(users);
    });
  });

  describe('findById', () => {
    beforeEach(() => {
      initRepoCallMock(userRepository, 'findById', async () => user);
    });

    it('should call repo to find an user', async () => {
      await usersService.findById(user.id);

      expect(repoCall).toBeCalled();
    });

    it('should return an user if a valid id is passed', async () => {
      const res = await usersService.findById(user.id);

      expect(res).toBe(user);
    });

    it('should return undefined if a user was not found', async () => {
      // override mock
      initRepoCallMock(userRepository, 'findById', async () => undefined);

      // expect(() => usersService.findById(user.id)).rejects.toThrow(
      //   NotFoundException,
      // );
      const res = await usersService.findById(user.id);
      expect(res).toBe(undefined);
    });

    // TODO:
    // it('should throw an error if invalid id is passed')
  });

  describe('findOneByUsername', () => {
    beforeEach(() => {
      initRepoCallMock(userRepository, 'findOneByUsername', async () => user);
    });

    it('should call repo to find an user', async () => {
      await usersService.findOneByUsername(user.username);

      expect(repoCall).toBeCalled();
    });

    it('should return an user if a valid id is passed', async () => {
      const res = await usersService.findOneByUsername(user.username);

      expect(res).toBe(user);
    });

    it('should return undefined if a user was not found', async () => {
      // override mock
      initRepoCallMock(
        userRepository,
        'findOneByUsername',
        async () => undefined,
      );

      const res = await usersService.findOneByUsername(user.username);

      expect(res).toBe(undefined);
    });
  });

  describe('createUser', () => {
    beforeEach(() => {
      initRepoCallMock(userRepository, 'createUser', async () => null);
    });

    it('should call repository to create a new user', async () => {
      await usersService.createUser(user);

      expect(repoCall).toBeCalled();
    });

    // TODO: validation check
  });

  describe('updateUser', () => {
    beforeEach(() => {
      initRepoCallMock(userRepository, 'updateUser', async () => null);
    });

    it('should call repository to update a new user', async () => {
      await usersService.updateUser(user);

      expect(repoCall).toBeCalled();
    });

    // TODO: validation check
  });

  describe('deleteUser', () => {
    beforeEach(() => {
      initRepoCallMock(userRepository, 'deleteUser', async () => null);
    });

    it('should call repository to delete a new user', async () => {
      const id = '1';

      await usersService.deleteUser(id);

      expect(repoCall).toBeCalled();
    });
  });
});
