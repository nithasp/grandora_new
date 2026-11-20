import { Args, Int, Query, Resolver } from '@nestjs/graphql';
import { CurrentUserId } from '../../common/http';
import { toProfile, UsersService } from '../users/users.service';
import { PlayerModel, TransactionPageModel } from './wallet.models';
import { toBalancesModel, toInventory, WalletService } from './wallet.service';

@Resolver()
export class WalletResolver {
  constructor(
    private readonly users: UsersService,
    private readonly wallet: WalletService,
  ) {}

  @Query(() => PlayerModel, { name: 'GetSelf', description: 'The signed-in player with balances' })
  async getSelf(@CurrentUserId() userId: number): Promise<PlayerModel> {
    const [user, balances] = await Promise.all([
      this.users.requireUser(userId),
      this.wallet.balances(userId),
    ]);
    return {
      id: user.id,
      profile: toProfile(user),
      balances: toBalancesModel(balances),
      inventory: { currency: toInventory(balances) },
    };
  }

  @Query(() => TransactionPageModel, { name: 'Transactions' })
  transactions(
    @CurrentUserId() userId: number,
    @Args('type', { type: () => String, defaultValue: 'all' }) type: string,
    @Args('page', { type: () => Int, defaultValue: 1 }) page: number,
    @Args('pageSize', { type: () => Int, defaultValue: 12 }) pageSize: number,
  ): Promise<TransactionPageModel> {
    return this.wallet.transactions(userId, { type, page, pageSize });
  }
}
