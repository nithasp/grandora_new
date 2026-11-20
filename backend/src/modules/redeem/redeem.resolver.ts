import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { Throttle } from '@nestjs/throttler';
import { CurrentUserId } from '../../common/http';
import { config } from '../../config/config';
import { RedeemResultModel } from './redeem.models';
import { RedeemService } from './redeem.service';

@Resolver()
export class RedeemResolver {
  constructor(private readonly redeem: RedeemService) {}

  @Throttle({ default: { limit: config.rateLimit.auth, ttl: config.rateLimit.windowMs } })
  @Mutation(() => RedeemResultModel, { name: 'RedeemCode' })
  redeemCode(
    @CurrentUserId() userId: number,
    @Args('code', { type: () => String }) code: string,
  ): Promise<RedeemResultModel> {
    return this.redeem.redeem(userId, code);
  }
}
