import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './services/auth.service';
import { LocalStrategy } from './strategies/local.strategy';
import { AuthController } from './controllers/auth.controllers';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from './constants/constants';
import { JwtStrategy } from './strategies/jwt.strategy';
import { UserRepository } from './repositories/user.repository';

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: {
        expiresIn: '2 days',
      },
    }),
  ],
  controllers: [AuthController],
  providers: [UserRepository, AuthService, LocalStrategy, JwtStrategy],
})
export class AuthModule {}
