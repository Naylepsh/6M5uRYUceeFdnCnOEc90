import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './application/services/auth.service';
import { LocalStrategy } from './application/strategies/local.strategy';
import { AuthController } from './ui/controllers/auth.controllers';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './application/strategies/jwt.strategy';
import { UserRepository } from './infrastructure/repositories/user.repository';
import { jwtSecret } from './shared/auth.constants';

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: jwtSecret,
      signOptions: {
        expiresIn: '2 days',
      },
    }),
  ],
  controllers: [AuthController],
  providers: [UserRepository, AuthService, LocalStrategy, JwtStrategy],
})
export class AuthModule {}
