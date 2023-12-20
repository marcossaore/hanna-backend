import { MigrationInterface, QueryRunner } from 'typeorm'

export class UpdateProductTable1702864447003 implements MigrationInterface {
  name = 'UpdateProductTable1702864447003'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`product\` ADD \`quantity\` int NOT NULL`
    )
    await queryRunner.query(
      `ALTER TABLE \`product\` ADD \`quantityKg\` int NULL`
    )
    await queryRunner.query(
      `ALTER TABLE \`product\` ADD \`quantityKgActual\` int NOT NULL DEFAULT '0'`
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`product\` DROP COLUMN \`quantityKgActual\``
    )
    await queryRunner.query(
      `ALTER TABLE \`product\` DROP COLUMN \`quantityKg\``
    )
    await queryRunner.query(`ALTER TABLE \`product\` DROP COLUMN \`quantity\``)
  }
}
