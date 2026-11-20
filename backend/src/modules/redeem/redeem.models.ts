import { Field, Int, ObjectType } from '@nestjs/graphql';
import { BalancesModel } from '../wallet/wallet.models';

@ObjectType('RedeemResult')
export class RedeemResultModel {
  @Field(() => String)
  code: string;

  @Field(() => String)
  currency: string;

  @Field(() => Int)
  amount: number;

  @Field(() => String)
  message: string;

  @Field(() => BalancesModel)
  balances: BalancesModel;
}
