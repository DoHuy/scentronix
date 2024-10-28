import { Module } from "@nestjs/common";
import { PassportModule } from "@nestjs/passport";

import { AuthService } from "./services";
import { RepositoryModule } from "src/repository/repository.module";
import { JwtModule } from "@/common";
import { AuthController } from "./controllers/auth.controller";
import { ConfigModule } from "@nestjs/config";
@Module({
  imports: [PassportModule, RepositoryModule, JwtModule, ConfigModule],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [AuthService]
})
export class AuthModule {}
