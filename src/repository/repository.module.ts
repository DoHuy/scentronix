import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Account } from "@/entity";
import { AccountRepository } from "./account.repository";

@Module({
  imports: [TypeOrmModule.forFeature([Account, AccountRepository])],
  providers: [],
  exports: [TypeOrmModule]
})
export class RepositoryModule {}
