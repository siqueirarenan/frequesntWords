/* eslint-disable prettier/prettier */
import { QueryRunner } from "typeorm";


export default async function seedLanguage(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`INSERT INTO "language" (id,name,"fullName",code) VALUES(1,\'English\',\'English(US)\',\'en_us\')`);
        await queryRunner.query(`INSERT INTO "language" (id,name,"fullName",code) VALUES(2,\'Polish\',\'Polish\',\'pl\')`);
        await queryRunner.query(`INSERT INTO "language" (id,name,"fullName",code) VALUES(3,\'German\',\'German\',\'de_de\')`);
        await queryRunner.query(`INSERT INTO "language" (id,name,"fullName",code) VALUES(4,\'Portuguese\',\'Portuguese(BR)\',\'pt_br\')`);
    }

