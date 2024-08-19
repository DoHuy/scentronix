import {
  Controller,
  Get,
  InternalServerErrorException,
  NotFoundException,
  Query
} from "@nestjs/common";
import { ApiHeader, ApiTags } from "@nestjs/swagger";
import { UrlService } from "../services";
import { ApiSecurity } from "@/auth";
import { QueryDto, UrlDto } from "../dto";
import { CUSTOM_ERROR_CODE } from "@/common";

@ApiTags("Urls")
@ApiHeader({
  name: "X-API-KEY"
})
@ApiSecurity()
@Controller("urls")
export class UrlController {
  constructor(private urlService: UrlService) {}

  @Get()
  async findAll(@Query() query: QueryDto): Promise<UrlDto[]> {
    const { priority = undefined } = query;
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
