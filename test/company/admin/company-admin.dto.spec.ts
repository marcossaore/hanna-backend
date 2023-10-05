import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { AdminCompanyDto } from '../../../src/company/admin/admin-company.dto';

describe('Dto: CompanyAdminDto', () => {
    afterEach(() => {
        jest.clearAllMocks();
    })

    it('should return all erros when data is no provided', async () => {
        const validation = plainToInstance(AdminCompanyDto, { });
        const errors = await validate(validation);
        expect(errors[0].constraints.isNotEmpty).toEqual('{\"message\":\"O nome do admin deve ser informado!\",\"field\":\"name\"}');
        expect(errors[0].constraints.isString).toEqual('{\"message\":\"O nome do admin deve ser do tipo \\\"string\\\"!\",\"field\":\"name\"}');
        expect(errors[1].constraints.isNotEmpty).toEqual('{\"message\":\"O cpf do admin deve ser informado!\",\"field\":\"document\"}');
        expect(errors[1].constraints.isCpf).toEqual('{\"message\":\"O CPF do admin não é valido!\",\"field\":\"document\"}');
        expect(errors[2].constraints.isNotEmpty).toEqual('{\"message\":\"O email do admin deve ser informado!\",\"field\":\"email\"}');
        expect(errors[2].constraints.isEmail).toEqual('{\"message\":\"O email do admin não é válido!\",\"field\":\"email\"}');
        expect(errors.length).toEqual(3);
    });
});