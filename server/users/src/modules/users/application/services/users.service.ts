import { Injectable } from '@nestjs/common';
import { UserDto } from '../dtos/user.dto';
import { UserRepository } from '../../infrastructure/user.repository';
import { UserMapper } from '../mappers/user.mapper';

@Injectable()
export class UsersService {
  constructor(private readonly userRepository: UserRepository) {}

  async findAll(): Promise<UserDto[]> {
    const users = await this.userRepository.findAll();
    return users.map(UserMapper.fromUserToDto);
  }

  async findById(id: string): Promise<UserDto> {
    const user = await this.userRepository.findById(id);
    return UserMapper.fromUserToDto(user);
  }

  async findOneByUsername(username: string): Promise<UserDto> {
    const user = await this.userRepository.findOneByUsername(username);
    return UserMapper.fromUserToDto(user);
  }

  async createUser(userDto: UserDto): Promise<void> {
    const user = await UserMapper.fromDtoToUser(userDto);
    return this.userRepository.createUser(user);
  }

  async updateUser(userDto: UserDto): Promise<void> {
    const user = await UserMapper.fromDtoToUser(userDto);
    return this.userRepository.updateUser(user);
  }

  async deleteUser(id: string): Promise<void> {
    await this.userRepository.deleteUser(id);
  }
}
