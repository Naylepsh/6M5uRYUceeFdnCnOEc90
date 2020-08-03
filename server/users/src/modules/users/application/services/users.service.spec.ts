import { UsersService } from './users.service';
import { Test } from '@nestjs/testing';
import { UserDto } from '../dtos/user.dto';
import { UserRepository } from '../../infrastructure/user.repository';
import { UserMapper } from '../mappers/user.mapper';
import { User } from '../../domain/user';

describe('UserService', () => {
  let usersService: UsersService;
  let userRepository: UserRepository;
  let repoCall;
  const user: UserDto = {
    id: '1',
    username: 'username',
    firstName: 'john',
    lastName: 'doe',
    avatarUrl: 'path/to/avatar',
    password: 'password',
  };

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [],
      providers: [UsersService, UserRepository],
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
    let users: User[] = [];

    beforeEach(async () => {
      users = [await UserMapper.fromDtoToUser(user)];
      initRepoCallMock(userRepository, 'findAll', async () => users);
    });

    it('should call repository to find all users', async () => {
      await usersService.findAll();

      expect(repoCall).toBeCalled();
    });

    it('should return all users', async () => {
      const res = await usersService.findAll();

      const usernames = users.map(user => user.props.username);
      for (const user of res) {
        expect(usernames.includes(user.username)).toBe(true);
      }
    });
  });

  describe('findById', () => {
    beforeEach(() => {
      initRepoCallMock(userRepository, 'findById', async () => {
        const props = { ...user, password: { value: user.password } };
        return { props };
      });
    });

    it('should call repo to find an user', async () => {
      await usersService.findById(user.id);

      expect(repoCall).toBeCalled();
    });

    it('should return an user if a valid id is passed', async () => {
      const res = await usersService.findById(user.id);

      expect(res).toStrictEqual(user);
    });

    it('should return undefined if a user was not found', async () => {
      // override mock
      initRepoCallMock(userRepository, 'findById', async () => null);

      const res = await usersService.findById(user.id);
      expect(res).toBe(undefined);
    });

    // TODO:
    // it('should throw an error if invalid id is passed')
  });

  describe('findOneByUsername', () => {
    beforeEach(() => {
      initRepoCallMock(userRepository, 'findOneByUsername', async () => {
        const props = { ...user, password: { value: user.password } };
        return { props };
      });
    });

    it('should call repo to find an user', async () => {
      await usersService.findOneByUsername(user.username);

      expect(repoCall).toBeCalled();
    });

    it('should return an user if a valid username is passed', async () => {
      const res = await usersService.findOneByUsername(user.username);

      expect(res).toStrictEqual(user);
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
