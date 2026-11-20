import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import { Logger } from 'nestjs-pino';
import { AppModule } from './app.module';
import { config } from './config/config';

async function bootstrap(): Promise<void> {
  // rawBody keeps the exact bytes Omise signed, which the webhook signature is checked against
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    bufferLogs: true,
    rawBody: true,
  });
  const logger = app.get(Logger);
  app.useLogger(logger);

  app.set('trust proxy', config.trustProxy);
  app.set('etag', false);
  app.disable('x-powered-by');

  app.use(
    helmet({
      contentSecurityPolicy: config.graphql.sandbox ? false : undefined,
      crossOriginEmbedderPolicy: false,
      crossOriginResourcePolicy: { policy: 'cross-origin' },
    }),
  );
  app.use(cookieParser());
  app.useBodyParser('json', { limit: config.jsonBodyLimit });
  app.enableCors({ origin: config.allowedOrigins, credentials: true });

  if (config.storage.driver === 'local') {
    app.useStaticAssets(config.storage.localDir, { prefix: '/uploads/', maxAge: '7d', index: false });
  }

  app.enableShutdownHooks();
  await app.listen(config.port);
  logger.log(
    {
      port: config.port,
      graphql: config.graphql.path,
      storage: config.storage.driver,
      omise: config.omise.enabled ? (config.omise.testMode ? 'test' : 'live') : 'off',
    },
    'server listening',
    'Bootstrap',
  );
}

void bootstrap();
