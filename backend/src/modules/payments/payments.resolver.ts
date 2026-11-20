import { Args, ID, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Throttle } from '@nestjs/throttler';
import { AppError } from '../../common/errors';
import { CurrentUserId } from '../../common/http';
import { config } from '../../config/config';
import { CheckoutInput, CheckoutResultModel, OrderModel, PaymentConfigModel } from './payment.models';
import { PaymentsService } from './payments.service';

const CHECKOUT_LIMIT = { default: { limit: 60, ttl: config.rateLimit.windowMs } };

@Resolver()
export class PaymentsResolver {
  constructor(private readonly payments: PaymentsService) {}

  @Query(() => PaymentConfigModel, { name: 'PaymentConfig' })
  paymentConfig(): PaymentConfigModel {
    return this.payments.paymentConfig();
  }

  @Throttle(CHECKOUT_LIMIT)
  @Mutation(() => CheckoutResultModel, {
    name: 'Checkout',
    description: 'Buys a package. Send only the package id and the method; the server sets the price.',
  })
  checkout(
    @CurrentUserId() userId: number,
    @Args('input', { type: () => CheckoutInput }) input: CheckoutInput,
  ): Promise<CheckoutResultModel> {
    return this.payments.checkout(userId, { ...input });
  }

  @Query(() => OrderModel, { name: 'Order' })
  order(@CurrentUserId() userId: number, @Args('id', { type: () => ID }) id: string): Promise<OrderModel> {
    return this.payments.getOrder(userId, id);
  }

  @Query(() => [OrderModel], { name: 'MyOrders' })
  myOrders(@CurrentUserId() userId: number): Promise<OrderModel[]> {
    return this.payments.myOrders(userId);
  }

  @Mutation(() => OrderModel, { name: 'SimulatePayment', description: 'Omise test mode only' })
  simulatePayment(
    @CurrentUserId() userId: number,
    @Args('id', { type: () => ID }) id: string,
    @Args('result', { type: () => String, defaultValue: 'paid' }) result: string,
  ): Promise<OrderModel> {
    if (result !== 'paid' && result !== 'failed') {
      throw new AppError('result must be paid or failed', 400, 'invalid_request');
    }
    return this.payments.simulate(userId, id, result);
  }
}
