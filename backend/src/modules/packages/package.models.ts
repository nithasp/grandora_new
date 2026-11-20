import { Field, Float, Int, ObjectType } from '@nestjs/graphql';

@ObjectType('PackageItem')
export class PackageItemModel {
  @Field(() => Int)
  id: number;

  @Field(() => String)
  code: string;

  @Field(() => String)
  name: string;

  @Field(() => String)
  description: string;

  @Field(() => Float, { description: 'Price in baht' })
  price: number;

  @Field(() => Int, { description: 'Price in satang (1 baht = 100 satang); what Omise charges' })
  priceSatang: number;

  @Field(() => Int, {
    nullable: true,
    description: 'Price in MYGG Coins (1 MYGG = 1 baht); null when coins cannot buy it',
  })
  priceCoins: number | null;

  @Field(() => String)
  currency: string;

  @Field(() => String, { description: '"coins" tops up MYGG Coins, "grando" buys Grando' })
  kind: string;

  @Field(() => String)
  grantCurrency: string;

  @Field(() => Int)
  grantAmount: number;

  @Field(() => Int)
  bonusTickets: number;

  @Field(() => String, { nullable: true })
  image: string | null;

  @Field(() => String, { nullable: true })
  badge: string | null;

  @Field(() => Int, { nullable: true })
  savePercent: number | null;

  @Field(() => String)
  theme: string;

  @Field(() => String)
  game: string;

  @Field(() => Boolean)
  featured: boolean;
}

@ObjectType('PackageItemsResponse')
export class PackageItemsResponseModel {
  @Field(() => Boolean)
  ok: boolean;

  @Field(() => String)
  message: string;

  @Field(() => [PackageItemModel])
  data: PackageItemModel[];
}
