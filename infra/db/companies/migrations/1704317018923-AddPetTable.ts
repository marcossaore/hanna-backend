import { MigrationInterface, QueryRunner } from "typeorm";

export class AddPetTable1704317018923 implements MigrationInterface {
    name = 'AddPetTable1704317018923'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`pet\` (\`createdAt\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, \`updatedAt\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, \`id\` varchar(36) NOT NULL, \`name\` varchar(255) NOT NULL, \`carry\` enum ('small', 'medium', 'large', 'xlarge') NOT NULL, \`breed\` varchar(255) NOT NULL, \`birthday\` datetime NOT NULL, \`deletedAt\` timestamp(6) NULL, \`customerId\` varchar(36) NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`pet\` ADD CONSTRAINT \`FK_5b012958bdd83f8521fc8cf5f86\` FOREIGN KEY (\`customerId\`) REFERENCES \`customer\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`pet\` DROP FOREIGN KEY \`FK_5b012958bdd83f8521fc8cf5f86\``);
        await queryRunner.query(`DROP TABLE \`pet\``);
    }

}
