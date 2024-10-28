import { AccessTokenPayloadData } from "@/auth/dto";
import { Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { Account } from "src/entity";
import { AccountRepository } from "src/repository";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private accountRepo: AccountRepository,
    configService: ConfigService
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>("JWT_SIGNIN_SECRET")
    });
  }

  async validate(payload: AccessTokenPayloadData): Promise<Partial<Account>> {
    if (payload.sub) {
      const account = await this.accountRepo.findOne({
        where: { id: payload.sub }
      });
      if (account) return account;
    }
    throw new UnauthorizedException();
  }
}
