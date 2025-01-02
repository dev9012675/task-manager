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
      text: `Hello ${userData.firstName}. Here is your Payment Link: ${paymentLink}`,
      subject: `Payment`,
      html: `
      <html>
        <head>
          <style>
            body {
              font-family: Arial, sans-serif;
              background-color: #f4f7fc;
              margin: 0;
              padding: 0;
              color: #333;
            }
            .container {
              width: 100%;
              max-width: 600px;
              margin: 20px auto;
              background-color: #ffffff;
              padding: 20px;
              border-radius: 8px;
              box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
            }
            .header {
              text-align: center;
              padding-bottom: 20px;
              border-bottom: 2px solid #eee;
            }
            .content {
              padding: 20px 0;
              text-align: center;
            }
            .verification-code {
              display: inline-block;
              font-size: 24px;
              font-weight: bold;
              color: #4CAF50;
              background-color: #f0f9f4;
              padding: 10px 20px;
              border-radius: 5px;
            }
            .footer {
              text-align: center;
              font-size: 12px;
              color: #777;
              margin-top: 30px;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h2>Email Verification</h2>
            </div>
            <div class="content">
              <p>Hello ${userData.firstName},</p>
              <p>Use the below link to complete your payment:</p>
              <div class="verification-code">
                ${paymentLink}
              </div>
            </div>
            <div class="footer">
              <p>Thank you for using our service!</p>
              <p>Best regards, The Task Manager Team</p>
            </div>
          </div>
        </body>
      </html>
    `,
    });
    return {
      message: 'Payment Intent created successfully',
      data: {
        paymentIntent: paymentIntent,
        paymentLink: paymentLink,
      },
    };
  }

  async createPaymentLink(userId: string, client_secret: string) {
    const paymentLink = `https://internship-stripe-frontend.vercel.app/?userid=${userId}&client_secret=${client_secret}`;
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
