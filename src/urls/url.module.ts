import { Logger, Module } from "@nestjs/common";
import { RepositoryModule } from "@/repository";
import { UrlController } from "./controllers";
import { UrlService } from "./services";
import { HttpModule } from "@nestjs/axios";

@Module({
  imports: [RepositoryModule, HttpModule],
  controllers: [UrlController],
  providers: [UrlService, Logger],
  exports: [UrlService]
})
export class UrlModule {}
