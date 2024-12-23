import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UsersService } from 'src/modules/users/users.service';

@Injectable()
export class TrialGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private readonly usersService: UsersService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const { user } = context.switchToHttp().getRequest();
    const dbUser = await this.usersService.findById(user.userId);
    if (!dbUser) {
      return false;
    }
    if (dbUser.isTrialActive === false) {
      return true;
    }
    console.log(`Trial Guard`);
    console.log(dbUser.id);
    console.log(dbUser.trialExpiration);
    if (dbUser.trialExpiration < new Date()) {
      console.log(`Trial guard forbids access`);
      return false;
    }
    return true;
  }
}
