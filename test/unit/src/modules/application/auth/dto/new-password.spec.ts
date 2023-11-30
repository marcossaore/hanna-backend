import 'reflect-metadata';
import { mockNewPasswordDto } from '../../../../../mock/auth.mock';
import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { NewPasswordDto } from '@/modules/application/auth/dto/new-password.dto';

describe('Dto:  NewPasswordDto', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should return all errors when data is not provided', async () => {
        const validation = plainToInstance(NewPasswordDto, {});
        const errors = await validate(validation);
        expect(errors[0].constraints.isNotEmpty).toEqual(
            '{"message":"A senha deve ser informado!","field":"password"}',
        );
        expect(errors[0].constraints.isString).toEqual(
            '{"message":"A senha deve ser \\"string\\"!","field":"password"}',
        );
        expect(errors[0].constraints.isStrongPass).toEqual(
            'A senha deve conter no mínimo 8 caracteres, com ao menos 1 letra maíuscula, 1 minúscula, 1 digit e 1 caracteres especial (*?!...)',
        );
        expect(errors[1].constraints.isNotEmpty).toEqual(
            '{"message":"A confirmação de senha deve ser informada!","field":"confirmPassword"}',
        );
        expect(errors[1].constraints.isString).toEqual(
            '{"message":"A confirmação de senha deve ser \\"string\\"!","field":"confirmPassword"}',
        );
        expect(errors.length).toEqual(2);
    });

    it('should return error when password and confirmPassword are invalid', async () => {
        const data = mockNewPasswordDto({
            password: 'invalid',
            confirmPassword: 'invalid',
        });
        const validation = plainToInstance(NewPasswordDto, data);
        const errors = await validate(validation);
        expect(errors[0].constraints.isStrongPass).toEqual(
            'A senha deve conter no mínimo 8 caracteres, com ao menos 1 letra maíuscula, 1 minúscula, 1 digit e 1 caracteres especial (*?!...)',
        );
        expect(errors.length).toEqual(1);
    });

    it('should return error when password is not equals password', async () => {
        const data = mockNewPasswordDto({ password: 'confirm' });
        const validation = plainToInstance(NewPasswordDto, data);
        const errors = await validate(validation);
        expect(errors[0].constraints.isStrongPass).toEqual(
            'A senha deve conter no mínimo 8 caracteres, com ao menos 1 letra maíuscula, 1 minúscula, 1 digit e 1 caracteres especial (*?!...)',
        );
        expect(errors[1].constraints.isEquals).toEqual(
            '{"message":"A confirmação de senha deve ser igual a senha!","field":"confirmPassword"}',
        );
        expect(errors.length).toEqual(2);
    });

    it('should return error when confirmPassword is not equals password', async () => {
        const data = mockNewPasswordDto({ confirmPassword: 'confirm' });
        const validation = plainToInstance(NewPasswordDto, data);
        const errors = await validate(validation);
        expect(errors[0].constraints.isEquals).toEqual(
            '{"message":"A confirmação de senha deve ser igual a senha!","field":"confirmPassword"}',
        );
        expect(errors.length).toEqual(1);
    });

    it('should not return when succeds password and confirmPassword are equals', async () => {
        const data = mockNewPasswordDto();
        const validation = plainToInstance(NewPasswordDto, data);
        const errors = await validate(validation);
        expect(errors.length).toEqual(0);
    });
});
