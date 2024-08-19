import { UrlDto } from "@/urls";
import { Value } from "@/entity";

export interface UrlInterface {
  findAll(priority?: number): Promise<UrlDto[]>;
  checkUrl(url: string): Promise<boolean>;
  checkUrls(urls: string[]): Promise<{ url: string; online: boolean }[]>;
  getDataFromDatabase(): Promise<Value[]>;
}
