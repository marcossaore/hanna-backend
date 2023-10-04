import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { IsCnpj } from '../../_common/validations/cnpj.validator';
import { IsCpf } from '../../_common/validations/cpf.validator';
import { IsCompanyIdentifier } from '../../_common/validations/company-identifier.validator';
import { IsPhone } from '../../_common/validations/phone.validator';

export class CreateCompanyDto {
    
    @IsNotEmpty({message: JSON.stringify({message: 'O nome da empresa deve ser informado!', field: 'name'})})
    @IsString({message: JSON.stringify({message: 'O nome da empresa deve ser "string"!', field: 'name'})})
    readonly name: string;

    @IsCnpj({message: JSON.stringify({message: 'O CNPJ não é válido!', field: 'document'})})
    readonly document: string;

    @IsNotEmpty({message: JSON.stringify({message: 'O nome do sócio deve ser informado!', field: 'partnerName'})})
    @IsString({message: JSON.stringify({message: 'O nome do sócio deve ser "string"!', field: 'partnerName'})})
    readonly partnerName: string;

    @IsCpf({message: JSON.stringify({message: 'O CPF do sócio não é valido!', field: 'partnerDocument'})})
    readonly partnerDocument: string;

    @IsCompanyIdentifier()
    readonly companyIdentifier: string;

    @IsPhone({message: JSON.stringify({message: 'O telefone do sócio deve ser informado! Ex: 31999999999', field: 'phone'})})
    readonly phone: string;

    @IsNotEmpty({message: JSON.stringify({message: 'O email do sócio deve ser informado!', field: 'email'})})
    @IsEmail({}, {message: JSON.stringify({message: 'O email do sócio não é válido!', field: 'email'})})
    readonly email: string;
}
