import 'reflect-metadata';
import { mockUserCreatePasswordDto } from '../../../../../mock/auth.mock';
import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { UserCreatePasswordDto } from '@/modules/application/auth/dto/user-create-password.dto';

describe('Dto:  UserCreatePasswordDto', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should return all errors when data is not provided', async () => {
        const validation = plainToInstance(UserCreatePasswordDto, {});
        const errors = await validate(validation);
        expect(errors[0].constraints.isNotEmpty).toEqual(
            '{"message":"A senha deve ser informada!","field":"password"}',
        );
        expect(errors[0].constraints.isString).toEqual(
            '{"message":"A senha deve ser \\"string\\"!","field":"password"}',
        );
        expect(errors[0].constraints.isStrongPass).toEqual(
            '{"message":"A senha deve conter no mínimo 8 caracteres, com ao menos 1 letra maíuscula, 1 minúscula, 1 dígito e 1 caracter especial (*?!...)","field":"password"}',
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
        const data = mockUserCreatePasswordDto({
            password: 'invalid',
            confirmPassword: 'invalid',
        });
        const validation = plainToInstance(UserCreatePasswordDto, data);
        const errors = await validate(validation);
        expect(errors[0].constraints.isStrongPass).toEqual(
            '{"message":"A senha deve conter no mínimo 8 caracteres, com ao menos 1 letra maíuscula, 1 minúscula, 1 dígito e 1 caracter especial (*?!...)","field":"password"}',
        );
        expect(errors.length).toEqual(1);
    });

    it('should return error when password is not equals password', async () => {
        const data = mockUserCreatePasswordDto({ password: 'confirm' });
        const validation = plainToInstance(UserCreatePasswordDto, data);
        const errors = await validate(validation);
        expect(errors[0].constraints.isStrongPass).toEqual(
            '{"message":"A senha deve conter no mínimo 8 caracteres, com ao menos 1 letra maíuscula, 1 minúscula, 1 dígito e 1 caracter especial (*?!...)","field":"password"}',
        );
        expect(errors[1].constraints.isEquals).toEqual(
            '{"message":"A confirmação de senha deve ser igual a senha!","field":"confirmPassword"}',
        );
        expect(errors.length).toEqual(2);
    });

    it('should return error when confirmPassword is not equals password', async () => {
        const data = mockUserCreatePasswordDto({ confirmPassword: 'confirm' });
        const validation = plainToInstance(UserCreatePasswordDto, data);
        const errors = await validate(validation);
        expect(errors[0].constraints.isEquals).toEqual(
            '{"message":"A confirmação de senha deve ser igual a senha!","field":"confirmPassword"}',
        );
        expect(errors.length).toEqual(1);
    });

    it('should not return when succeds password and confirmPassword are equals', async () => {
        const data = mockUserCreatePasswordDto();
        const validation = plainToInstance(UserCreatePasswordDto, data);
        const errors = await validate(validation);
        expect(errors.length).toEqual(0);
    });
});
