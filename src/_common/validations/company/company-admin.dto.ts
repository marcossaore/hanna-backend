import { IsEmail, IsNotEmpty, IsString } from "class-validator";
import { IsCpf } from "../cpf.validator";

export class CompanyAdminDto {
    @IsNotEmpty({message: JSON.stringify({message: 'O nome do admin deve ser informado!', field: 'name'})})
    @IsString({message: JSON.stringify({message: 'O nome do admin deve ser "string"!', field: 'name'})})
    readonly name: string;

    @IsCpf({message: JSON.stringify({message: 'O CPF do admin não é valido!', field: 'partnerDocument'})})
    readonly document: string;

    @IsNotEmpty({message: JSON.stringify({message: 'O email do admin deve ser informado!', field: 'email'})})
    @IsEmail({}, {message: JSON.stringify({message: 'O email do admin não é válido!', field: 'email'})})
    readonly email: string;
}
