import { MigrationInterface, QueryRunner } from 'typeorm'

export class AddSaleTables1702657148168 implements MigrationInterface {
  name = 'AddSaleTables1702657148168'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`order\` (\`createdAt\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, \`updatedAt\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, \`id\` int NOT NULL AUTO_INCREMENT, \`quantity\` int NOT NULL, \`deletedAt\` timestamp(6) NULL, \`productId\` int NULL, \`saleId\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`
    )
    await queryRunner.query(
      `CREATE TABLE \`sales\` (\`createdAt\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, \`updatedAt\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, \`id\` int NOT NULL AUTO_INCREMENT, \`paymentMethod\` enum ('money', 'credit', 'debit', 'ticket', 'pix', 'bill') NOT NULL, \`times\` int NULL, \`fee\` int NULL, \`discount\` int NULL, \`amount\` int NULL, \`deletedAt\` timestamp(6) NULL, \`customerId\` varchar(36) NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`
    )
    await queryRunner.query(
      `ALTER TABLE \`order\` ADD CONSTRAINT \`FK_88991860e839c6153a7ec878d39\` FOREIGN KEY (\`productId\`) REFERENCES \`product\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`
    )
    await queryRunner.query(
      `ALTER TABLE \`order\` ADD CONSTRAINT \`FK_41ad44b78b3c2565a34ac6e7155\` FOREIGN KEY (\`saleId\`) REFERENCES \`sales\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE \`sales\` ADD CONSTRAINT \`FK_3a92cf6add00043cef9833db1cd\` FOREIGN KEY (\`customerId\`) REFERENCES \`customer\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`sales\` DROP FOREIGN KEY \`FK_3a92cf6add00043cef9833db1cd\``
    )
    await queryRunner.query(
      `ALTER TABLE \`order\` DROP FOREIGN KEY \`FK_41ad44b78b3c2565a34ac6e7155\``
    )
    await queryRunner.query(
      `ALTER TABLE \`order\` DROP FOREIGN KEY \`FK_88991860e839c6153a7ec878d39\``
    )
    await queryRunner.query(`DROP TABLE \`sales\``)
    await queryRunner.query(`DROP TABLE \`order\``)
  }
}
