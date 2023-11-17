import { UserUnauthorizedException } from "@/_common/errors/user-unauthorized-exception"

export const userUnauthorized = (message: string = null) => {
    return new UserUnauthorizedException(message || 'O CNPJ, email ou senha são inválidos!', 401)
}