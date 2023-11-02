import { faker } from "@faker-js/faker";
import { CreateCustomerDto } from "../../src/customer/dto/create-customer.dto";
import { Customer } from "../../db/companies/entities/customer/customer.entity";
import { CreateCustomerToEntity } from "src/customer/dto/create-customer-to-entity.dto";

export const mockCreateCustomerWithAddressDto = ({ complement = null, email = null } = {}): CreateCustomerDto => ({
    name: faker.company.name(),
    email: email || faker.internet.email(),
    phone: faker.string.numeric({ length: 11 }),
    address: {
        street: faker.location.streetAddress(),
        neighborhood: faker.location.secondaryAddress(),
        number: faker.string.numeric(),
        city: faker.location.city(),
        country: faker.location.state(),
        state: faker.location.country(),
        complement
    }
});

export const mockCreateCustomerToEntityWithAddressDto = (): CreateCustomerToEntity => ({
    ...mockCreateCustomerWithAddressDto(),
    uuid: faker.string.uuid()
});

export const mockCustomerEntity = ({ email = null, complement = null } = {}): Customer => {
    const customer: Customer = {
        id: faker.number.int(),
        uuid: faker.string.uuid(),
        name: faker.company.name(),
        phone: faker.phone.number(),
        street: faker.location.streetAddress(),
        neighborhood: faker.location.secondaryAddress(),
        number: faker.string.numeric(),
        city: faker.location.city(),
        country: faker.location.state(),
        state: faker.location.country(),
        createdAt: faker.date.anytime(),
        updatedAt: faker.date.anytime()
    }

    if (email) {
        customer.email = email;
    }

    if (complement) {
        customer.complement = complement;
    }

    return customer;
}