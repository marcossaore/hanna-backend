import { IsEmail, IsNotEmpty, IsString } from "class-validator";
import { IsStrongPass } from "../../_common/validations/password.validator";

export class AdminCompanyDto {
    @IsString({message: JSON.stringify({message: 'O nome do admin deve ser do tipo "string"!', field: 'name'})})
    @IsNotEmpty({message: JSON.stringify({message: 'O nome do admin deve ser informado!', field: 'name'})})
    readonly name: string;

    @IsEmail({}, {message: JSON.stringify({message: 'O email do admin não é válido!', field: 'email'})})
    @IsNotEmpty({message: JSON.stringify({message: 'O email do admin deve ser informado!', field: 'email'})})
    readonly email: string;

    @IsStrongPass(
        JSON.stringify({ message: 'A senha precisa ter no mínimo 8 caracteres, contendo pelo menos 1 letra maíuscula, 1 letra minúscula, 1 dígito e 1 caracter especial EX:($*!@)', field: 'password' }),
        {
            minLength: 8,
            requireDigit: true,
            requireLowercase: true,
            requireSpecialChar: true,
            requireUppercase: true
        }
    )
    @IsNotEmpty({message: JSON.stringify({message: 'A senha do admin deve ser informada!', field: 'password'})})
    readonly password: string;
}
