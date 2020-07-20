import { Module } from '@nestjs/common';
import { UsersController } from './controllers/users.controller';
import { UsersService } from './services/users.service';
import { UserRepository } from './repository/user.repository';
import { HashingService } from '../../utils/hashing.service';

@Module({
  controllers: [UsersController],
  providers: [UsersService, HashingService, UserRepository],
  exports: [UsersService],
})
export class UsersModule {}
