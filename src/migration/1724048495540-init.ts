import { MigrationInterface, QueryRunner } from "typeorm";

export class init1724048495540 implements MigrationInterface {
  name = "init1724048495540";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS \"uuid-ossp\"`);

    await queryRunner.query(
      `CREATE TABLE "input" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "values" jsonb NOT NULL DEFAULT '[]', CONSTRAINT "PK_a1deaa2fcdc821329884ad43931" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(`INSERT INTO public."input"
(id, "createdAt", "updatedAt", "values")
VALUES(uuid_generate_v4(), now(), now(), '[{"url": "https://does-not-work.perfume.new", "priority": 1}, {"url": "https://gitlab.com", "priority": 4}, {"url": "https://github.com", "priority": 4}, {"url": "https://doesnt-work.github.com", "priority": 4}, {"url": "http://app.scnt.me", "priority": 3}, {"url": "https://offline.scentronix.com", "priority": 2}]'::jsonb)`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "input"`);
  }
}
