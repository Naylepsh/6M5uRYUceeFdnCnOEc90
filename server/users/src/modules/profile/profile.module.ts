import { Module } from '@nestjs/common';
import { ProfileController } from './ui/profile.controller';
import { ProfileService } from './application/services/profile.service';
import { ProfileRepository } from './infrastructure/profile.repository';
import { JwtStrategy } from '../../building-blocks/modules/auth/application/strategies/jwt.strategy';

@Module({
  controllers: [ProfileController],
  providers: [ProfileService, ProfileRepository, JwtStrategy],
})
export class ProfileModule {}
