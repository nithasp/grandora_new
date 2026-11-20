import { Field, Int, ObjectType } from '@nestjs/graphql';
import { BalancesModel } from '../wallet/wallet.models';

@ObjectType('StoreItem')
export class StoreItemModel {
  @Field(() => Int)
  id: number;

  @Field(() => String)
  code: string;

  @Field(() => String)
  name: string;

  @Field(() => String)
  description: string;

  @Field(() => String, { description: 'avatars, accessories or equipments' })
  category: string;

  @Field(() => String)
  image: string;

  @Field(() => Int, { nullable: true })
  priceGrando: number | null;

  @Field(() => Int, { nullable: true })
  priceMygg: number | null;

  @Field(() => Boolean)
  promoted: boolean;

  @Field(() => Boolean)
  owned: boolean;
}

@ObjectType('StorePurchaseResult')
export class StorePurchaseResultModel {
  @Field(() => StoreItemModel)
  item: StoreItemModel;

  @Field(() => String)
  paidCurrency: string;

  @Field(() => Int)
  paidAmount: number;

  @Field(() => BalancesModel)
  balances: BalancesModel;
}
