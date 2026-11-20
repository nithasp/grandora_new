import { Module } from '@nestjs/common';
import { UsersModule } from '../users/users.module';
import { WalletModule } from '../wallet/wallet.module';
import { RedeemResolver } from './redeem.resolver';
import { RedeemService } from './redeem.service';

@Module({
  imports: [UsersModule, WalletModule],
  providers: [RedeemService, RedeemResolver],
})
export class RedeemModule {}
