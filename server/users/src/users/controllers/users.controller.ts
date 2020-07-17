import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  Put,
  Delete,
} from '@nestjs/common';
import { UsersService } from '../services/users.service';
import { UserDto } from '../dtos/user.dto';
import { NotFoundException } from './../../exceptions/not-found.exception';

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
    const user = await this.userService.findById(id);
    if (!user) {
      throw new NotFoundException();
    }
    return user;
  }

  @Put(':id')
  async updateUser(
    @Param('id') id: string,
    @Body() user: UserDto,
  ): Promise<void> {
    return await this.userService.updateUser({ ...user, id });
  }

  @Delete(':id')
  async deleteUser(@Param('id') id: string): Promise<void> {
    return await this.userService.deleteUser(id);
  }
}
