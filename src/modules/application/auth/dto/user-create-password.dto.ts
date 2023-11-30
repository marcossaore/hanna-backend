import { IsNotEmpty, IsString } from 'class-validator';
import { IsStrongPass } from '@/validations/password.validator';
import { IsEqual } from '@/validations/IsEqual.validator';

export class UserCreatePasswordDto {
    @IsStrongPass()
    @IsString({
        message: JSON.stringify({
            message: 'A senha deve ser "string"!',
            field: 'password',
        }),
    })
    @IsNotEmpty({
        message: JSON.stringify({
            message: 'A senha deve ser informada!',
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
