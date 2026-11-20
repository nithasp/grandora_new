import { Module } from '@nestjs/common';
import { UsersModule } from '../users/users.module';
import { WalletModule } from '../wallet/wallet.module';
import { StoreRepository } from './store.repository';
import { StoreResolver } from './store.resolver';
import { StoreService } from './store.service';

@Module({
  imports: [UsersModule, WalletModule],
  providers: [StoreRepository, StoreService, StoreResolver],
})
export class StoreModule {}
