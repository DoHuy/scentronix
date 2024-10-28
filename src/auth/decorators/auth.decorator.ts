import {
  applyDecorators,
  createParamDecorator,
  ExecutionContext,
  UseGuards
} from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { AccessTokenPayloadData } from "../dto";

export function Authenticated(): any {
  return applyDecorators(UseGuards(AuthGuard("jwt")));
}

export const CurrentUser = createParamDecorator((ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest<{
    account: AccessTokenPayloadData
  }>();
  return request.account;
});
