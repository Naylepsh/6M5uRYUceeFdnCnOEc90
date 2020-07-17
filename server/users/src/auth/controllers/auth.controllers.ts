import { Controller, Request, Post, UseGuards, Get } from '@nestjs/common';
import { LocalAuthGuard } from '../guards/local-auth.guard';
import { AuthService } from '../services/auth.service';
import { AccessTokenDto } from '../dtos/token.auth.dto';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';

/*
 * === HOW GUARDS WORK ===
 * Let's take login route as an example.
 * LocalAuthGuard is just an alias for AuthGuard('local').
 * When calling auth/login the specified strategy (here will be local) is invoked
 * and it's result is stored in req.user
 */
@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('auth/login')
  async login(@Request() req: any): Promise<AccessTokenDto> {
    return this.authService.login(req.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  async getProfile(@Request() req: any): Promise<string> {
    // TODO: call to user service to load user data (excluding password)
    return req.user;
  }
}
