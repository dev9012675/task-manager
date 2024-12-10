import { Inject, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PayloadType } from '../types/auth.types';
import * as dotenv from 'dotenv';
import refreshJwtConfig from '../config/refresh-jwt.config';
import { ConfigType } from '@nestjs/config';
import { Request } from 'express';
import { AuthService } from '../auth.service';
dotenv.config();

@Injectable()
export class RefreshJWTStrategy extends PassportStrategy(
  Strategy,
  `refresh-jwt`,
) {
  constructor(
    @Inject(refreshJwtConfig.KEY)
    private refreshJwtConfiguration: ConfigType<typeof refreshJwtConfig>,
    private authService: AuthService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        RefreshJWTStrategy.extractJWT,
        ExtractJwt.fromAuthHeaderAsBearerToken(),
      ]),
      ignoreExpiration: false,
      secretOrKey: refreshJwtConfiguration.secret,
      passReqToCallback: true,
    });
  }

  private static extractJWT(req: Request): string | null {
    if (
      req.cookies &&
      'refreshToken' in req.cookies &&
      req.cookies.refreshToken.length > 0
    ) {
      return req.cookies.refreshToken;
    }
    return null;
  }

  async validate(req: Request, payload: PayloadType) {
    const refreshToken = req.cookies[`refreshToken`].trim();
    const id = payload.userId;
    return await this.authService.validateRefreshToken(id, refreshToken);
  }
}
