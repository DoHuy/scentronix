import { AUTH_ERROR_MESSAGE } from "@/common";
import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException
} from "@nestjs/common";

@Injectable()
export class ApiKeyGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    const apiKey = request.headers["x-api-key"];

    if (!apiKey) {
      throw new UnauthorizedException(AUTH_ERROR_MESSAGE.API_KEY_MISSING);
    }
    if (apiKey !== process.env.API_KEY) {
      throw new UnauthorizedException(AUTH_ERROR_MESSAGE.API_KEY_INVALID);
    }

    return true;
  }
}
