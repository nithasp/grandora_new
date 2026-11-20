import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CurrentUserId } from '../../common/http';
import { ProfileInput, ProfileModel } from './user.models';
import { UsersService } from './users.service';

@Resolver(() => ProfileModel)
export class ProfileResolver {
  constructor(private readonly users: UsersService) {}

  @Query(() => ProfileModel, { name: 'MyProfile' })
  myProfile(@CurrentUserId() userId: number): Promise<ProfileModel> {
    return this.users.getProfile(userId);
  }

  @Mutation(() => ProfileModel, { name: 'UpdateProfile' })
  updateProfile(
    @CurrentUserId() userId: number,
    @Args('input', { type: () => ProfileInput }) input: ProfileInput,
  ): Promise<ProfileModel> {
    return this.users.updateProfile(userId, { ...input });
  }
}
