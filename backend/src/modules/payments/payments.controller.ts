import { Body, Controller, Headers, HttpCode, Logger, Post, RawBodyRequest, Req } from '@nestjs/common';
import { SkipThrottle } from '@nestjs/throttler';
import { Request } from 'express';
import { z } from 'zod';
import { AppError } from '../../common/errors';
import { Public } from '../../common/http';
import { parse } from '../../common/validation';
import { API_PREFIX, config } from '../../config/config';
import { OmiseEvent } from './omise.client';
import { verifyOmiseSignature } from './omise-signature';
import { PaymentsService } from './payments.service';

const eventSchema = z.looseObject({
  object: z.literal('event'),
  id: z.string(),
  key: z.string(),
  data: z.looseObject({}),
});

@Controller(`${API_PREFIX}/payments/omise`)
export class PaymentsController {
  private readonly logger = new Logger(PaymentsController.name);

  constructor(private readonly payments: PaymentsService) {}

  /**
   * Omise posts every charge, refund and dispute event here. The event only says which charge to
   * look at: the charge itself is fetched again from Omise before any balance changes.
   */
  @Public()
  @SkipThrottle()
  @Post('webhook')
  @HttpCode(200)
  async webhook(
    @Req() req: RawBodyRequest<Request>,
    @Body() body: unknown,
    @Headers('omise-signature') signature?: string,
    @Headers('omise-signature-timestamp') timestamp?: string,
  ): Promise<{ received: boolean }> {
    const { webhookSecret } = config.omise;
    if (webhookSecret) {
      const valid =
        req.rawBody &&
        verifyOmiseSignature({ rawBody: req.rawBody, signature, timestamp, secret: webhookSecret });
      if (!valid) throw new AppError('Invalid webhook signature', 401, 'token_invalid');
    } else if (config.isProduction) {
      throw new AppError('OMISE_WEBHOOK_SECRET is not configured', 503, 'service_unavailable');
    }

    const event = parse(eventSchema, body) as OmiseEvent;
    this.logger.log({ eventId: event.id, key: event.key }, 'Omise webhook received');
    await this.payments.handleEvent(event);
    return { received: true };
  }
}
