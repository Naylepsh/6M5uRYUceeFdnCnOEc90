import { Controller, Get, Param } from '@nestjs/common';
import { UsersService } from '../services/users.service';
import { UserDto } from '../dtos/user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Get()
  async findAll(): Promise<UserDto[]> {
    return await this.userService.findAll();
  }

  @Get(':id')
  async findById(@Param('id') id: string): Promise<UserDto> {
    return await this.userService.findById(id);
  }
}
