import { MigrationInterface, QueryRunner } from "typeorm";

export class up1652643070725 implements MigrationInterface {
    name = 'up1652643070725'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "language" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "name" character varying(30) NOT NULL, "fullName" character varying(30) NOT NULL, "code" character varying(5) NOT NULL, CONSTRAINT "PK_cc0a99e710eb3733f6fb42b1d4c" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "name" ON "language" ("name") WHERE "deletedAt" IS NOT NULL`);
        await queryRunner.query(`CREATE TABLE "word" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "word" character varying(100) NOT NULL, "type" character varying NOT NULL, "pt_br" character varying(100) NOT NULL, "en_us" character varying(100) NOT NULL, "de_de" character varying(100) NOT NULL, "languageId" integer NOT NULL, CONSTRAINT "PK_ad026d65e30f80b7056ca31f666" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "unique_word" ON "word" ("word") WHERE "deletedAt" IS NOT NULL`);
        await queryRunner.query(`CREATE TABLE "user" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "name" character varying NOT NULL, "email" character varying NOT NULL, "password" character varying NOT NULL, "role" character varying NOT NULL DEFAULT 'simple', CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "unique_email" ON "user" ("email") WHERE "deletedAt" IS NOT NULL`);
        await queryRunner.query(`CREATE UNIQUE INDEX "unique_name" ON "user" ("name") WHERE "deletedAt" IS NOT NULL`);
        await queryRunner.query(`ALTER TABLE "word" ADD CONSTRAINT "FK_9b8ff0cdbf69e21261ad4af8a83" FOREIGN KEY ("languageId") REFERENCES "language"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "word" DROP CONSTRAINT "FK_9b8ff0cdbf69e21261ad4af8a83"`);
        await queryRunner.query(`DROP INDEX "public"."unique_name"`);
        await queryRunner.query(`DROP INDEX "public"."unique_email"`);
        await queryRunner.query(`DROP TABLE "user"`);
        await queryRunner.query(`DROP INDEX "public"."unique_word"`);
        await queryRunner.query(`DROP TABLE "word"`);
        await queryRunner.query(`DROP INDEX "public"."name"`);
        await queryRunner.query(`DROP TABLE "language"`);
    }

}
