import { Module } from '@nestjs/common';
import { BetaResolver, BetaService } from './beta.resolver';

@Module({
  providers: [BetaService, BetaResolver],
})
export class BetaModule {}
