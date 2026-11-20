import { Controller, Get, HttpCode, Post, Req, Res } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { Request, Response } from 'express';
import { ApiEnvelope, CurrentUserId, envelope, Public } from '../../common/http';
import { API_PREFIX, config } from '../../config/config';
import { ProfileModel } from '../users/user.models';
import { toProfile, UsersService } from '../users/users.service';
import { LoginResultModel } from './auth.models';
import { AuthService } from './auth.service';
import { clearRefreshCookie, readRefreshCookie, setRefreshCookie } from './refresh-cookie';
import { Session } from './token.service';

const AUTH_LIMIT = { default: { limit: config.rateLimit.auth, ttl: config.rateLimit.windowMs } };
const DEMO_LIMIT = { default: { limit: config.rateLimit.demo, ttl: config.rateLimit.windowMs } };

const toLoginResult = (session: Session): LoginResultModel => ({
  token: session.accessToken,
  profile: toProfile(session.user),
});

@Controller(`${API_PREFIX}/auth`)
export class AuthController {
  constructor(
    private readonly auth: AuthService,
    private readonly users: UsersService,
  ) {}

  @Public()
  @Throttle(DEMO_LIMIT)
  @Post('demo')
  @HttpCode(200)
  async demo(@Res({ passthrough: true }) res: Response): Promise<ApiEnvelope<LoginResultModel>> {
    const session = await this.auth.demo();
    setRefreshCookie(res, session.refreshToken);
    return envelope(toLoginResult(session), 'Signed in to the demo account.');
  }

  @Public()
  @Throttle(AUTH_LIMIT)
  @Post('refresh')
  @HttpCode(200)
  async refresh(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ): Promise<ApiEnvelope<LoginResultModel>> {
    const session = await this.auth.refresh(readRefreshCookie(req));
    setRefreshCookie(res, session.refreshToken);
    return envelope(toLoginResult(session), 'Token refreshed successfully.');
  }

  @Public()
  @Post('logout')
  @HttpCode(200)
  async logout(@Req() req: Request, @Res({ passthrough: true }) res: Response): Promise<ApiEnvelope<null>> {
    await this.auth.logout(readRefreshCookie(req));
    clearRefreshCookie(res);
    return envelope(null, 'Logged out successfully.');
  }

  @Get('me')
  async me(@CurrentUserId() userId: number): Promise<ApiEnvelope<ProfileModel>> {
    return envelope(await this.users.getProfile(userId), 'User fetched successfully.');
  }
}
