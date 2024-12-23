import { Injectable, NotFoundException } from '@nestjs/common';
import { Payload } from '../auth/types/auth.types';
import Stripe from 'stripe';
import { ConfigService } from '@nestjs/config';
import { RawBodyRequest } from '@nestjs/common';
import { Request } from 'express';
import { UsersService } from '../users/users.service';
import { MailService } from '../mail/mail.service';

@Injectable()
export class StripeService {
  private stripe: Stripe;

  constructor(
    private readonly configService: ConfigService,
    private readonly usersService: UsersService,
    private readonly mailService: MailService,
  ) {
    const apiKey = this.configService.get<string>('STRIPE_KEY');

    if (!apiKey) {
      throw new Error('Stripe API key not found');
    }
    this.stripe = new Stripe(apiKey);
  }
  async createPaymentIntent(user: Payload) {
    const userData = await this.usersService.findById(user.userId);
    if (!userData) {
      throw new NotFoundException(`User not found`);
    }
    if (userData.isTrialActive === false) {
      return { message: `You have already paid the required amount` };
    }
    const amount = 10000;
    const paymentIntent = await this.stripe.paymentIntents.create({
      amount: amount,
      currency: 'usd',
      description: `Payment for user ID: ${user.userId}`,
      metadata: {
        userId: user.userId,
      },
    });
    const paymentLink = await this.createPaymentLink(
      userData._id.toString(),
      paymentIntent.client_secret,
    );
    await this.mailService.sendEmail({
      to: userData.email,
      text: `Hello ${paymentLink}`,
      subject: `Test`,
    });
    return {
      message: 'Payment Intent created successfully',
      data: paymentIntent,
    };
  }

  async createPaymentLink(userId: string, client_secret: string) {
    const paymentLink = `http://127.0.0.1:5500/src/payment.html?userid=${userId}&client_secret=${client_secret}`;
    return paymentLink;
  }

  async handleWebHook(req: RawBodyRequest<Request>) {
    let event;
    try {
      event = this.stripe.webhooks.constructEvent(
        req.rawBody,
        req.header('Stripe-Signature'),
        process.env.STRIPE_WEBHOOK_SECRET,
      );
    } catch (err) {
      console.log(err);
      console.log(`Webhook signature verification failed.`);

      throw err;
    }
    switch (event.type) {
      case 'payment_intent.succeeded': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        console.log(`userId in webhook:${paymentIntent.metadata.userId}`);
        const updatedUser = await this.usersService.removeTrial(
          paymentIntent.metadata.userId,
        );
        if (!updatedUser) {
          throw new Error(`There was some issue in updating your trial`);
        }
        break;
      }
      default:
        console.log(`Unhandled Event ${event.type}`);
    }

    return { message: 'Event received' };
  }
}
