import { Module } from '@nestjs/common';
import { UsersModule } from '../users/users.module';
import { WalletModule } from '../wallet/wallet.module';
import { AuthController } from './auth.controller';
import { AuthResolver } from './auth.resolver';
import { AuthService } from './auth.service';
import { RefreshTokenRepository } from './refresh-token.repository';
import { TokenService } from './token.service';

@Module({
  imports: [UsersModule, WalletModule],
  controllers: [AuthController],
  providers: [RefreshTokenRepository, TokenService, AuthService, AuthResolver],
})
export class AuthModule {}
