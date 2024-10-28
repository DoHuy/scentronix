import { Account } from "@/entity";
import { IsEmail, IsNotEmpty } from "class-validator";

export class SigninDto {
  @IsEmail({}, { message: "Incorrect email" })
  @IsNotEmpty({ message: "The email is required" })
  email!: string;

  @IsNotEmpty({ message: "The password is required" })
  password!: string;
}

export class SignupDto {
  @IsEmail({}, { message: "Incorrect email" })
  @IsNotEmpty({ message: "The email is required" })
  email!: string;

  @IsNotEmpty({ message: "The password is required" })
  password!: string;

  @IsNotEmpty({ message: "The zodiac sign is required" })
  zodiacSign!: string;
}

export class ResetPasswordDto {
  @IsNotEmpty({ message: "The password is required" })
  password!: string;

  @IsNotEmpty({ message: "The new password is required" })
  newPassword!: string;
}

export class SigninResp {
  accessToken: string;
  expirein: number;
}

export class SignupResp extends Account {
  constructor(partial?: Partial<Account>) {
    super();
    Object.assign(this, partial);
  }
}

export class ResetPasswordResp {
  message: string;
}

export class AccessTokenPayloadData {
  email: string;
  sub: string;
}
