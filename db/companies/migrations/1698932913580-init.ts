import { MigrationInterface, QueryRunner } from "typeorm";

export class Init1698932913580 implements MigrationInterface {
    name = 'Init1698932913580'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`customer\` (\`createdAt\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, \`updatedAt\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, \`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(255) NOT NULL, \`uuid\` varchar(255) NOT NULL, \`phone\` varchar(255) NOT NULL, \`email\` varchar(255) NULL, \`street\` varchar(255) NOT NULL, \`number\` varchar(255) NOT NULL, \`complement\` varchar(255) NULL, \`neighborhood\` varchar(255) NOT NULL, \`city\` varchar(255) NOT NULL, \`state\` varchar(255) NOT NULL, \`country\` varchar(255) NOT NULL, UNIQUE INDEX \`IDX_ac1455877a69957f7466d5dc78\` (\`name\`), UNIQUE INDEX \`IDX_19468a0ccfcf3e76cbb7789cb7\` (\`uuid\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`action_module\` (\`createdAt\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, \`updatedAt\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, \`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(255) NOT NULL, UNIQUE INDEX \`IDX_4a069e90199bc86c60f37039a4\` (\`name\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`option_module\` (\`createdAt\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, \`updatedAt\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, \`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(255) NOT NULL, UNIQUE INDEX \`IDX_5bf19b1f43cf4f22f480c61e01\` (\`name\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`module\` (\`createdAt\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, \`updatedAt\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, \`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(255) NOT NULL, \`parentId\` int NULL, UNIQUE INDEX \`IDX_620a549dbcb1fff62ea85695ca\` (\`name\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`user\` (\`createdAt\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, \`updatedAt\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, \`id\` int NOT NULL AUTO_INCREMENT, \`uuid\` varchar(255) NOT NULL, \`name\` varchar(255) NOT NULL, \`email\` varchar(255) NOT NULL, \`phone\` varchar(255) NULL, UNIQUE INDEX \`IDX_a95e949168be7b7ece1a2382fe\` (\`uuid\`), UNIQUE INDEX \`IDX_e12875dfb3b1d92d7d7c5377e2\` (\`email\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`user_permission\` (\`createdAt\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, \`updatedAt\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, \`id\` int NOT NULL AUTO_INCREMENT, \`userId\` int NULL, \`moduleId\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`module_actions\` (\`moduleId\` int NOT NULL, \`action\` int NOT NULL, INDEX \`IDX_7f84769243b71b6455da85750a\` (\`moduleId\`), INDEX \`IDX_70a583a6b8315fca11a3ebcc20\` (\`action\`), PRIMARY KEY (\`moduleId\`, \`action\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`module_options\` (\`moduleId\` int NOT NULL, \`option\` int NOT NULL, INDEX \`IDX_7fc95ecd93b319db7c9759877a\` (\`moduleId\`), INDEX \`IDX_80c3253eb1450bf2315d7e7350\` (\`option\`), PRIMARY KEY (\`moduleId\`, \`option\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`user_permission_action\` (\`permissionId\` int NOT NULL, \`actionId\` int NOT NULL, INDEX \`IDX_ee06ae94b1ff4bae99a0d873a5\` (\`permissionId\`), INDEX \`IDX_88d554f330732ab269ce975338\` (\`actionId\`), PRIMARY KEY (\`permissionId\`, \`actionId\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`user_permission_option\` (\`permissionId\` int NOT NULL, \`optionId\` int NOT NULL, INDEX \`IDX_4e58a61916eed51fd741e2d493\` (\`permissionId\`), INDEX \`IDX_7dbe89d00953e83a547888de29\` (\`optionId\`), PRIMARY KEY (\`permissionId\`, \`optionId\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`module_closure\` (\`id_ancestor\` int NOT NULL, \`id_descendant\` int NOT NULL, INDEX \`IDX_e59b47eb805b4e8c294d25df7d\` (\`id_ancestor\`), INDEX \`IDX_b62efd465e71f13a8d8a828984\` (\`id_descendant\`), PRIMARY KEY (\`id_ancestor\`, \`id_descendant\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`module\` ADD CONSTRAINT \`FK_3477e0c46c6a35a23b16792f002\` FOREIGN KEY (\`parentId\`) REFERENCES \`module\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`user_permission\` ADD CONSTRAINT \`FK_deb59c09715314aed1866e18a81\` FOREIGN KEY (\`userId\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`user_permission\` ADD CONSTRAINT \`FK_8387da744c918249f2a7b449067\` FOREIGN KEY (\`moduleId\`) REFERENCES \`module\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE \`module_actions\` ADD CONSTRAINT \`FK_7f84769243b71b6455da85750a3\` FOREIGN KEY (\`moduleId\`) REFERENCES \`module\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE \`module_actions\` ADD CONSTRAINT \`FK_70a583a6b8315fca11a3ebcc208\` FOREIGN KEY (\`action\`) REFERENCES \`action_module\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`module_options\` ADD CONSTRAINT \`FK_7fc95ecd93b319db7c9759877a8\` FOREIGN KEY (\`moduleId\`) REFERENCES \`module\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE \`module_options\` ADD CONSTRAINT \`FK_80c3253eb1450bf2315d7e7350f\` FOREIGN KEY (\`option\`) REFERENCES \`option_module\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`user_permission_action\` ADD CONSTRAINT \`FK_ee06ae94b1ff4bae99a0d873a5e\` FOREIGN KEY (\`permissionId\`) REFERENCES \`user_permission\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE \`user_permission_action\` ADD CONSTRAINT \`FK_88d554f330732ab269ce9753389\` FOREIGN KEY (\`actionId\`) REFERENCES \`action_module\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE \`user_permission_option\` ADD CONSTRAINT \`FK_4e58a61916eed51fd741e2d493b\` FOREIGN KEY (\`permissionId\`) REFERENCES \`user_permission\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE \`user_permission_option\` ADD CONSTRAINT \`FK_7dbe89d00953e83a547888de29d\` FOREIGN KEY (\`optionId\`) REFERENCES \`option_module\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE \`module_closure\` ADD CONSTRAINT \`FK_e59b47eb805b4e8c294d25df7d7\` FOREIGN KEY (\`id_ancestor\`) REFERENCES \`module\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`module_closure\` ADD CONSTRAINT \`FK_b62efd465e71f13a8d8a828984c\` FOREIGN KEY (\`id_descendant\`) REFERENCES \`module\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`module_closure\` DROP FOREIGN KEY \`FK_b62efd465e71f13a8d8a828984c\``);
        await queryRunner.query(`ALTER TABLE \`module_closure\` DROP FOREIGN KEY \`FK_e59b47eb805b4e8c294d25df7d7\``);
        await queryRunner.query(`ALTER TABLE \`user_permission_option\` DROP FOREIGN KEY \`FK_7dbe89d00953e83a547888de29d\``);
        await queryRunner.query(`ALTER TABLE \`user_permission_option\` DROP FOREIGN KEY \`FK_4e58a61916eed51fd741e2d493b\``);
        await queryRunner.query(`ALTER TABLE \`user_permission_action\` DROP FOREIGN KEY \`FK_88d554f330732ab269ce9753389\``);
        await queryRunner.query(`ALTER TABLE \`user_permission_action\` DROP FOREIGN KEY \`FK_ee06ae94b1ff4bae99a0d873a5e\``);
        await queryRunner.query(`ALTER TABLE \`module_options\` DROP FOREIGN KEY \`FK_80c3253eb1450bf2315d7e7350f\``);
        await queryRunner.query(`ALTER TABLE \`module_options\` DROP FOREIGN KEY \`FK_7fc95ecd93b319db7c9759877a8\``);
        await queryRunner.query(`ALTER TABLE \`module_actions\` DROP FOREIGN KEY \`FK_70a583a6b8315fca11a3ebcc208\``);
        await queryRunner.query(`ALTER TABLE \`module_actions\` DROP FOREIGN KEY \`FK_7f84769243b71b6455da85750a3\``);
        await queryRunner.query(`ALTER TABLE \`user_permission\` DROP FOREIGN KEY \`FK_8387da744c918249f2a7b449067\``);
        await queryRunner.query(`ALTER TABLE \`user_permission\` DROP FOREIGN KEY \`FK_deb59c09715314aed1866e18a81\``);
        await queryRunner.query(`ALTER TABLE \`module\` DROP FOREIGN KEY \`FK_3477e0c46c6a35a23b16792f002\``);
        await queryRunner.query(`DROP INDEX \`IDX_b62efd465e71f13a8d8a828984\` ON \`module_closure\``);
        await queryRunner.query(`DROP INDEX \`IDX_e59b47eb805b4e8c294d25df7d\` ON \`module_closure\``);
        await queryRunner.query(`DROP TABLE \`module_closure\``);
        await queryRunner.query(`DROP INDEX \`IDX_7dbe89d00953e83a547888de29\` ON \`user_permission_option\``);
        await queryRunner.query(`DROP INDEX \`IDX_4e58a61916eed51fd741e2d493\` ON \`user_permission_option\``);
        await queryRunner.query(`DROP TABLE \`user_permission_option\``);
        await queryRunner.query(`DROP INDEX \`IDX_88d554f330732ab269ce975338\` ON \`user_permission_action\``);
        await queryRunner.query(`DROP INDEX \`IDX_ee06ae94b1ff4bae99a0d873a5\` ON \`user_permission_action\``);
        await queryRunner.query(`DROP TABLE \`user_permission_action\``);
        await queryRunner.query(`DROP INDEX \`IDX_80c3253eb1450bf2315d7e7350\` ON \`module_options\``);
        await queryRunner.query(`DROP INDEX \`IDX_7fc95ecd93b319db7c9759877a\` ON \`module_options\``);
        await queryRunner.query(`DROP TABLE \`module_options\``);
        await queryRunner.query(`DROP INDEX \`IDX_70a583a6b8315fca11a3ebcc20\` ON \`module_actions\``);
        await queryRunner.query(`DROP INDEX \`IDX_7f84769243b71b6455da85750a\` ON \`module_actions\``);
        await queryRunner.query(`DROP TABLE \`module_actions\``);
        await queryRunner.query(`DROP TABLE \`user_permission\``);
        await queryRunner.query(`DROP INDEX \`IDX_e12875dfb3b1d92d7d7c5377e2\` ON \`user\``);
        await queryRunner.query(`DROP INDEX \`IDX_a95e949168be7b7ece1a2382fe\` ON \`user\``);
        await queryRunner.query(`DROP TABLE \`user\``);
        await queryRunner.query(`DROP INDEX \`IDX_620a549dbcb1fff62ea85695ca\` ON \`module\``);
        await queryRunner.query(`DROP TABLE \`module\``);
        await queryRunner.query(`DROP INDEX \`IDX_5bf19b1f43cf4f22f480c61e01\` ON \`option_module\``);
        await queryRunner.query(`DROP TABLE \`option_module\``);
        await queryRunner.query(`DROP INDEX \`IDX_4a069e90199bc86c60f37039a4\` ON \`action_module\``);
        await queryRunner.query(`DROP TABLE \`action_module\``);
        await queryRunner.query(`DROP INDEX \`IDX_19468a0ccfcf3e76cbb7789cb7\` ON \`customer\``);
        await queryRunner.query(`DROP INDEX \`IDX_ac1455877a69957f7466d5dc78\` ON \`customer\``);
        await queryRunner.query(`DROP TABLE \`customer\``);
    }

}
