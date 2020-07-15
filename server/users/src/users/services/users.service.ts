import { Injectable } from '@nestjs/common';
import { UserDto } from '../dtos/user.dto';
import { UserRepository } from './../repository/user.repository';
import { NotFoundException } from './../../exceptions/not-found.exception';

@Injectable()
export class UsersService {
  constructor(private readonly userRepository: UserRepository) {}

  async findAll(): Promise<UserDto[]> {
    return this.userRepository.findAll();
  }

  async findById(id: string): Promise<UserDto> {
    const user = await this.userRepository.findById(id);
    if (user === null) {
      throw new NotFoundException();
    }

    return user;
  }

  async createUser(user: UserDto): Promise<void> {
    await this.userRepository.createUser(user);
  }

  async updateUser(user: UserDto): Promise<void> {
    await this.userRepository.updateUser(user);
  }
}
