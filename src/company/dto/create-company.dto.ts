import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { IsCnpj } from '../../_common/validations/cnpj.validator';
import { IsCpf } from '../../_common/validations/cpf.validator';
import { IsPhone } from '../../_common/validations/phone.validator';
import { IsCompanyIdentifier } from '../../_common/validations/company/company-identifier.validator';
import { AdminCompany } from '../admin/admin-company';

export class CreateCompanyDto {
    
    @IsString({message: JSON.stringify({message: 'O nome da empresa deve ser "string"!', field: 'name'})})
    @IsNotEmpty({message: JSON.stringify({message: 'O nome da empresa deve ser informado!', field: 'name'})})
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

    @IsEmail({}, {message: JSON.stringify({message: 'O email do sócio não é válido!', field: 'email'})})
    @IsString({message: JSON.stringify({message: 'O email do sócio deve ser "string"!', field: 'email'})})
    @IsNotEmpty({message: JSON.stringify({message: 'O email do sócio deve ser informado!', field: 'email'})})
    readonly email: string;

    readonly admins: AdminCompany[];
}
