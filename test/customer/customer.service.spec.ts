import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Customer } from '../../db/companies/entities/customer/customer.entity';
import { CustomerService } from '../../src/customer/customer.service';
import { mockCreateCustomerToEntityWithAddressDto, mockCustomerEntity } from '../mock/customer.mock';

describe('CustomerService', () => {
    let sutCustomerService: CustomerService;
    let customerRepository: Repository<Customer>;
    let customerToEntityMock = mockCreateCustomerToEntityWithAddressDto();
    let customerMock = mockCustomerEntity();

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
        providers: [
            CustomerService,
            {
                provide: getRepositoryToken(Customer),
                useValue: {
                    findOneBy: jest.fn().mockResolvedValue(customerMock),
                    save: jest.fn().mockResolvedValue(customerMock),
                }
            }
        ],
        }).compile();

        sutCustomerService = module.get<CustomerService>(CustomerService);
        customerRepository = module.get<Repository<Customer>>(getRepositoryToken(Customer));
    });

    afterEach(() => {
        jest.clearAllMocks();
    })

    describe('findByPhone', () => {
        it('should call CustomerRepository.findOneBy with correct phone', async () => {
            await sutCustomerService.findByPhone('any_phone');
            expect(customerRepository.findOneBy).toHaveBeenCalledWith({phone: 'any_phone'});
            expect(customerRepository.findOneBy).toHaveBeenCalledTimes(1);
        });

        it('should throws if CustomerRepository.findOneBy throws', async () => {
            jest.spyOn(customerRepository, 'findOneBy').mockImplementationOnce(async() => {
                throw new Error();
            });
            const promise = sutCustomerService.findByPhone('any_phone');
            await expect(promise).rejects.toThrow()
        });

        it('should return null if phone doesnt exists', async () => {
            jest.spyOn(customerRepository, 'findOneBy').mockResolvedValueOnce(Promise.resolve(null));
            const response = await sutCustomerService.findByPhone('any_phone');
            expect(response).toEqual(null);
        });

        it('should return a customer on success', async () => {
            const response = await sutCustomerService.findByPhone('any_phone');
            expect(response).toEqual(customerMock);
        });
    });

    describe('create', () => {
        it('should call CustomerRepository.create with correct values', async () => {
            await sutCustomerService.create(customerToEntityMock);
            expect(customerRepository.save).toHaveBeenCalledWith(customerToEntityMock);
            expect(customerRepository.save).toHaveBeenCalledTimes(1);
        });

        it('should throws if CustomerRepository.create throws', async () => {
            jest.spyOn(customerRepository, 'save').mockImplementationOnce(async() => {
                throw new Error();
            });
            const promise = sutCustomerService.create(customerToEntityMock);
            await expect(promise).rejects.toThrow()
        });

        it('should return a customer on success', async () => {
            const response = await sutCustomerService.create(customerToEntityMock);
            expect(response).toEqual(customerMock);
        });
    });
});
