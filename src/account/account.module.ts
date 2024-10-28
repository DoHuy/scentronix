import { Logger, Module } from "@nestjs/common";
import { RepositoryModule } from "@/repository";
import { AccountController } from "./controllers";
import { AccountService } from "./services";
import { HttpModule } from "@nestjs/axios";

@Module({
  imports: [RepositoryModule, HttpModule],
  controllers: [AccountController],
  providers: [AccountService, Logger],
  exports: [AccountService]
})
export class AccountModule {}
