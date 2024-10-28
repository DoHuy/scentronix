import { EntityRepository, Repository } from "typeorm";
import { Account } from "@/entity";

@EntityRepository(Account)
export class AccountRepository extends Repository<Account> {}
