import { Controller, Post, UseGuards, RawBodyRequest } from '@nestjs/common';
import { JwtAuthGuard } from 'src/common/guards/jwt.guard';
import { StripeService } from './stripe.service';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { Payload } from '../auth/types/auth.types';
import { IResponse } from 'src/common/interfaces/response.interface';
import { Req } from '@nestjs/common';
import { Request } from 'express';

@Controller('api')
export class StripeController {
  constructor(private readonly stripeService: StripeService) {}
  @Post(`payment/payment-intent`)
  @UseGuards(JwtAuthGuard)
  async createPaymentIntent(@CurrentUser() user: Payload): Promise<IResponse> {
    return await this.stripeService.createPaymentIntent(user);
  }

  @Post(`stripe/webhook`)
  async handleWebhook(@Req() req: RawBodyRequest<Request>) {
    return this.stripeService.handleWebHook(req);
  }
}
