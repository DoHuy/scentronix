import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Input } from "@/entity";
import { InputRepository } from "./input.repository";

@Module({
  imports: [TypeOrmModule.forFeature([Input, InputRepository])],
  providers: [],
  exports: [TypeOrmModule]
})
export class RepositoryModule {}
