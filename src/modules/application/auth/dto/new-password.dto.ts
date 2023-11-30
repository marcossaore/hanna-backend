import { IsNotEmpty, IsString } from 'class-validator';
import { IsStrongPass } from '@/validations/password.validator';
import { IsEqual } from '@/validations/IsEqual.validator';

export class NewPasswordDto {
    // improve this method
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

    @IsString({
        message: JSON.stringify({
            message: 'A confirmação de senha deve ser "string"!',
            field: 'confirmPassword',
        }),
    })
    @IsNotEmpty({
        message: JSON.stringify({
            message: 'A confirmação de senha deve ser informada!',
            field: 'confirmPassword',
        }),
    })
    @IsEqual('password', {
        message: JSON.stringify({
            message: 'A confirmação de senha deve ser igual a senha!',
            field: 'confirmPassword',
        }),
    })
    readonly confirmPassword: string;
}
