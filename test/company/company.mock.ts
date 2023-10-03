import { faker } from '@faker-js/faker';
import { CreateCompanyDto } from 'src/company/dto/create-company.dto';

export const mockCompanyDto = ({ document = null, partnerDocument = null, phone = null, email = null, companyIdentifier = null } = {}): CreateCompanyDto => ({
    name: faker.company.name(),
    document: document || '81102759000187', // valid cnpj
    partnerName: faker.internet.userName(),
    partnerDocument: partnerDocument || '02020957035', // valid cpf
    companyIdentifier: companyIdentifier || faker.string.alphanumeric({ length: 10 }),
    phone: phone || faker.string.numeric({ length: 11 }),
    email: email || faker.internet.email()
});

export const mockCompanyEntity = (): any => ({
    uuid: faker.string.uuid(),
    email: faker.internet.email(),
    phone: faker.string.numeric({ length: 11 }),
    document: faker.string.numeric({ length: 14 }),
    partnerName: faker.internet.userName(),
    parterDocument: faker.string.numeric({ length: 11 })
})