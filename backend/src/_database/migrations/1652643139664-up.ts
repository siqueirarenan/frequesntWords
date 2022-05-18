import { MigrationInterface, QueryRunner } from "typeorm";
import seedLanguage from "../seeds/language.seed";
import seedPolish from "../seeds/polishWords.seed";

export class up1652643139664 implements MigrationInterface {
    name = 'up1652643139664'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await seedLanguage(queryRunner)
        await seedPolish(queryRunner)
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
    }

}
