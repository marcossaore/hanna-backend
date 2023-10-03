import { IsEmail, IsNotEmpty, IsString, IsStrongPassword, Length, MinLength } from 'class-validator';
import { IsCnpj } from '../../validations/cnpj.validator';
import { IsCpf } from '../../validations/cpf.validator';
import { IsPhone } from '../../validations/phone.validator';
import { IsCompanyIdentifier } from '../../validations/company-identifier.validator';

export class CreateCompanyDto {
    @IsNotEmpty({ message: 'O nome da empresa deve ser informado!'})
    @IsString({ message: 'O nome da empresa deve ser "string"!' })
    readonly name: string;

    @IsCnpj({message: 'O CNPJ não é válido!'})
    readonly document: string;

    @IsNotEmpty({ message: 'O nome do sócio deve ser informado!'})
    @IsString({ message: 'O nome do sócio deve ser "string"!' })
    readonly partnerName: string;

    @IsCpf({message: 'O CPF do sócio não é valido!'})
    readonly partnerDocument: string;

    @IsCompanyIdentifier()
    readonly companyIdentifier: string;

    @IsPhone({ message: 'O telefone do sócio deve ser informado! Ex: 31999999999'})
    readonly phone: string;

    @IsNotEmpty({ message: 'O email do sócio deve ser informado!'})
    @IsEmail({ }, { message: 'O email do sócio não é válido!' })
    readonly email: string;
}
