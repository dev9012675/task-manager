import { Injectable, Inject, UnauthorizedException } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import refreshJwtConfig from './config/refresh-jwt.config';
import { Payload } from './types/auth.types';
import * as argon2 from 'argon2';
import { ConfigType } from '@nestjs/config';
import { LoginDTO } from './dtos/login.dto';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    @Inject(refreshJwtConfig.KEY)
    private refreshTokenConfig: ConfigType<typeof refreshJwtConfig>,
  ) {}

  async login(
    loginDto: LoginDTO,
  ): Promise<{ id: string; accessToken: string; refreshToken: string }> {
    const user = await this.usersService.findOne({ email: loginDto.email });
    const passwordMatched = await bcrypt.compare(
      loginDto.password,
      user.password,
    );
    if (passwordMatched) {
      delete user.password;

      const payload: Payload = {
        email: user.email,
        userId: user._id.toString(),
        role: user.role,
      };
      const { accessToken, refreshToken } = await this.generateTokens(payload);
      const hashedRefreshToken = await argon2.hash(refreshToken);
      await this.usersService.updateHashedRefreshToken(
        user._id.toString(),
        hashedRefreshToken,
      );

      return {
        id: user._id.toString(),
        accessToken: accessToken,
        refreshToken: refreshToken,
      };
    } else {
      throw new UnauthorizedException(`Password does not match`);
    }
  }

  async generateTokens(payload: Payload) {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload),
      this.jwtService.signAsync(payload, this.refreshTokenConfig),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }

  async refreshToken(id: string) {
    const user = await this.usersService.findById(id);
    const payload: Payload = {
      email: user.email,
      userId: user._id.toString(),
      role: user.role,
    };
    const { accessToken, refreshToken } = await this.generateTokens(payload);
    const hashedRefreshToken = await argon2.hash(refreshToken);
    await this.usersService.updateHashedRefreshToken(
      user._id.toString(),
      hashedRefreshToken,
    );

    return {
      id: user._id.toString(),
      accessToken: accessToken,
      refreshToken: refreshToken,
    };
  }

  async validateRefreshToken(userId: string, refreshToken: string) {
    const user = await this.usersService.findById(userId);
    if (!user || !user.hashedRefreshToken) {
      throw new UnauthorizedException(`Invalid Refresh Token`);
    }

    const refreshTokenMatches = await argon2.verify(
      user.hashedRefreshToken,
      refreshToken,
    );

    if (!refreshTokenMatches) {
      throw new UnauthorizedException(`Invalid Refresh Token`);
    }

    return { userId: user._id.toString(), email: user.email, role: user.role };
  }

  async signout(id: string) {
    await this.usersService.updateHashedRefreshToken(id, null);
    return {
      message: `You have signed out`,
    };
  }
}
