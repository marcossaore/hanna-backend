import { faker } from '@faker-js/faker';
import { DefaultHttpException } from '../../../src/_common/errors/default-http-exception';
import { AdminCompaniesValidator } from '../../../src/company/admin/admin-companies.validator';

describe('Validator: AdminCompaniesValidator', () => {
    let sutAdminCompaniesValidator: AdminCompaniesValidator;

    beforeAll(() => {
        sutAdminCompaniesValidator = new AdminCompaniesValidator();
    });

    afterEach(() => {
        jest.clearAllMocks();  
    });

    it('should return error when admins is not provide', async () => {
        const executed = await sutAdminCompaniesValidator.handle(null);
        const response = (executed as DefaultHttpException).getResponse() as any;
        expect(response).toEqual({"field": "admins", "message": "A propriedade \"admins\" deve ser informada!", "type": "Bad Request"});
    });

    it('should return error when admins is not valid array', async () => {
        const executed = await sutAdminCompaniesValidator.handle('any_value' as any);
        const response = (executed as DefaultHttpException).getResponse() as any;
        expect(response).toEqual({"field": "admins", "message": "A propriedade deve ser do tipo \"array\"!", "type": "Bad Request"});
    });

    it('should return error when admins[*] is not provided', async () => {
        const executed = await sutAdminCompaniesValidator.handle([{} as any]);
        const response = (executed as DefaultHttpException).getResponse() as any;
        expect(response).toEqual({"field": "name", "message": "O nome do admin deve ser informado!", "type": "Bad Request"});
    });

    it('should return error when admin[*].document is not provided', async () => {
        const executed = await sutAdminCompaniesValidator.handle([
            {
                document: undefined,
                email: 'any_email',
                name: 'any_name'
            }
        ]);
        const response = (executed as DefaultHttpException).getResponse() as any;
        expect(response).toEqual({"field": "document", "message": "O cpf do admin deve ser informado!", "type": "Bad Request"});
    });

    it('should return error when admin[*].document is invalid', async () => {
        const executed = await sutAdminCompaniesValidator.handle([
            {
                document: 'any_document',
                email: 'any_email',
                name: 'any_name'
            }
        ]);
        const response = (executed as DefaultHttpException).getResponse() as any;
        expect(response).toEqual({"field": "document", "message": "O CPF do admin não é valido!", "type": "Bad Request"});
    });

    it('should return error when admin[*].email is not provided', async () => {
        const executed = await sutAdminCompaniesValidator.handle([
            {
                document: '04008425055',
                email: undefined,
                name: 'any_name'
            }
        ]);
        const response = (executed as DefaultHttpException).getResponse() as any;
        expect(response).toEqual({"field": "email", "message": "O email do admin deve ser informado!", "type": "Bad Request"});
    });

    it('should return error when admin[*].email is not valid', async () => {
        const executed = await sutAdminCompaniesValidator.handle([
            {
                document: '04008425055',
                email: 'any_email',
                name: 'any_name'
            }
        ]);
        const response = (executed as DefaultHttpException).getResponse() as any;
        expect(response).toEqual({"field": "email", "message": "O email do admin não é válido!", "type": "Bad Request"});
    });

    it('should return error when admin[*].name is not provided', async () => {
        const executed = await sutAdminCompaniesValidator.handle([
            {
                document: '04008425055',
                email: 'any_email',
                name: undefined
            }
        ]);
        const response = (executed as DefaultHttpException).getResponse() as any;
        expect(response).toEqual({"field": "name", "message": "O nome do admin deve ser informado!", "type": "Bad Request"});
    });

    it('should not return error when succeds', async () => {
        const executed = await sutAdminCompaniesValidator.handle([
            {
                document: '04008425055',
                email: faker.internet.email(),
                name: faker.internet.userName()
            }
        ]);
        expect(executed).toBeFalsy();
    });
});