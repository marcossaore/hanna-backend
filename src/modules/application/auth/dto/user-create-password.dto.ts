import { IsNotEmpty } from 'class-validator'
import { IsStrongPass } from '@/validations/password.validator'
import { IsEqual } from '@/validations/IsEqual.validator'

export class UserCreatePasswordDto {
  @IsStrongPass()
  @IsNotEmpty({
    message: JSON.stringify({
      message: 'A senha deve ser informada!',
      field: 'password'
    })
  })
  readonly password: string

  @IsEqual('password', {
    message: JSON.stringify({
      message: 'A confirmação de senha deve ser igual a senha!',
      field: 'confirmPassword'
    })
  })
  readonly confirmPassword: string
}
