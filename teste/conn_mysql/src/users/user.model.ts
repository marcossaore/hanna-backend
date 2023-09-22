import { Table, Column, Model, PrimaryKey, AutoIncrement } from 'sequelize-typescript';

@Table({ tableName: 'users', timestamps: false }) 
export class User extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column
  id: number;

  @Column
  nome: string;
}

