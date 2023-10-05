import { IsEmail, IsNotEmpty, IsString } from "class-validator";
import { IsCpf } from "../../_common/validations/cpf.validator";

export class AdminCompanyDto {
    @IsString({message: JSON.stringify({message: 'O nome do admin deve ser do tipo "string"!', field: 'name'})})
    @IsNotEmpty({message: JSON.stringify({message: 'O nome do admin deve ser informado!', field: 'name'})})
    readonly name: string;

    @IsCpf({message: JSON.stringify({message: 'O CPF do admin não é valido!', field: 'document'})})
    @IsNotEmpty({message: JSON.stringify({message: 'O cpf do admin deve ser informado!', field: 'document'})})
    readonly document: string;

    @IsEmail({}, {message: JSON.stringify({message: 'O email do admin não é válido!', field: 'email'})})
    @IsNotEmpty({message: JSON.stringify({message: 'O email do admin deve ser informado!', field: 'email'})})
    readonly email: string;
}
