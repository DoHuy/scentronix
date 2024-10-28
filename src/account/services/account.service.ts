import { AccountRepository } from "@/repository";
import { Injectable, Logger } from "@nestjs/common";
import { keyBy, orderBy } from "lodash";
import { CUSTOM_ERROR_CODE, REQUEST_ERROR, URL_ERROR_MESSAGE } from "@/common";
import axios, { AxiosError } from "axios";
import { AccountInterface } from "@/account";

@Injectable()
export class AccountService implements AccountInterface {
  private readonly timeout = 5000; // Timeout in milliseconds

  constructor(
    private accountRepository: AccountRepository,
    private readonly logger: Logger
  ) {}

  public async checkUrl(url: string): Promise<boolean> {
    try {
      const response = await axios.get(url, { timeout: this.timeout });

      // Check if response status is between 200 and 299
      return response.status >= 200 && response.status < 300;
      // URL is not considered online
    } catch (error) {
      if (this.isTimeoutError(error)) {
        throw new Error(
          `${CUSTOM_ERROR_CODE.REQUEST_TIMEOUT}|${REQUEST_ERROR.TIMEOUT}`
        );
      }
      return false; // URL is not reachable
    }
  }

  private isTimeoutError(error: unknown): boolean {
    const axiosError = error as AxiosError;
    return (
      axiosError.code === "ECONNABORTED" ||
      axiosError.message.includes("timeout")
    );
  }

  public async checkUrls(
    urls: string[]
  ): Promise<{ url: string; online: boolean }[]> {
    return await Promise.all(
      urls.map(async url => {
        const online = await this.checkUrl(url);
        return { url, online };
      })
    );
  }

  public async getDataFromDatabase() {
    const data = await this.inputRepository.find();
    if (!data || data.length == 0) {
      throw new Error(
        `${CUSTOM_ERROR_CODE.NOTFOUND}|${URL_ERROR_MESSAGE.NOTFOUND}`
      );
    }

    return data.flatMap(e => e.values);
  }

  async findAll(priority?: number): Promise<UrlDto[]> {
    let urls = await this.getDataFromDatabase();
    urls =
      priority !== undefined
        ? urls.filter(el => el.priority === priority)
        : urls;

    const urlGroupByPriority = keyBy(urls, "url");
    const results = await this.checkUrls(urls.map(el => el.url));

    const onlineUrls = orderBy(
      results.reduce((rs: UrlDto[], el: { url: string; online: boolean }) => {
        if (el.online) {
          const url = urlGroupByPriority[el.url];
          if (url) {
            return rs.concat(url);
          }
        }
        return rs;
      }, [] as UrlDto[]),
      ["priority"],
      ["asc"]
    );
    if (onlineUrls.length === 0) {
      this.logger.error("Not found online urls", UrlService.name);
      throw new Error(
        `${CUSTOM_ERROR_CODE.NOTFOUND}|${URL_ERROR_MESSAGE.NOTFOUND}`
      );
    }

    this.logger.log(`get online urls success`, UrlService.name);

    return onlineUrls;
  }
}
