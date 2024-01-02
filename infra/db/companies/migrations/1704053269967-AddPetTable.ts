import { MigrationInterface, QueryRunner } from "typeorm";

export class AddPetTable1704053269967 implements MigrationInterface {
    name = 'AddPetTable1704053269967'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`customer\` DROP FOREIGN KEY \`FK_cebd48b99074899ea97b547e93e\``);
        await queryRunner.query(`ALTER TABLE \`customer\` DROP COLUMN \`petId\``);
        await queryRunner.query(`ALTER TABLE \`pet\` ADD \`customerId\` varchar(36) NULL`);
        await queryRunner.query(`ALTER TABLE \`pet\` ADD CONSTRAINT \`FK_5b012958bdd83f8521fc8cf5f86\` FOREIGN KEY (\`customerId\`) REFERENCES \`customer\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`pet\` DROP FOREIGN KEY \`FK_5b012958bdd83f8521fc8cf5f86\``);
        await queryRunner.query(`ALTER TABLE \`pet\` DROP COLUMN \`customerId\``);
        await queryRunner.query(`ALTER TABLE \`customer\` ADD \`petId\` varchar(36) NULL`);
        await queryRunner.query(`ALTER TABLE \`customer\` ADD CONSTRAINT \`FK_cebd48b99074899ea97b547e93e\` FOREIGN KEY (\`petId\`) REFERENCES \`pet\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
