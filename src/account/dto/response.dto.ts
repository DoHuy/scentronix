import { IsNumber, IsString } from "class-validator";

export class UrlDto {
  @IsString()
  url: string;

  @IsNumber()
  priority: number;
}
