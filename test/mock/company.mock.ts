import { faker } from '@faker-js/faker';
import { CompanyStatus } from '@/_common/enums/company-status.enum';
import { CreateCompanyToEntity } from '@/tenant/dto/create-company-to-entity.dto';
import { CreateCompanyDto } from '@/tenant/dto/create-company.dto';
import { Company } from '@infra/db/app/entities/company/company.entity';

export const mockCreateCompanyDto = ({ document = null, partnerDocument = null, phone = null, email = null, companyIdentifier = null } = {}): CreateCompanyDto => ({
    name: faker.company.name(),
    document: document || '81102759000187', // valid cnpj
    partnerName: faker.internet.userName(),
    partnerDocument: partnerDocument || '02020957035', // valid cpf
    companyIdentifier: companyIdentifier || faker.string.alphanumeric({ length: 10 }),
    phone: phone || faker.string.numeric({ length: 11 }),
    email: email || faker.internet.email()
});

export const mockCreateCompanyToEntityDto = ({ document = null, partnerDocument = null, phone = null, email = null, companyIdentifier = null } = {}): CreateCompanyToEntity => ({
    name: faker.company.name(),
    document: document || '81102759000187', // valid cnpj
    partnerName: faker.internet.userName(),
    partnerDocument: partnerDocument || '02020957035', // valid cpf
    companyIdentifier: companyIdentifier || faker.string.alphanumeric({ length: 10 }),
    phone: phone || faker.string.numeric({ length: 11 }),
    email: email || faker.internet.email(),
    uuid: faker.string.uuid()
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
    createdAt: faker.date.anytime(),
    updatedAt: faker.date.anytime(),
    status: CompanyStatus.PENDING
});
