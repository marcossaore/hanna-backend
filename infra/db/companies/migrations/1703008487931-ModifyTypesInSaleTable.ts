import { MigrationInterface, QueryRunner } from 'typeorm'

export class ModifyTypesInSaleTable1703008487931 implements MigrationInterface {
  name = 'ModifyTypesInSaleTable1703008487931'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`sales\` ADD \`originalAmount\` int NOT NULL`
    )
    await queryRunner.query(
      `ALTER TABLE \`product\` DROP COLUMN \`quantityKgActual\``
    )
    await queryRunner.query(
      `ALTER TABLE \`product\` ADD \`quantityKgActual\` float NOT NULL DEFAULT '0'`
    )
    await queryRunner.query(`ALTER TABLE \`sales\` DROP COLUMN \`fee\``)
    await queryRunner.query(`ALTER TABLE \`sales\` ADD \`fee\` float NULL`)
    await queryRunner.query(`ALTER TABLE \`sales\` DROP COLUMN \`discount\``)
    await queryRunner.query(`ALTER TABLE \`sales\` ADD \`discount\` float NULL`)
    await queryRunner.query(
      `ALTER TABLE \`sales\` CHANGE \`amount\` \`amount\` int NOT NULL`
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`sales\` CHANGE \`amount\` \`amount\` int NULL`
    )
    await queryRunner.query(`ALTER TABLE \`sales\` DROP COLUMN \`discount\``)
    await queryRunner.query(`ALTER TABLE \`sales\` ADD \`discount\` int NULL`)
    await queryRunner.query(`ALTER TABLE \`sales\` DROP COLUMN \`fee\``)
    await queryRunner.query(`ALTER TABLE \`sales\` ADD \`fee\` int NULL`)
    await queryRunner.query(
      `ALTER TABLE \`product\` DROP COLUMN \`quantityKgActual\``
    )
    await queryRunner.query(
      `ALTER TABLE \`product\` ADD \`quantityKgActual\` int NOT NULL DEFAULT '0'`
    )
    await queryRunner.query(
      `ALTER TABLE \`sales\` DROP COLUMN \`originalAmount\``
    )
  }
}
