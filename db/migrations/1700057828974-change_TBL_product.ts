import { MigrationInterface, QueryRunner } from "typeorm";

export class ChangeTBLProduct1700057828974 implements MigrationInterface {
    name = 'ChangeTBLProduct1700057828974'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "products" ADD "stock" integer NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "products" DROP COLUMN "stock"`);
    }

}
