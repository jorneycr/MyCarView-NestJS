import { CurrrentUser } from './../users/decorators/current-user.decorator';
import { CanActivate, ExecutionContext } from '@nestjs/common';

export class AdminGuard implements CanActivate {
    canActivate(context: ExecutionContext) {
        const request = context.switchToHttp().getRequest();

        if (!request.currrentUser) return false;

        return request.currrentUser.admin;
    }

}