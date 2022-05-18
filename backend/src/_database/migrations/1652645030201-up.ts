import { MigrationInterface, QueryRunner } from "typeorm";

export class up1652645030201 implements MigrationInterface {
    name = 'up1652645030201'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "user_knowlege" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "knowledge" integer NOT NULL, "nextTime" TIMESTAMP NOT NULL DEFAULT '"2022-05-15T20:03:55.195Z"', "userId" integer NOT NULL, "wordId" integer NOT NULL, CONSTRAINT "PK_16420a3cad54951460a2302d439" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "user_knowlege" ADD CONSTRAINT "FK_805174f01b28b72eb0f415be13c" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user_knowlege" ADD CONSTRAINT "FK_3da81b9157ef9309b4a646c1e4d" FOREIGN KEY ("wordId") REFERENCES "word"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_knowlege" DROP CONSTRAINT "FK_3da81b9157ef9309b4a646c1e4d"`);
        await queryRunner.query(`ALTER TABLE "user_knowlege" DROP CONSTRAINT "FK_805174f01b28b72eb0f415be13c"`);
        await queryRunner.query(`DROP TABLE "user_knowlege"`);
    }

}
