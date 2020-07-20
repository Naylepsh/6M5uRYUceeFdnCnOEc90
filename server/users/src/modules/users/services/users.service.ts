import { Injectable } from '@nestjs/common';
import { UserDto } from '../dtos/user.dto';
import { UserRepository } from '../repository/user.repository';
import { User } from '../domain/user';
import { UserPassword } from '../domain/user.password';

@Injectable()
export class UsersService {
  constructor(private readonly userRepository: UserRepository) {}

  async findAll(): Promise<User[]> {
    return this.userRepository.findAll();
  }

  async findById(id: string): Promise<User> {
    const user = await this.userRepository.findById(id);
    return user;
  }

  async findOneByUsername(username: string): Promise<User> {
    const user = await this.userRepository.findOneByUsername(username);
    return user;
  }

  async createUser(userDto: UserDto): Promise<void> {
    const user = await this.createUserWithProps(userDto);
    return this.userRepository.createUser(user);
  }

  async updateUser(userDto: UserDto): Promise<void> {
    const user = await this.createUserWithProps(userDto);
    return this.userRepository.updateUser(user);
  }

  async createUserWithProps(userDto: UserDto): Promise<User> {
    const password = await UserPassword.create({ value: userDto.password });
    const props = { ...userDto, password };
    return User.create(props, userDto.id);
  }

  async deleteUser(id: string): Promise<void> {
    await this.userRepository.deleteUser(id);
  }
}
