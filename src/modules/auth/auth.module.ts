import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from 'src/modules/users/users.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import jwtConfig from '../../common/config/jwt.config';
import refreshJwtConfig from './config/refresh-jwt.config';
import { JWTStrategy } from 'src/common/strategies/jwt.strategy';
import { RefreshJWTStrategy } from './strategies/refresh.strategy';

@Module({
  imports: [
    UsersModule,
    PassportModule,
    JwtModule.registerAsync(jwtConfig.asProvider()),
    ConfigModule.forFeature(jwtConfig),
    ConfigModule.forFeature(refreshJwtConfig),
  ],
  providers: [AuthService, JWTStrategy, RefreshJWTStrategy],
  controllers: [AuthController],
})
export class AuthModule {}
