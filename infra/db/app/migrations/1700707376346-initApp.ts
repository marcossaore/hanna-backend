import { MigrationInterface, QueryRunner } from "typeorm";

export class InitApp1700707376346 implements MigrationInterface {
    name = 'InitApp1700707376346'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`tenant\` (\`createdAt\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, \`updatedAt\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, \`id\` int NOT NULL AUTO_INCREMENT, \`uuid\` varchar(255) NOT NULL, \`name\` varchar(255) NOT NULL, \`companyIdentifier\` varchar(30) NOT NULL, \`document\` varchar(255) NOT NULL, \`partnerName\` varchar(255) NOT NULL, \`partnerDocument\` varchar(255) NOT NULL, \`phone\` varchar(255) NOT NULL, \`email\` varchar(255) NOT NULL, \`status\` enum ('pending', 'processed', 'rejected') NOT NULL DEFAULT 'pending', \`error\` text NULL, UNIQUE INDEX \`IDX_065d899dce9195dfb9d4e461a2\` (\`uuid\`), UNIQUE INDEX \`IDX_0e35ee2cd4d115679487936fa5\` (\`companyIdentifier\`), UNIQUE INDEX \`IDX_42c33723a6e007d2c8bbd70198\` (\`document\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX \`IDX_42c33723a6e007d2c8bbd70198\` ON \`tenant\``);
        await queryRunner.query(`DROP INDEX \`IDX_0e35ee2cd4d115679487936fa5\` ON \`tenant\``);
        await queryRunner.query(`DROP INDEX \`IDX_065d899dce9195dfb9d4e461a2\` ON \`tenant\``);
        await queryRunner.query(`DROP TABLE \`tenant\``);
    }

}
