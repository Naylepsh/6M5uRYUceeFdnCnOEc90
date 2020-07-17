import { Module } from '@nestjs/common';
import { AuthService } from './services/auth.service';
import { UsersModule } from './../users/users.module';
import { UtilsModule } from './../utils/utils.module';

@Module({
  controllers: [],
  imports: [UsersModule, UtilsModule],
  providers: [AuthService],
})
export class AuthModule {}
