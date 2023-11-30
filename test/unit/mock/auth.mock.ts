import { faker } from '@faker-js/faker';
import { LoginDto } from '@/modules/application/auth/dto/login.dto';
import { UserCreatePasswordDto } from '@/modules/application/auth/dto/user-create-password.dto';

export const mockLoginDto = ({
    document = null,
    password = null,
    email = null,
} = {}): LoginDto => ({
    document: document || '81102759000187', // valid cnpj
    password: password || 'S0me_pass!',
    email: email || faker.internet.email(),
});

export const mockUserCreatePasswordDto = ({
    password = null,
    confirmPassword = null,
} = {}): UserCreatePasswordDto => ({
    password: password || 'S0me_pass!',
    confirmPassword: confirmPassword || 'S0me_pass!',
});
