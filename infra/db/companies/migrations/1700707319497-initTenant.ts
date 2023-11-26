import { MigrationInterface, QueryRunner } from "typeorm";

export class InitTenant1700707319497 implements MigrationInterface {
    name = 'InitTenant1700707319497'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`customer\` (\`createdAt\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, \`updatedAt\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, \`id\` int NOT NULL AUTO_INCREMENT, \`uuid\` varchar(255) NOT NULL, \`name\` varchar(255) NOT NULL, \`phone\` varchar(255) NOT NULL, \`email\` varchar(255) NULL, \`street\` varchar(255) NOT NULL, \`number\` varchar(255) NOT NULL, \`complement\` varchar(255) NULL, \`neighborhood\` varchar(255) NOT NULL, \`city\` varchar(255) NOT NULL, \`state\` varchar(255) NOT NULL, \`country\` varchar(255) NOT NULL, \`deletedAt\` timestamp(6) NULL, UNIQUE INDEX \`IDX_19468a0ccfcf3e76cbb7789cb7\` (\`uuid\`), UNIQUE INDEX \`IDX_03846b4bae9df80f19c76005a8\` (\`phone\`), UNIQUE INDEX \`IDX_fdb2f3ad8115da4c7718109a6e\` (\`email\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`rbac_grant\` (\`createdAt\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, \`updatedAt\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, \`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(255) NOT NULL, UNIQUE INDEX \`IDX_b7d73de85b224350d8efabde55\` (\`name\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`rbac_option\` (\`createdAt\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, \`updatedAt\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, \`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(255) NOT NULL, UNIQUE INDEX \`IDX_57f4319708594bd3cc28cb4624\` (\`name\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`rbac_module\` (\`createdAt\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, \`updatedAt\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, \`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(255) NOT NULL, UNIQUE INDEX \`IDX_955311b0f3f0ff6eea11807971\` (\`name\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`user\` (\`createdAt\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, \`updatedAt\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, \`id\` int NOT NULL AUTO_INCREMENT, \`uuid\` varchar(255) NOT NULL, \`name\` varchar(255) NOT NULL, \`password\` varchar(255) NULL, \`email\` varchar(255) NOT NULL, \`phone\` varchar(255) NULL, \`roleId\` int NULL, UNIQUE INDEX \`IDX_a95e949168be7b7ece1a2382fe\` (\`uuid\`), UNIQUE INDEX \`IDX_e12875dfb3b1d92d7d7c5377e2\` (\`email\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`rbac_role\` (\`createdAt\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, \`updatedAt\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, \`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(255) NOT NULL, UNIQUE INDEX \`IDX_fce815850f9d9ef177a31aafc0\` (\`name\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`rbac_role_permission\` (\`createdAt\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, \`updatedAt\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, \`id\` int NOT NULL AUTO_INCREMENT, \`roleId\` int NULL, \`moduleId\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`rbac_module_grants\` (\`moduleId\` int NOT NULL, \`grant\` int NOT NULL, INDEX \`IDX_2fcc53f4d79e835500dc57b029\` (\`moduleId\`), INDEX \`IDX_491a5485d47dbf9189c9448619\` (\`grant\`), PRIMARY KEY (\`moduleId\`, \`grant\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`rbac_module_options\` (\`moduleId\` int NOT NULL, \`option\` int NOT NULL, INDEX \`IDX_a623db94ffc69ffbbca16a294b\` (\`moduleId\`), INDEX \`IDX_ecc7aac4ab847e96d118ce65dd\` (\`option\`), PRIMARY KEY (\`moduleId\`, \`option\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`rbac_role_permission_grant\` (\`permissionId\` int NOT NULL, \`grantId\` int NOT NULL, INDEX \`IDX_4ef2488492fa3ba11e12ed0737\` (\`permissionId\`), INDEX \`IDX_92d55150c20936c77ad9437b43\` (\`grantId\`), PRIMARY KEY (\`permissionId\`, \`grantId\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`rbac_role_permission_option\` (\`permissionId\` int NOT NULL, \`optionId\` int NOT NULL, INDEX \`IDX_c93a300fe5f98f8079f3b53f45\` (\`permissionId\`), INDEX \`IDX_a0011e293c9efdc784c7795f9b\` (\`optionId\`), PRIMARY KEY (\`permissionId\`, \`optionId\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`user\` ADD CONSTRAINT \`FK_c28e52f758e7bbc53828db92194\` FOREIGN KEY (\`roleId\`) REFERENCES \`rbac_role\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE \`rbac_role_permission\` ADD CONSTRAINT \`FK_5bdc2c714728634b512903be3b8\` FOREIGN KEY (\`roleId\`) REFERENCES \`rbac_role\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`rbac_role_permission\` ADD CONSTRAINT \`FK_5f3c2605766666e03fdbd7acb55\` FOREIGN KEY (\`moduleId\`) REFERENCES \`rbac_module\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE \`rbac_module_grants\` ADD CONSTRAINT \`FK_2fcc53f4d79e835500dc57b0291\` FOREIGN KEY (\`moduleId\`) REFERENCES \`rbac_module\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE \`rbac_module_grants\` ADD CONSTRAINT \`FK_491a5485d47dbf9189c94486192\` FOREIGN KEY (\`grant\`) REFERENCES \`rbac_grant\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`rbac_module_options\` ADD CONSTRAINT \`FK_a623db94ffc69ffbbca16a294bc\` FOREIGN KEY (\`moduleId\`) REFERENCES \`rbac_module\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE \`rbac_module_options\` ADD CONSTRAINT \`FK_ecc7aac4ab847e96d118ce65ddc\` FOREIGN KEY (\`option\`) REFERENCES \`rbac_option\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`rbac_role_permission_grant\` ADD CONSTRAINT \`FK_4ef2488492fa3ba11e12ed0737c\` FOREIGN KEY (\`permissionId\`) REFERENCES \`rbac_role_permission\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE \`rbac_role_permission_grant\` ADD CONSTRAINT \`FK_92d55150c20936c77ad9437b438\` FOREIGN KEY (\`grantId\`) REFERENCES \`rbac_grant\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE \`rbac_role_permission_option\` ADD CONSTRAINT \`FK_c93a300fe5f98f8079f3b53f45b\` FOREIGN KEY (\`permissionId\`) REFERENCES \`rbac_role_permission\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE \`rbac_role_permission_option\` ADD CONSTRAINT \`FK_a0011e293c9efdc784c7795f9b7\` FOREIGN KEY (\`optionId\`) REFERENCES \`rbac_option\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`rbac_role_permission_option\` DROP FOREIGN KEY \`FK_a0011e293c9efdc784c7795f9b7\``);
        await queryRunner.query(`ALTER TABLE \`rbac_role_permission_option\` DROP FOREIGN KEY \`FK_c93a300fe5f98f8079f3b53f45b\``);
        await queryRunner.query(`ALTER TABLE \`rbac_role_permission_grant\` DROP FOREIGN KEY \`FK_92d55150c20936c77ad9437b438\``);
        await queryRunner.query(`ALTER TABLE \`rbac_role_permission_grant\` DROP FOREIGN KEY \`FK_4ef2488492fa3ba11e12ed0737c\``);
        await queryRunner.query(`ALTER TABLE \`rbac_module_options\` DROP FOREIGN KEY \`FK_ecc7aac4ab847e96d118ce65ddc\``);
        await queryRunner.query(`ALTER TABLE \`rbac_module_options\` DROP FOREIGN KEY \`FK_a623db94ffc69ffbbca16a294bc\``);
        await queryRunner.query(`ALTER TABLE \`rbac_module_grants\` DROP FOREIGN KEY \`FK_491a5485d47dbf9189c94486192\``);
        await queryRunner.query(`ALTER TABLE \`rbac_module_grants\` DROP FOREIGN KEY \`FK_2fcc53f4d79e835500dc57b0291\``);
        await queryRunner.query(`ALTER TABLE \`rbac_role_permission\` DROP FOREIGN KEY \`FK_5f3c2605766666e03fdbd7acb55\``);
        await queryRunner.query(`ALTER TABLE \`rbac_role_permission\` DROP FOREIGN KEY \`FK_5bdc2c714728634b512903be3b8\``);
        await queryRunner.query(`ALTER TABLE \`user\` DROP FOREIGN KEY \`FK_c28e52f758e7bbc53828db92194\``);
        await queryRunner.query(`DROP INDEX \`IDX_a0011e293c9efdc784c7795f9b\` ON \`rbac_role_permission_option\``);
        await queryRunner.query(`DROP INDEX \`IDX_c93a300fe5f98f8079f3b53f45\` ON \`rbac_role_permission_option\``);
        await queryRunner.query(`DROP TABLE \`rbac_role_permission_option\``);
        await queryRunner.query(`DROP INDEX \`IDX_92d55150c20936c77ad9437b43\` ON \`rbac_role_permission_grant\``);
        await queryRunner.query(`DROP INDEX \`IDX_4ef2488492fa3ba11e12ed0737\` ON \`rbac_role_permission_grant\``);
        await queryRunner.query(`DROP TABLE \`rbac_role_permission_grant\``);
        await queryRunner.query(`DROP INDEX \`IDX_ecc7aac4ab847e96d118ce65dd\` ON \`rbac_module_options\``);
        await queryRunner.query(`DROP INDEX \`IDX_a623db94ffc69ffbbca16a294b\` ON \`rbac_module_options\``);
        await queryRunner.query(`DROP TABLE \`rbac_module_options\``);
        await queryRunner.query(`DROP INDEX \`IDX_491a5485d47dbf9189c9448619\` ON \`rbac_module_grants\``);
        await queryRunner.query(`DROP INDEX \`IDX_2fcc53f4d79e835500dc57b029\` ON \`rbac_module_grants\``);
        await queryRunner.query(`DROP TABLE \`rbac_module_grants\``);
        await queryRunner.query(`DROP TABLE \`rbac_role_permission\``);
        await queryRunner.query(`DROP INDEX \`IDX_fce815850f9d9ef177a31aafc0\` ON \`rbac_role\``);
        await queryRunner.query(`DROP TABLE \`rbac_role\``);
        await queryRunner.query(`DROP INDEX \`IDX_e12875dfb3b1d92d7d7c5377e2\` ON \`user\``);
        await queryRunner.query(`DROP INDEX \`IDX_a95e949168be7b7ece1a2382fe\` ON \`user\``);
        await queryRunner.query(`DROP TABLE \`user\``);
        await queryRunner.query(`DROP INDEX \`IDX_955311b0f3f0ff6eea11807971\` ON \`rbac_module\``);
        await queryRunner.query(`DROP TABLE \`rbac_module\``);
        await queryRunner.query(`DROP INDEX \`IDX_57f4319708594bd3cc28cb4624\` ON \`rbac_option\``);
        await queryRunner.query(`DROP TABLE \`rbac_option\``);
        await queryRunner.query(`DROP INDEX \`IDX_b7d73de85b224350d8efabde55\` ON \`rbac_grant\``);
        await queryRunner.query(`DROP TABLE \`rbac_grant\``);
        await queryRunner.query(`DROP INDEX \`IDX_fdb2f3ad8115da4c7718109a6e\` ON \`customer\``);
        await queryRunner.query(`DROP INDEX \`IDX_03846b4bae9df80f19c76005a8\` ON \`customer\``);
        await queryRunner.query(`DROP INDEX \`IDX_19468a0ccfcf3e76cbb7789cb7\` ON \`customer\``);
        await queryRunner.query(`DROP TABLE \`customer\``);
    }

}
