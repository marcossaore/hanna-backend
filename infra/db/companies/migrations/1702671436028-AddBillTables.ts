import { MigrationInterface, QueryRunner } from 'typeorm'

export class AddBillTables1702671436028 implements MigrationInterface {
  name = 'AddBillTables1702671436028'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`bill_order\` (\`createdAt\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, \`updatedAt\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, \`id\` int NOT NULL AUTO_INCREMENT, \`quantity\` int NOT NULL, \`deletedAt\` timestamp(6) NULL, \`productId\` int NULL, \`billId\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`
    )
    await queryRunner.query(
      `CREATE TABLE \`bill\` (\`createdAt\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, \`updatedAt\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, \`id\` int NOT NULL AUTO_INCREMENT, \`amount\` int NULL, \`deletedAt\` timestamp(6) NULL, \`customerId\` varchar(36) NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`
    )
    await queryRunner.query(
      `ALTER TABLE \`bill_order\` ADD CONSTRAINT \`FK_71b4ae174c35956323e149da021\` FOREIGN KEY (\`productId\`) REFERENCES \`product\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`
    )
    await queryRunner.query(
      `ALTER TABLE \`bill_order\` ADD CONSTRAINT \`FK_72e715809a0df2a6e696f0a09d9\` FOREIGN KEY (\`billId\`) REFERENCES \`bill\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE \`bill\` ADD CONSTRAINT \`FK_8283ffb2d90b494882adece3f3c\` FOREIGN KEY (\`customerId\`) REFERENCES \`customer\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`bill\` DROP FOREIGN KEY \`FK_8283ffb2d90b494882adece3f3c\``
    )
    await queryRunner.query(
      `ALTER TABLE \`bill_order\` DROP FOREIGN KEY \`FK_72e715809a0df2a6e696f0a09d9\``
    )
    await queryRunner.query(
      `ALTER TABLE \`bill_order\` DROP FOREIGN KEY \`FK_71b4ae174c35956323e149da021\``
    )
    await queryRunner.query(`DROP TABLE \`bill\``)
    await queryRunner.query(`DROP TABLE \`bill_order\``)
  }
}
