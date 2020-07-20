import { Injectable } from '@nestjs/common';
import { UserDto } from '../dtos/user.dto';
import { UserRepository } from '../repository/user.repository';
import { HashingService } from '../../../utils/hashing.service';

@Injectable()
export class UsersService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly hashingService: HashingService,
  ) {}

  async findAll(): Promise<UserDto[]> {
    return this.userRepository.findAll();
  }

  async findById(id: string): Promise<UserDto | undefined> {
    const user = await this.userRepository.findById(id);
    return user;
  }

  async findOneByUsername(username: string): Promise<UserDto | undefined> {
    const user = await this.userRepository.findOneByUsername(username);
    return user;
  }

  async createUser(user: UserDto): Promise<void> {
    const hashedPassword = await this.hashingService.hash(user.password);
    await this.userRepository.createUser({ ...user, password: hashedPassword });
  }

  async updateUser(user: UserDto): Promise<void> {
    const hashedPassword = await this.hashingService.hash(user.password);
    await this.userRepository.updateUser({ ...user, password: hashedPassword });
  }

  async deleteUser(id: string): Promise<void> {
    await this.userRepository.deleteUser(id);
  }
}
