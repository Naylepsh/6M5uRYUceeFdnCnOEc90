import { Module } from '@nestjs/common';
import { UsersController } from './ui/users.controller';
import { UsersService } from './application/services/users.service';
import { UserRepository } from './infrastructure/user.repository';

@Module({
  controllers: [UsersController],
  providers: [UsersService, UserRepository],
  exports: [UsersService],
})
export class UsersModule {}
