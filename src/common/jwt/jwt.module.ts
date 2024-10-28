import { Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtModule as NestJwtModule } from "@nestjs/jwt";

import { JwtStrategy } from "./jwt.strategy";
import { RepositoryModule } from "src/repository/repository.module";

@Module({
  imports: [
    RepositoryModule,
    NestJwtModule.registerAsync({
      imports: [],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get("JWT_SIGNIN_SECRET"),
        signOptions: {
          expiresIn: configService.get("JWT_SIGNIN_EXP"),
          algorithm: "HS512"
        }
      }),
      inject: [ConfigService]
    })
  ],
  providers: [JwtStrategy],
  exports: [JwtStrategy, NestJwtModule]
})
export class JwtModule {}
