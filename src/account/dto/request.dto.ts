import { Type } from "class-transformer";
import { IsString } from "class-validator";

export class QueryFortuneDto {
  @IsString()
  @Type(() => String)
  readonly sign?: string;
}
