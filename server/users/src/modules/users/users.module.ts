import { Module } from '@nestjs/common';
import { UsersController } from './ui/users.controller';
import { UsersService } from './application/services/users.service';
import { UserRepository } from './infrastructure/user.repository';
import { HashingService } from '../../utils/hashing.service';

@Module({
  controllers: [UsersController],
  providers: [UsersService, HashingService, UserRepository],
  exports: [UsersService],
})
export class UsersModule {}
