import { Type } from "class-transformer";
import { IsEmail, IsNotEmpty, IsOptional, IsString, ValidateNested } from "class-validator";
import { IsPhone } from "@/_common/validations/phone.validator";
import { CreateAddressDto } from "@/address/dto/create-address.dto";


export class CreateCustomerDto {
    @IsString({message: JSON.stringify({ message: 'O nome do cliente deve ser "string"!', field: 'name' })})
    @IsNotEmpty({message: JSON.stringify({ message: 'O nome do cliente deve ser informado!', field: 'name' })})
    readonly name: string;

    @IsPhone({message: JSON.stringify({message: 'O telefone do cliente deve ser informado! Ex: 31999999999', field: 'phone'})})
    readonly phone: string;

    @IsEmail({}, {message: JSON.stringify({message: 'O email do cliente não é válido!', field: 'email'})})
    @IsString({message: JSON.stringify({message: 'O email do cliente deve ser "string"!', field: 'email'})})
    @IsOptional()
    readonly email: string;

    @ValidateNested()
    @Type(() => CreateAddressDto)
    @IsNotEmpty({message: JSON.stringify({message: 'O endereço do cliente deve ser informado!', field: 'address'})})
    address: CreateAddressDto;
}
