import { Account } from "@/entity";

export interface UrlInterface {
  getProfile(): Promise<Partial<Account>>;
}
