import { Field, InputType, Int, ObjectType } from '@nestjs/graphql';

@ObjectType('Profile')
export class ProfileModel {
  @Field(() => Int)
  id: number;

  @Field(() => String)
  email: string;

  @Field(() => String, { description: 'Display name: first and last name, else the username' })
  name: string;

  @Field(() => String, { nullable: true })
  username: string | null;

  @Field(() => String, { nullable: true })
  firstName: string | null;

  @Field(() => String, { nullable: true })
  lastName: string | null;

  @Field(() => String, { nullable: true })
  description: string | null;

  @Field(() => String, { nullable: true })
  country: string | null;

  @Field(() => String, { nullable: true })
  city: string | null;

  @Field(() => String, { nullable: true })
  gender: string | null;

  @Field(() => String, { nullable: true, description: 'YYYY-MM-DD' })
  dateOfBirth: string | null;

  @Field(() => Int, { nullable: true })
  age: number | null;

  @Field(() => Int)
  exp: number;

  @Field(() => String, { nullable: true })
  avatarUrl: string | null;

  @Field(() => String, { nullable: true })
  coverUrl: string | null;

  @Field(() => String, { nullable: true })
  facebook: string | null;

  @Field(() => String, { nullable: true })
  twitter: string | null;

  @Field(() => String, { nullable: true })
  instagram: string | null;

  @Field(() => Boolean)
  isDemo: boolean;

  @Field(() => Boolean)
  isFrozen: boolean;

  @Field(() => String)
  createdAt: string;
}

@InputType('ProfileInput')
export class ProfileInput {
  @Field(() => String, { nullable: true })
  username?: string | null;

  @Field(() => String, { nullable: true })
  firstName?: string | null;

  @Field(() => String, { nullable: true })
  lastName?: string | null;

  @Field(() => String, { nullable: true })
  description?: string | null;

  @Field(() => String, { nullable: true })
  country?: string | null;

  @Field(() => String, { nullable: true })
  city?: string | null;

  @Field(() => String, { nullable: true })
  gender?: string | null;

  @Field(() => String, { nullable: true, description: 'YYYY-MM-DD' })
  dateOfBirth?: string | null;

  @Field(() => String, { nullable: true })
  facebook?: string | null;

  @Field(() => String, { nullable: true })
  twitter?: string | null;

  @Field(() => String, { nullable: true })
  instagram?: string | null;
}
