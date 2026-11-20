import { Field, ID, Int, ObjectType } from '@nestjs/graphql';
import { ProfileModel } from '../users/user.models';

@ObjectType('PlayerItem')
export class PlayerItemModel {
  @Field(() => String, { description: 'MYGG, GRANDO or TICKET' })
  item_id: string;

  @Field(() => String)
  category: string;

  @Field(() => Int)
  amount: number;

  @Field(() => String, { description: 'Display name, e.g. "MYGG Coins"' })
  name: string;
}

@ObjectType('Inventory')
export class InventoryModel {
  @Field(() => [PlayerItemModel])
  currency: PlayerItemModel[];
}

@ObjectType('Balances')
export class BalancesModel {
  @Field(() => Int)
  myggCoins: number;

  @Field(() => Int)
  grando: number;

  @Field(() => Int)
  tickets: number;
}

@ObjectType('Player')
export class PlayerModel {
  @Field(() => Int)
  id: number;

  @Field(() => ProfileModel)
  profile: ProfileModel;

  @Field(() => BalancesModel)
  balances: BalancesModel;

  @Field(() => InventoryModel)
  inventory: InventoryModel;
}

@ObjectType('TransactionLine')
export class TransactionLineModel {
  @Field(() => String)
  currency: string;

  @Field(() => Int)
  amount: number;

  @Field(() => String)
  name: string;
}

@ObjectType('Transaction')
export class TransactionModel {
  @Field(() => ID)
  id: string;

  @Field(() => String, { description: 'topup, package, store_purchase, redeem, refund, chargeback or bonus' })
  type: string;

  @Field(() => String)
  title: string;

  @Field(() => String)
  description: string;

  @Field(() => String, { description: 'Main balance change, e.g. "+ 1,850 Grando"' })
  point: string;

  @Field(() => String, { description: 'What was paid, e.g. "(฿620.00)"; empty when nothing was paid' })
  currency: string;

  @Field(() => String, { description: 'Formatted in Asia/Bangkok time, e.g. "8:42 PM 24/01/2023"' })
  date: string;

  @Field(() => String)
  createdAt: string;

  @Field(() => [TransactionLineModel])
  lines: TransactionLineModel[];

  @Field(() => String, { nullable: true })
  orderId: string | null;

  @Field(() => String, { nullable: true })
  method: string | null;
}

@ObjectType('TransactionPage')
export class TransactionPageModel {
  @Field(() => [TransactionModel])
  items: TransactionModel[];

  @Field(() => Int)
  total: number;

  @Field(() => Int)
  page: number;

  @Field(() => Int)
  pageSize: number;
}
