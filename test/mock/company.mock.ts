import { faker } from '@faker-js/faker';
import { CreateCompanyDto } from '../../src/company/dto/create-company.dto';
import { CreateCompanyToEntity } from '../../src/company/dto/create-company-to-entity.dto';
import { Company } from '../../src/company/entities/company.entity';
import { AdminCompany } from '../../src/company/entities/admin-company.entity';
import { AdminCompany as AddCompanyInterface } from '../../src/company/admin/admin-company';

export const mockCreateCompanyDto = ({ document = null, partnerDocument = null, phone = null, email = null, companyIdentifier = null } = {}): CreateCompanyDto => ({
    name: faker.company.name(),
    document: document || '81102759000187', // valid cnpj
    partnerName: faker.internet.userName(),
    partnerDocument: partnerDocument || '02020957035', // valid cpf
    companyIdentifier: companyIdentifier || faker.string.alphanumeric({ length: 10 }),
    phone: phone || faker.string.numeric({ length: 11 }),
    email: email || faker.internet.email(),
    admins: [
        {
            name: faker.internet.userName(),
            email: faker.internet.email(),
            password: faker.internet.password()
        },
        {
            name: faker.internet.userName(),
            email: faker.internet.email(),
            password: faker.internet.password()
        }
    ]
});

export const mockCreateCompanyToEntityDto = ({ document = null, partnerDocument = null, phone = null, email = null, companyIdentifier = null } = {}): CreateCompanyToEntity => ({
    name: faker.company.name(),
    document: document || '81102759000187', // valid cnpj
    partnerName: faker.internet.userName(),
    partnerDocument: partnerDocument || '02020957035', // valid cpf
    companyIdentifier: companyIdentifier || faker.string.alphanumeric({ length: 10 }),
    phone: phone || faker.string.numeric({ length: 11 }),
    email: email || faker.internet.email(),
    uuid: faker.string.uuid(),
    apiToken: faker.string.uuid(),
});

export const mockCompanyEntity = ({ document = null, partnerDocument = null, phone = null, email = null, companyIdentifier = null } = {}): Company => ({
    name: faker.company.name(),
    document: document || faker.string.numeric({ length: 14 }),
    partnerName: faker.internet.userName(),
    partnerDocument: partnerDocument || faker.string.numeric({ length: 11 }),
    companyIdentifier: companyIdentifier || faker.company.buzzNoun(),
    phone: phone || faker.phone.number(),
    email: email || faker.internet.email(),
    uuid: faker.string.uuid(),
    id: faker.number.int(),
    apiToken: faker.string.uuid(),
    db: faker.company.buzzNoun(),
    dbPass: faker.string.alphanumeric({ length: 6}),
    dbUser: faker.string.alphanumeric({ length: 6}),
    createdAt: faker.date.anytime(),
    updatedAt: faker.date.anytime(),
    admins: [] as AdminCompany[]
});

export const mockAdmin = (): AddCompanyInterface => (
    {
        password: faker.string.alphanumeric({ length: 11 }),
        email: faker.internet.email(),
        name: faker.internet.userName()
    }
);

export const mockAdminEntity = (): AdminCompany => (
    {
        id: faker.number.int(),
        email: faker.internet.email(),
        password: faker.string.alphanumeric({ length: 10 }),
        name: faker.internet.userName(),
        createdAt: faker.date.anytime(),
        updatedAt: faker.date.anytime(),
        company: {} as Company
    }
);
