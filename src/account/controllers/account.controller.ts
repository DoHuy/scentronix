import {
  Controller,
  Get,
  InternalServerErrorException,
  NotFoundException
} from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { Authenticated } from "@/auth";
import { CUSTOM_ERROR_CODE } from "@/common";
import { AccountService } from "../services";
import { Account } from "@/entity";

@ApiTags("Urls")
@Authenticated()
@Controller("accounts")
export class AccountController {
  constructor(private accountService: AccountService) {}

  @Get("profile")
  async getProfile(@CurrentUser() account: Account): Promise<Partial<Account>> {
    let result;
    try {
      result = await this.urlService.findAll(priority);
    } catch (err) {
      const urlServiceError = err as Error;
      const [code = null, message = ""] = urlServiceError.message.split("|");
      if (
        code == CUSTOM_ERROR_CODE.NOTFOUND ||
        code == CUSTOM_ERROR_CODE.REQUEST_TIMEOUT
      ) {
        throw new NotFoundException(message);
      }
      throw new InternalServerErrorException(err);
    }
    return result;
  }
}
