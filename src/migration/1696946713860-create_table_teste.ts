import { MigrationInterface, QueryRunner } from "typeorm"

export class CreateTableTeste1696946713860 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        queryRunner.query(`
        CREATE TABLE teste (
            id INT AUTO_INCREMENT PRIMARY KEY,
            nome VARCHAR(50) NOT NULL,
            email VARCHAR(100) NOT NULL,
            idade INT,
            data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
        
        `)
    }

    public async down(queryRunner: QueryRunner): Promise<void> {

        queryRunner.query(`drop table teste;`)
    }

}
