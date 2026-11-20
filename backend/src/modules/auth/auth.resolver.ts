import { Args, Context, Mutation, Resolver } from '@nestjs/graphql';
import { Throttle } from '@nestjs/throttler';
import { GqlContext, Public } from '../../common/http';
import { config } from '../../config/config';
import { toProfile } from '../users/users.service';
import { LoginResultModel, RegisterResultModel } from './auth.models';
import { AuthService } from './auth.service';
import { setRefreshCookie } from './refresh-cookie';

const AUTH_LIMIT = { default: { limit: config.rateLimit.auth, ttl: config.rateLimit.windowMs } };

@Resolver()
export class AuthResolver {
  constructor(private readonly auth: AuthService) {}

  @Public()
  @Throttle(AUTH_LIMIT)
  @Mutation(() => LoginResultModel, { name: 'LoginEmail' })
  async loginEmail(
    @Args('email', { type: () => String }) email: string,
    @Args('password', { type: () => String }) password: string,
    @Context() ctx: GqlContext,
  ): Promise<LoginResultModel> {
    const session = await this.auth.login({ email, password });
    setRefreshCookie(ctx.res, session.refreshToken);
    return { token: session.accessToken, profile: toProfile(session.user) };
  }

  @Public()
  @Throttle(AUTH_LIMIT)
  @Mutation(() => RegisterResultModel, { name: 'RegisterEmail' })
  registerEmail(
    @Args('email', { type: () => String }) email: string,
    @Args('password', { type: () => String }) password: string,
    @Args('gender', { type: () => String, nullable: true }) gender?: string | null,
    @Args('dateOfBirth', { type: () => String, nullable: true, description: 'YYYY-MM-DD' })
    dateOfBirth?: string | null,
  ): Promise<RegisterResultModel> {
    return this.auth.register({ email, password, gender, dateOfBirth });
  }
}
