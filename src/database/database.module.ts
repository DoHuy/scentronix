import { Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return {
          type: "postgres",
          host: configService.get("POSTGRES_HOST"),
          port: configService.get("POSTGRES_PORT"),
          username: configService.get("POSTGRES_USER"),
          password: configService.get("POSTGRES_PASSWORD"),
          database: configService.get("POSTGRES_DB"),
          entities: [__dirname + "/../**/*.entity.js"],
          synchronize: configService.get("SYNCHRONIZE") === "true"
        };
      }
    })
  ]
})
export class DatabaseModule {}
