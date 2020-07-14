import { Controller, Get } from '@nestjs/common';
import { UsersService } from '../services/users.service';
import { UserDto } from '../dtos/user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}
  @Get()
  async findAll(): Promise<UserDto[]> {
    return this.userService.findAll();
  }
}
