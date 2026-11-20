import { Field, ObjectType } from '@nestjs/graphql';
import { ProfileModel } from '../users/user.models';

@ObjectType('LoginResult')
export class LoginResultModel {
  @Field(() => String, { description: 'JWT access token; send it in the Authorization header' })
  token: string;

  @Field(() => ProfileModel)
  profile: ProfileModel;
}

@ObjectType('RegisterResult')
export class RegisterResultModel {
  @Field(() => String)
  message: string;

  @Field(() => Boolean)
  success: boolean;
}
