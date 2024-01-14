import { MigrationInterface, QueryRunner } from "typeorm";

export class AddPlanTable1705254917345 implements MigrationInterface {
    name = 'AddPlanTable1705254917345'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`plan\` (\`createdAt\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, \`updatedAt\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, \`id\` varchar(36) NOT NULL, \`name\` varchar(255) NOT NULL, \`bathTimes\` int NOT NULL, \`groomingTimes\` int NOT NULL, \`allowedDays\` varchar(255) NOT NULL, \`monthlyPayment\` int NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`plan_services\` (\`serviceId\` varchar(36) NOT NULL, \`planId\` varchar(36) NOT NULL, INDEX \`IDX_5c6ca9c37bf33c7a156aeb6e96\` (\`serviceId\`), INDEX \`IDX_aa14a14311906350fae0639c26\` (\`planId\`), PRIMARY KEY (\`serviceId\`, \`planId\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`service_carry\` DROP FOREIGN KEY \`FK_06b148b11f24e9fddd4d675b1bb\``);
        await queryRunner.query(`ALTER TABLE \`service\` CHANGE \`id\` \`id\` int NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`service\` DROP PRIMARY KEY`);
        await queryRunner.query(`ALTER TABLE \`service\` DROP COLUMN \`id\``);
        await queryRunner.query(`ALTER TABLE \`service\` ADD \`id\` varchar(36) NOT NULL PRIMARY KEY`);
        await queryRunner.query(`ALTER TABLE \`service_carry\` DROP COLUMN \`serviceId\``);
        await queryRunner.query(`ALTER TABLE \`service_carry\` ADD \`serviceId\` varchar(36) NULL`);
        await queryRunner.query(`ALTER TABLE \`service_carry\` ADD CONSTRAINT \`FK_06b148b11f24e9fddd4d675b1bb\` FOREIGN KEY (\`serviceId\`) REFERENCES \`service\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE \`plan_services\` ADD CONSTRAINT \`FK_5c6ca9c37bf33c7a156aeb6e96a\` FOREIGN KEY (\`serviceId\`) REFERENCES \`plan\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE \`plan_services\` ADD CONSTRAINT \`FK_aa14a14311906350fae0639c260\` FOREIGN KEY (\`planId\`) REFERENCES \`service\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`plan_services\` DROP FOREIGN KEY \`FK_aa14a14311906350fae0639c260\``);
        await queryRunner.query(`ALTER TABLE \`plan_services\` DROP FOREIGN KEY \`FK_5c6ca9c37bf33c7a156aeb6e96a\``);
        await queryRunner.query(`ALTER TABLE \`service_carry\` DROP FOREIGN KEY \`FK_06b148b11f24e9fddd4d675b1bb\``);
        await queryRunner.query(`ALTER TABLE \`service_carry\` DROP COLUMN \`serviceId\``);
        await queryRunner.query(`ALTER TABLE \`service_carry\` ADD \`serviceId\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`service\` DROP COLUMN \`id\``);
        await queryRunner.query(`ALTER TABLE \`service\` ADD \`id\` int NOT NULL AUTO_INCREMENT`);
        await queryRunner.query(`ALTER TABLE \`service\` ADD PRIMARY KEY (\`id\`)`);
        await queryRunner.query(`ALTER TABLE \`service\` CHANGE \`id\` \`id\` int NOT NULL AUTO_INCREMENT`);
        await queryRunner.query(`ALTER TABLE \`service_carry\` ADD CONSTRAINT \`FK_06b148b11f24e9fddd4d675b1bb\` FOREIGN KEY (\`serviceId\`) REFERENCES \`service\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`DROP INDEX \`IDX_aa14a14311906350fae0639c26\` ON \`plan_services\``);
        await queryRunner.query(`DROP INDEX \`IDX_5c6ca9c37bf33c7a156aeb6e96\` ON \`plan_services\``);
        await queryRunner.query(`DROP TABLE \`plan_services\``);
        await queryRunner.query(`DROP TABLE \`plan\``);
    }

}
