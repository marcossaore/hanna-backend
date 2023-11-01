import { faker } from "@faker-js/faker";
import { CreateCustomerDto } from "../../src/customer/dto/create-customer.dto";

export const mockCreateCustomerWithAddressDto = ({ complement = null } = {}): CreateCustomerDto => ({
    name: faker.company.name(),
    email: faker.internet.email(),
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
