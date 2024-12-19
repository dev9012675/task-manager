import {
  PipeTransform,
  Injectable,
  BadRequestException,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class ValidateEmailPipe implements PipeTransform {
  private readonly apiKey = process.env.ZB_API_KEY; // Replace with your API key
  private readonly baseUrl = 'https://api.zerobounce.net/v2';

  async transform(value: any) {
    if (!value.email) {
      throw new BadRequestException('Email is required');
    }
    console.log(value.email, 'email');

    const isValid = await this.validateEmail(value.email);

    if (!isValid) {
      throw new BadRequestException('Invalid email address');
    }

    return value; // Proceed with the validated value
  }

  private async validateEmail(email: string): Promise<boolean> {
    try {
      const response = await axios.get(`${this.baseUrl}/validate`, {
        params: {
          api_key: this.apiKey,
          email,
        },
      });

      // ZeroBounce returns `valid` status for valid emails
      return response.data.status === 'valid';
    } catch (error) {
      throw new HttpException(
        `Error validating email: ${error.response?.data?.message || error.message}`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
