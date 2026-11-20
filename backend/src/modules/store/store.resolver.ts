import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CurrentUserId } from '../../common/http';
import { StoreItemModel, StorePurchaseResultModel } from './store.models';
import { StoreService } from './store.service';

@Resolver()
export class StoreResolver {
  constructor(private readonly store: StoreService) {}

  @Query(() => [StoreItemModel], { name: 'StoreItems' })
  storeItems(
    @CurrentUserId() userId: number,
    @Args('category', { type: () => String, nullable: true }) category?: string | null,
  ): Promise<StoreItemModel[]> {
    return this.store.list(userId, category);
  }

  @Mutation(() => StorePurchaseResultModel, {
    name: 'BuyStoreItem',
    description: 'Pays with Grando or MYGG Coins; no payment gateway is involved',
  })
  buyStoreItem(
    @CurrentUserId() userId: number,
    @Args('itemId', { type: () => Int }) itemId: number,
    @Args('currency', { type: () => String, description: 'GRANDO or MYGG' }) currency: string,
  ): Promise<StorePurchaseResultModel> {
    return this.store.buy(userId, { itemId, currency });
  }
}
