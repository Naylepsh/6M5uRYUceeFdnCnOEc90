import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './services/auth.service';
import { UsersModule } from './../users/users.module';
import { UtilsModule } from './../utils/utils.module';
import { LocalStrategy } from './strategies/local.strategy';

@Module({
  imports: [UsersModule, UtilsModule, PassportModule],
  providers: [AuthService, LocalStrategy],
})
export class AuthModule {}
