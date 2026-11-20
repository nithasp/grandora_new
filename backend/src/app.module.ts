import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { APP_FILTER, APP_GUARD } from '@nestjs/core';
import { GraphQLModule } from '@nestjs/graphql';
import { ThrottlerModule } from '@nestjs/throttler';
import { randomUUID } from 'crypto';
import { Request, Response } from 'express';
import { LoggerModule } from 'nestjs-pino';
import path from 'path';
import { AllExceptionsFilter } from './common/all-exceptions.filter';
import { AppThrottlerGuard, AuthGuard } from './common/guards';
import { config } from './config/config';
import { DatabaseModule } from './database/database.module';
import { AuthModule } from './modules/auth/auth.module';
import { BetaModule } from './modules/beta/beta.module';
import { HealthController } from './modules/health/health.controller';
import { PackagesModule } from './modules/packages/packages.module';
import { PaymentsModule } from './modules/payments/payments.module';
import { RedeemModule } from './modules/redeem/redeem.module';
import { StorageModule } from './modules/storage/storage.module';
import { StoreModule } from './modules/store/store.module';
import { UsersModule } from './modules/users/users.module';
import { WalletModule } from './modules/wallet/wallet.module';

const MAX_REQUEST_ID_LENGTH = 64;

@Module({
  imports: [
    LoggerModule.forRoot({
      pinoHttp: {
        level: config.logLevel,
        base: null,
        redact: {
          paths: ['req.headers.authorization', 'req.headers.cookie', 'res.headers["set-cookie"]'],
          remove: true,
        },
        genReqId: (req, res) => {
          const forwarded = req.headers['x-request-id'];
          const id =
            typeof forwarded === 'string' && forwarded.length > 0 && forwarded.length <= MAX_REQUEST_ID_LENGTH
              ? forwarded
              : randomUUID();
          res.setHeader('X-Request-Id', id);
          return id;
        },
        customLogLevel: (_req, res, err) =>
          err || res.statusCode >= 500 ? 'error' : res.statusCode >= 400 ? 'warn' : 'info',
        autoLogging: { ignore: (req) => req.url === '/healthz' },
        ...(config.prettyLogs
          ? {
              transport: {
                target: 'pino-pretty',
                options: { translateTime: 'HH:MM:ss', ignore: 'pid,hostname', singleLine: true },
              },
            }
          : {}),
      },
    }),
    ThrottlerModule.forRoot({
      throttlers: [{ name: 'default', ttl: config.rateLimit.windowMs, limit: config.rateLimit.api }],
      skipIf: () => config.isTest,
    }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      path: config.graphql.path,
      autoSchemaFile: config.isProduction ? true : path.join(process.cwd(), 'schema.gql'),
      sortSchema: true,
      playground: false,
      introspection: config.graphql.sandbox,
      plugins: config.graphql.sandbox ? [ApolloServerPluginLandingPageLocalDefault({ embed: true })] : [],
      includeStacktraceInErrorResponses: false,
      context: ({ req, res }: { req: Request; res: Response }) => ({ req, res }),
    }),
    DatabaseModule,
    StorageModule,
    UsersModule,
    WalletModule,
    AuthModule,
    PackagesModule,
    PaymentsModule,
    StoreModule,
    RedeemModule,
    BetaModule,
  ],
  controllers: [HealthController],
  providers: [
    { provide: APP_GUARD, useClass: AppThrottlerGuard },
    { provide: APP_GUARD, useClass: AuthGuard },
    { provide: APP_FILTER, useClass: AllExceptionsFilter },
  ],
})
export class AppModule {}
