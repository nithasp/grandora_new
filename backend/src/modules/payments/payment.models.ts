import { Field, Float, ID, InputType, Int, ObjectType } from '@nestjs/graphql';

@ObjectType('PaymentMethod')
export class PaymentMethodModel {
  @Field(() => String, { description: 'mygg_coins, or an Omise type such as card or promptpay' })
  type: string;

  @Field(() => String)
  label: string;

  @Field(() => String, { description: 'coins, card, qr, wallet or banking' })
  group: string;

  @Field(() => Boolean, { description: 'True when the payment goes through Omise' })
  online: boolean;

  @Field(() => Boolean)
  mobileOnly: boolean;

  @Field(() => Boolean)
  requiresPhone: boolean;

  @Field(() => Int, { nullable: true })
  maxAmountSatang: number | null;
}

@ObjectType('PaymentConfig')
export class PaymentConfigModel {
  @Field(() => Boolean, { description: 'False until Omise keys are set; MYGG Coins still work' })
  enabled: boolean;

  @Field(() => Boolean)
  testMode: boolean;

  @Field(() => String, { nullable: true, description: 'Omise public key for Omise.js card tokens' })
  publicKey: string | null;

  @Field(() => String)
  currency: string;

  @Field(() => Int)
  minAmountSatang: number;

  @Field(() => [PaymentMethodModel])
  methods: PaymentMethodModel[];
}

@ObjectType('Order')
export class OrderModel {
  @Field(() => ID)
  id: string;

  @Field(() => String, { description: 'pending, paid, failed, expired, refunded or disputed' })
  status: string;

  @Field(() => String)
  method: string;

  @Field(() => Int)
  packageId: number;

  @Field(() => String)
  packageName: string;

  @Field(() => Int)
  amountSatang: number;

  @Field(() => Float, { description: 'Amount charged in baht' })
  amount: number;

  @Field(() => Int, { description: 'MYGG Coins spent (coin payments only)' })
  amountCoins: number;

  @Field(() => String)
  currency: string;

  @Field(() => String)
  grantCurrency: string;

  @Field(() => Int)
  grantAmount: number;

  @Field(() => Int)
  bonusTickets: number;

  @Field(() => String, { nullable: true })
  authorizeUri: string | null;

  @Field(() => String, { nullable: true })
  qrCodeUri: string | null;

  @Field(() => String, { nullable: true })
  failureCode: string | null;

  @Field(() => String, { nullable: true })
  failureMessage: string | null;

  @Field(() => String, { nullable: true })
  expiresAt: string | null;

  @Field(() => String, { nullable: true })
  paidAt: string | null;

  @Field(() => String)
  createdAt: string;
}

@ObjectType('CheckoutResult')
export class CheckoutResultModel {
  @Field(() => OrderModel)
  order: OrderModel;

  @Field(() => String, {
    description: 'none (finished), redirect (open authorizeUri), qr (show qrCodeUri) or wait (poll Order)',
  })
  nextAction: string;

  @Field(() => String, { nullable: true })
  authorizeUri: string | null;

  @Field(() => String, { nullable: true })
  qrCodeUri: string | null;
}

@InputType('CheckoutInput')
export class CheckoutInput {
  @Field(() => Int)
  packageId: number;

  @Field(() => String, { description: 'mygg_coins, card, promptpay, truemoney_jumpapp, ...' })
  method: string;

  @Field(() => String, { nullable: true, description: 'Omise.js card token (tokn_...) for card payments' })
  cardToken?: string | null;

  @Field(() => String, { nullable: true, description: 'Wallet phone number for the truemoney (OTP) method' })
  phoneNumber?: string | null;
}
