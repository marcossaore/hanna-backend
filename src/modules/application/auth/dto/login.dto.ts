import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { IsCnpj } from '@/validations/cnpj.validator';
import { IsStrongPass } from '@/validations/password.validator';

export class LoginDto {
    @IsCnpj({
        message: JSON.stringify({
            message: 'O CNPJ não é válido!',
            field: 'document',
        }),
    })
    readonly document: string;

    @IsEmail(
        {},
        {
            message: JSON.stringify({
                message: 'O email não é válido!',
                field: 'email',
            }),
        },
    )
    @IsString({
        message: JSON.stringify({
            message: 'O email deve ser "string"!',
            field: 'email',
        }),
    })
    @IsNotEmpty({
        message: JSON.stringify({
            message: 'O email deve ser informado!',
            field: 'email',
        }),
    })
    readonly email: string;

    @IsStrongPass(
        'A senha deve conter no mínimo 8 caracteres, com ao menos 1 letra maíuscula, 1 minúscula, 1 digit e 1 caracteres especial (*?!...)',
    )
    @IsString({
        message: JSON.stringify({
            message: 'A senha deve ser "string"!',
            field: 'password',
        }),
    })
    @IsNotEmpty({
        message: JSON.stringify({
            message: 'A senha deve ser informado!',
            field: 'password',
        }),
    })
    readonly password: string;
}
