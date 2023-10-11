import { faker } from '@faker-js/faker';
import { CreateCompanyDto } from '../../src/company/dto/create-company.dto';
import { CreateCompanyToEntity } from '../../src/company/dto/create-company-to-entity.dto';
import { Company } from '../../db/app/entities/company/company.entity';
import { AdminCompany } from '../../db/app/entities/company/admin-company.entity';
import { CompanyStatus } from '../../src/_common/enums/company-status.enum';
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
    dbPass: faker.string.alphanumeric({ length: 6}),
    dbUser: faker.string.alphanumeric({ length: 6}),
    createdAt: faker.date.anytime(),
    updatedAt: faker.date.anytime(),
    status: CompanyStatus.PENDING,
    admins: [
        {
            id: faker.number.int(),
            name: faker.internet.userName(),
            email: faker.internet.email(),
            password: faker.internet.password(),
            createdAt: faker.date.anytime(),
            updatedAt: faker.date.anytime(),
            company: {} as Company
        },
        {
            id: faker.number.int(),
            name: faker.internet.userName(),
            email: faker.internet.email(),
            password: faker.internet.password(),
            createdAt: faker.date.anytime(),
            updatedAt: faker.date.anytime(),
            company: {} as Company
        }
    ]
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
