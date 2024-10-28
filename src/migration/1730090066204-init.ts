import { MigrationInterface, QueryRunner } from "typeorm";

export class init1730090066204 implements MigrationInterface {
  name = "init1730090066204";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS \"uuid-ossp\"`);

    await queryRunner.query(
      `CREATE TABLE "account" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "email" varchar(255) NOT NULL UNIQUE, "password" varchar(255) NOT NULL, "zodiacSign" varchar(50) NOT NULL, CONSTRAINT "PK_a1deaa2fcdc821329884ad43931" PRIMARY KEY ("id"))`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "account"`);
  }
}
