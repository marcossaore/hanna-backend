import { Test, TestingModule } from '@nestjs/testing';
import { CustomerService } from '../../src/customer/customer.service';
import { mockCreateCustomerToEntityWithAddressDto, mockCustomerEntity } from '../mock/customer.mock';

describe('CustomerService', () => {
    let sutCustomerService: CustomerService;
    let customerRepository: any;
    let customerToEntityMock = mockCreateCustomerToEntityWithAddressDto();
    let customerMock = mockCustomerEntity();

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                {
                    provide: 'CONNECTION',
                    useValue: {
                        getRepository: () => jest.fn()
                    }
                },
                CustomerService
            ],
        }).compile();
        sutCustomerService = module.get<CustomerService>(CustomerService);
        customerRepository = (sutCustomerService as any).companyRepository = {
            findOneBy: jest.fn().mockResolvedValue(customerMock),
            save: jest.fn().mockResolvedValue(customerMock),
        };
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

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

    describe('findByEmail', () => {
        it('should call CustomerRepository.findOneBy with correct email', async () => {
            await sutCustomerService.findByEmail('any_email');
            expect(customerRepository.findOneBy).toHaveBeenCalledWith({email: 'any_email'});
            expect(customerRepository.findOneBy).toHaveBeenCalledTimes(1);
        });

        it('should throws if CustomerRepository.findOneBy throws', async () => {
            jest.spyOn(customerRepository, 'findOneBy').mockImplementationOnce(async() => {
                throw new Error();
            });
            const promise = sutCustomerService.findByPhone('any_email');
            await expect(promise).rejects.toThrow()
        });

        it('should return null if email doesnt exists', async () => {
            jest.spyOn(customerRepository, 'findOneBy').mockResolvedValueOnce(Promise.resolve(null));
            const response = await sutCustomerService.findByPhone('any_email');
            expect(response).toEqual(null);
        });

        it('should return a customer on success', async () => {
            const response = await sutCustomerService.findByEmail('any_email');
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
