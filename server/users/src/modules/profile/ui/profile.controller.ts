import { Controller, Request, UseGuards, Get } from '@nestjs/common';
import { ProfileService } from './../application/services/profile.service';
import { ProfileDto } from '../application/dtos/profile.dto';
import { JwtAuthGuard } from '../../../building-blocks/modules/auth/guards/jwt-auth.guard';

@Controller()
export class AuthController {
  constructor(private readonly profileService: ProfileService) {}

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  async getProfile(@Request() req: any): Promise<ProfileDto> {
    const profile = await this.profileService.findById(req.user);
    return profile;
  }
}
