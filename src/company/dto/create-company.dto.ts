import { IsString } from 'class-validator';

export class CreateCompanyDto {
  @IsString()
  readonly name: string;
}
