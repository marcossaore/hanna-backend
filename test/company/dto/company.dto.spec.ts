import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { mockCompanyDto } from '../company.mock';

import { CreateCompanyDto } from '../../../src/company/dto/create-company.dto';

describe('Dto:  CreateCompany', () => {
    afterEach(() => {
        jest.clearAllMocks();
    })

    it('should return all erros when data is no provided', async () => {
        const validation = plainToInstance(CreateCompanyDto, { });
        const errors = await validate(validation);
        expect(errors[0].constraints.isNotEmpty).toEqual('O nome da empresa deve ser informado!');
        expect(errors[0].constraints.isString).toEqual('O nome da empresa deve ser "string"!');
        expect(errors[1].constraints.isCnpj).toEqual('O CNPJ não é válido!');
        expect(errors[2].constraints.isNotEmpty).toEqual('O nome do sócio deve ser informado!');
        expect(errors[2].constraints.isString).toEqual('O nome do sócio deve ser "string"!');
        expect(errors[3].constraints.isCpf).toEqual('O CPF do sócio não é valido!');
        expect(errors[4].constraints.isCompanyIdentifier).toEqual('A identificação única da empresa deve ser informada!');
        expect(errors[5].constraints.isPhone).toEqual('O telefone do sócio deve ser informado! Ex: 31999999999');
        expect(errors[6].constraints.isEmail).toEqual('O email do sócio não é válido!');
        expect(errors.length).toEqual(7);
    });

    it('should return error when cpf is invalid', async () => {
        const validation = plainToInstance(CreateCompanyDto, mockCompanyDto({ partnerDocument: '12345678911'}));
        const errors = await validate(validation);
        expect(errors[0].constraints.isCpf).toEqual('O CPF do sócio não é valido!');
        expect(errors.length).toEqual(1);
    });

    it('should return error when companyIdentifier is less than 6', async () => {
        const validation = plainToInstance(CreateCompanyDto, mockCompanyDto({ companyIdentifier: 'my_id' }));
        const errors = await validate(validation);
        expect(errors[0].constraints.isCompanyIdentifier).toEqual('A identificação única da empresa deve ter no mínimo 6 e máximo 12 caracteres!');
        expect(errors.length).toEqual(1);
    });

    it('should return error when companyIdentifier is greater than 12', async () => {
        const validation = plainToInstance(CreateCompanyDto, mockCompanyDto({ companyIdentifier: 'has_more_than_12_chars' }));
        const errors = await validate(validation);
        expect(errors[0].constraints.isCompanyIdentifier).toEqual('A identificação única da empresa deve ter no mínimo 6 e máximo 12 caracteres!');
        expect(errors.length).toEqual(1);
    });

    it('should return error when companyIdentifier is has spaces in it', async () => {
        const validation = plainToInstance(CreateCompanyDto, mockCompanyDto({ companyIdentifier: 'has espace' }));
        const errors = await validate(validation);
        expect(errors[0].constraints.isCompanyIdentifier).toEqual('A identificação única da empresa não deve conter espaços!');
        expect(errors.length).toEqual(1);
    });


    it('should return error when cnpj is invalid', async () => {
        const validation = plainToInstance(CreateCompanyDto, mockCompanyDto({ document: '12345678911'}));
        const errors = await validate(validation);
        expect(errors[0].constraints.isCnpj).toEqual('O CNPJ não é válido!');
        expect(errors.length).toEqual(1);
    });

    it('should return error when phone is invalid', async () => {
        const validation = plainToInstance(CreateCompanyDto, mockCompanyDto({ phone: '32'}));
        const errors = await validate(validation);
        expect(errors[0].constraints.isPhone).toEqual('O telefone do sócio deve ser informado! Ex: 31999999999');
        expect(errors.length).toEqual(1);
    });

    it('should return error when email is invalid', async () => {
        const validation = plainToInstance(CreateCompanyDto, mockCompanyDto({ email: 'invalid_email' }));
        const errors = await validate(validation);
        expect(errors[0].constraints.isEmail).toEqual('O email do sócio não é válido!');
        expect(errors.length).toEqual(1);
    });
});