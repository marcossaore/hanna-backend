import { faker } from '@faker-js/faker';
import { LoginDto } from '@/modules/application/auth/dto/login.dto';
import { NewPasswordDto } from '@/modules/application/auth/dto/new-password.dto';

export const mockLoginDto = ({
    document = null,
    password = null,
    email = null,
} = {}): LoginDto => ({
    document: document || '81102759000187', // valid cnpj
    password: password || 'S0me_pass!',
    email: email || faker.internet.email(),
});

export const mockNewPasswordDto = ({
    password = null,
    confirmPassword = null,
} = {}): NewPasswordDto => ({
    password: password || 'S0me_pass!',
    confirmPassword: confirmPassword || 'S0me_pass!',
});
