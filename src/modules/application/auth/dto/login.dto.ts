import { IsEmail, IsNotEmpty } from 'class-validator'
import { IsCnpj } from '@/validations/cnpj.validator'
import { IsStrongPass } from '@/validations/password.validator'

export class LoginDto {
  @IsCnpj({
    message: JSON.stringify({
      message: 'O CNPJ não é válido!',
      field: 'document'
    })
  })
  readonly document: string

  @IsEmail(
    {},
    {
      message: JSON.stringify({
        message: 'O email não é válido!',
        field: 'email'
      })
    }
  )
  @IsNotEmpty({
    message: JSON.stringify({
      message: 'O email deve ser informado!',
      field: 'email'
    })
  })
  readonly email: string

  @IsStrongPass()
  @IsNotEmpty({
    message: JSON.stringify({
      message: 'A senha deve ser informado!',
      field: 'password'
    })
  })
  readonly password: string
}
