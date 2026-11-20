import { Module } from '@nestjs/common';
import { ProfileController } from './profile.controller';
import { ProfileResolver } from './profile.resolver';
import { UsersRepository } from './users.repository';
import { UsersService } from './users.service';

@Module({
  controllers: [ProfileController],
  providers: [UsersRepository, UsersService, ProfileResolver],
  exports: [UsersRepository, UsersService],
})
export class UsersModule {}
