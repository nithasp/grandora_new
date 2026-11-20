import { Module } from '@nestjs/common';
import { UsersModule } from '../users/users.module';
import { WalletRepository } from './wallet.repository';
import { WalletResolver } from './wallet.resolver';
import { WalletService } from './wallet.service';

@Module({
  imports: [UsersModule],
  providers: [WalletRepository, WalletService, WalletResolver],
  exports: [WalletService],
})
export class WalletModule {}
