import { Body, Controller, Post } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { AuthService } from "../services";
import {
  SigninDto,
  SignupDto,
  ResetPasswordDto,
  SigninResp,
  SignupResp,
  ResetPasswordResp,
  AccessTokenPayloadData
} from "../dto";
import { Authenticated, CurrentUser } from "../decorators";

@ApiTags("Authentication")
@Controller("auth")
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post("signin")
  signin(@Body() signinDto: SigninDto): Promise<SigninResp> {
    return this.authService.signin(signinDto);
  }

  @Post("signup")
  signUp(@Body() signUpDto: SignupDto): Promise<SignupResp> {
    return this.authService.signup(signUpDto);
  }

  @Authenticated()
  @Post("reset-password")
  resetPassword(
    @CurrentUser() payload: AccessTokenPayloadData,
    @Body() resetPasswordDto: ResetPasswordDto
  ): Promise<ResetPasswordResp> {
    return this.authService.resetPassword(payload, resetPasswordDto);
  }
}
