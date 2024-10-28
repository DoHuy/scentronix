import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { AccountRepository } from "src/repository";
import {
  AccessTokenPayloadData,
  ResetPasswordDto,
  ResetPasswordResp,
  SigninDto,
  SigninResp,
  SignupDto,
  SignupResp
} from "../dto";
import { AUTH_ERROR_MESSAGE, DAY, SYSTEM_ERROR_MESSAGE } from "@/common";
import * as bcrypt from "bcryptjs";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private accountRepository: AccountRepository,
    private configService: ConfigService
  ) {}

  async signin(signinDto: SigninDto): Promise<SigninResp> {
    const { email, password } = signinDto;

    try {
      const account = await this.accountRepository.findOne({
        where: { email }
      });

      if (!account) throw new Error(AUTH_ERROR_MESSAGE.INCORRECT_MISSING);

      // compare password
      const correct = await bcrypt.compare(password, account.password);

      if (!correct) throw new Error(AUTH_ERROR_MESSAGE.INCORRECT_MISSING);

      const payload: AccessTokenPayloadData = {
        email: account.email,
        sub: account.id
      };

      const accessToken = this.jwtService.sign(payload);

      return { accessToken, expirein: DAY };
    } catch (err) {
      throw new Error(SYSTEM_ERROR_MESSAGE.INTERNAL_ERROR);
    }
  }

  async signup(dto: SignupDto): Promise<SignupResp> {
    const { password, email, zodiacSign } = dto;
    const hash = await bcrypt.hash(
      password,
      Number.parseInt(this.configService.get("SALT_ROUNDS") || '10')
    );
    return this.accountRepository.save({ email, password: hash, zodiacSign });
  }

  async resetPassword(payload: AccessTokenPayloadData, dto: ResetPasswordDto): Promise<ResetPasswordResp> {
    const account = await this.accountRepository.findOne(payload.sub);
    if(!account) throw new Error(AUTH_ERROR_MESSAGE.NOTFOUND);
    const hash = await bcrypt.hash(
      dto.newPassword,
      Number.parseInt(this.configService.get("SALT_ROUNDS") || '10')
    );
    await this.accountRepository.save({ ...account, password: hash });
    return { message: 'successfully' };
  }
}
