import { Controller, Get, Param, Post, Body, Put } from '@nestjs/common';
import { UsersService } from '../services/users.service';
import { UserDto } from '../dtos/user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Get()
  async findAll(): Promise<UserDto[]> {
    return await this.userService.findAll();
  }

  @Post()
  async createUser(@Body() user: UserDto): Promise<void> {
    return await this.userService.createUser(user);
  }

  @Get(':id')
  async findById(@Param('id') id: string): Promise<UserDto> {
    return await this.userService.findById(id);
  }

  @Put(':id')
  async updateUser(
    @Param('id') id: string,
    @Body() user: UserDto,
  ): Promise<void> {
    return await this.userService.updateUser({ ...user, id });
  }
}
