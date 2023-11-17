import { faker } from '@faker-js/faker';
import { LoginDto } from '@/auth/dto/login.dto';

export const mockLoginDto = ({ document = null, password = null, email = null} = {}): LoginDto => ({
    document: document || '81102759000187', // valid cnpj
    password: password || 'S0me_pass!',
    email: email || faker.internet.email()
});