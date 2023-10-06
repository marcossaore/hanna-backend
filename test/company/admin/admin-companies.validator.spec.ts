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
        expect(response).toEqual({"field": "admins[0].name", "message": "O nome do admin deve ser informado!", "type": "Bad Request"});
    });

    it('should return error when admins[*].name is not provided', async () => {
        const executed = await sutAdminCompaniesValidator.handle([
            {
                password: 'any_password',
                email: 'any_email',
                name: undefined
            }
        ]);
        const response = (executed as DefaultHttpException).getResponse() as any;
        expect(response).toEqual({"field": "admins[0].name", "message": "O nome do admin deve ser informado!", "type": "Bad Request"});
    });

    it('should return error when admin[*].email is not provided', async () => {
        const executed = await sutAdminCompaniesValidator.handle([
            {
                password: 'any_password',
                email: undefined,
                name: 'any_name'
            }
        ]);
        const response = (executed as DefaultHttpException).getResponse() as any;
        expect(response).toEqual({"field": "admins[0].email", "message": "O email do admin deve ser informado!", "type": "Bad Request"});
    });

    it('should return error when admins[*].email is not valid', async () => {
        const executed = await sutAdminCompaniesValidator.handle([
            {
                password: 'any_password',
                email: 'any_email',
                name: 'any_name'
            }
        ]);
        const response = (executed as DefaultHttpException).getResponse() as any;
        expect(response).toEqual({"field": "admins[0].email", "message": "O email do admin não é válido!", "type": "Bad Request"});
    });

    
    it('should return error when admins have same email in their scope', async () => {
        const executed = await sutAdminCompaniesValidator.handle([
            {
                password: 'Ab1*Ab1*',
                email: 'mail@mail.com',
                name: faker.internet.userName()
            },
            {
                password: 'Ab1*Ab1*',
                email: 'mail@mail.com',
                name: faker.internet.userName()
            }
        ]);
        const response = (executed as DefaultHttpException).getResponse() as any;
        expect(response).toEqual({"field": "admins[1].email", "message": "Não pode haver dois ou mais admins cadastrados para a empresa com o mesmo email!", "type": "Bad Request"});
    });

    it('should return error when admins[*].password is not provided', async () => {
        const executed = await sutAdminCompaniesValidator.handle([
            {
                password: undefined,
                email: 'any_email',
                name: 'any_name'
            }
        ]);
        const response = (executed as DefaultHttpException).getResponse() as any;
        expect(response).toEqual({"field": "admins[0].email", "message": "O email do admin não é válido!", "type": "Bad Request"});
    });

    it('should return error when admins[*].password is not valid', async () => {
        const executed = await sutAdminCompaniesValidator.handle([
            {
                password: 'any_password',
                email: 'mail@mail.com',
                name: 'any_name'
            }
        ]);
        const response = (executed as DefaultHttpException).getResponse() as any;
        expect(response).toEqual({"field": "admins[0].password", "message": "A senha precisa ter no mínimo 8 caracteres, contendo pelo menos 1 letra maíuscula, 1 letra minúscula, 1 dígito e 1 caracter especial EX:($*!@)", "type": "Bad Request"});
    });

    it('should not return error when succeds', async () => {
        const executed = await sutAdminCompaniesValidator.handle([
            {
                password: 'Ab1*Ab1*',
                email: faker.internet.email(),
                name: faker.internet.userName()
            }
        ]);
        expect(executed).toBeFalsy();
    });
});