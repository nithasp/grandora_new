import { Module } from '@nestjs/common';
import { PackagesModule } from '../packages/packages.module';
import { UsersModule } from '../users/users.module';
import { WalletModule } from '../wallet/wallet.module';
import { OmiseClient } from './omise.client';
import { OrdersRepository } from './orders.repository';
import { PaymentsController } from './payments.controller';
import { PaymentsResolver } from './payments.resolver';
import { PaymentsService } from './payments.service';

@Module({
  imports: [PackagesModule, UsersModule, WalletModule],
  controllers: [PaymentsController],
  providers: [OmiseClient, OrdersRepository, PaymentsService, PaymentsResolver],
})
export class PaymentsModule {}
