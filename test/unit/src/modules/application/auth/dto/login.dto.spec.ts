import 'reflect-metadata';
import { mockLoginDto } from '../../../../../mock/auth.mock';
import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { LoginDto } from '@/modules/application/auth/dto/login.dto';

describe('Dto:  LoginDto', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should return all errors when data is not provided', async () => {
        const validation = plainToInstance(LoginDto, {});
        const errors = await validate(validation);
        expect(errors[0].constraints.isCnpj).toEqual(
            '{"message":"O CNPJ não é válido!","field":"document"}',
        );
        expect(errors[1].constraints.isEmail).toEqual(
            '{"message":"O email não é válido!","field":"email"}',
        );
        expect(errors[1].constraints.isNotEmpty).toEqual(
            '{"message":"O email deve ser informado!","field":"email"}',
        );
        expect(errors[1].constraints.isString).toEqual(
            '{"message":"O email deve ser \\"string\\"!","field":"email"}',
        );
        expect(errors[2].constraints.isNotEmpty).toEqual(
            '{"message":"A senha deve ser informado!","field":"password"}',
        );
        expect(errors[2].constraints.isString).toEqual(
            '{"message":"A senha deve ser \\"string\\"!","field":"password"}',
        );
        expect(errors[2].constraints.isStrongPass).toEqual(
            'A senha deve conter no mínimo 8 caracteres, com ao menos 1 letra maíuscula, 1 minúscula, 1 digit e 1 caracteres especial (*?!...)',
        );
        expect(errors.length).toEqual(3);
    });

    it('should return error when document is invalid', async () => {
        const data = mockLoginDto({ document: 'invalid' });
        const validation = plainToInstance(LoginDto, data);
        const errors = await validate(validation);
        expect(errors[0].constraints.isCnpj).toEqual(
            '{"message":"O CNPJ não é válido!","field":"document"}',
        );
        expect(errors.length).toEqual(1);
    });

    it('should return error when password does not match length', async () => {
        const data = mockLoginDto({ password: 'invalid' });
        const validation = plainToInstance(LoginDto, data);
        const errors = await validate(validation);
        expect(errors[0].constraints.isStrongPass).toEqual(
            'A senha deve conter no mínimo 8 caracteres, com ao menos 1 letra maíuscula, 1 minúscula, 1 digit e 1 caracteres especial (*?!...)',
        );
        expect(errors.length).toEqual(1);
    });

    it('should return error when password is greather thant 8 chars but is invalid', async () => {
        const data = mockLoginDto({ password: 'invalid_password' });
        const validation = plainToInstance(LoginDto, data);
        const errors = await validate(validation);
        expect(errors[0].constraints.isStrongPass).toEqual(
            'A senha deve conter no mínimo 8 caracteres, com ao menos 1 letra maíuscula, 1 minúscula, 1 digit e 1 caracteres especial (*?!...)',
        );
        expect(errors.length).toEqual(1);
    });

    it('should return error when password is greather thant 8 chars but is invalid', async () => {
        const data = mockLoginDto({ password: 'invalid_password' });
        const validation = plainToInstance(LoginDto, data);
        const errors = await validate(validation);
        expect(errors[0].constraints.isStrongPass).toEqual(
            'A senha deve conter no mínimo 8 caracteres, com ao menos 1 letra maíuscula, 1 minúscula, 1 digit e 1 caracteres especial (*?!...)',
        );
        expect(errors.length).toEqual(1);
    });

    it('should not return when succeds password is greather than 8 chars and it is correct', async () => {
        const validation = plainToInstance(
            LoginDto,
            mockLoginDto({ password: 'S0me_pass_T3sT**!' }),
        );
        const errors = await validate(validation);
        expect(errors.length).toEqual(0);
    });

    it('should return when email is invalid', async () => {
        const validation = plainToInstance(
            LoginDto,
            mockLoginDto({ email: 'invalid_email' }),
        );
        const errors = await validate(validation);
        expect(errors[0].constraints.isEmail).toEqual(
            '{"message":"O email não é válido!","field":"email"}',
        );
        expect(errors.length).toEqual(1);
    });

    it('should not return when succeds', async () => {
        const validation = plainToInstance(LoginDto, mockLoginDto());
        const errors = await validate(validation);
        expect(errors.length).toEqual(0);
    });
});
