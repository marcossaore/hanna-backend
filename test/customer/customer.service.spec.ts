import { Test, TestingModule } from '@nestjs/testing';
import { mockCreateCustomerToEntityWithAddressDto, mockCustomerEntity } from '../mock/customer.mock';
import { CustomerService } from '@/modules/application/customer/customer.service';

const pageOptions = { limit: 1, page: 1};

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
        customerRepository = (sutCustomerService as any).customerRepository = {
            find: jest.fn().mockResolvedValue([customerMock, customerMock]),
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

    describe('findAll', () => {
        it('should call CustomerRepository.find with correct values', async () => {
            await sutCustomerService.findAll(pageOptions);
            expect(customerRepository.find).toHaveBeenCalledWith(
                {
                    take: pageOptions.limit,
                    skip: pageOptions.page - 1,
                    order: {
                        createdAt: 'DESC'
                    }
                }
            );
            expect(customerRepository.find).toHaveBeenCalledTimes(1);
        });

        it('should throws if CustomerRepository.find throws', async () => {
            jest.spyOn(customerRepository, 'find').mockImplementationOnce(async() => {
                throw new Error();
            });
            const promise = sutCustomerService.findAll(pageOptions);
            await expect(promise).rejects.toThrow()
        });

        it('should return array if do not have any customer', async () => {
            jest.spyOn(customerRepository, 'find').mockResolvedValueOnce(Promise.resolve([]));
            const response = await sutCustomerService.findAll(pageOptions);
            expect(response).toEqual([]);
        });

        it('should return customers on success', async () => {
            const response = await sutCustomerService.findAll(pageOptions);
            expect(response.length).toEqual(2);
        });
    });

    describe('findByUuid', () => {
        it('should call CustomerRepository.findOneBy with correct values', async () => {
            await sutCustomerService.findByUuid('any_uuid');
            expect(customerRepository.findOneBy).toHaveBeenCalledWith({ uuid: 'any_uuid' });
            expect(customerRepository.findOneBy).toHaveBeenCalledTimes(1);
        });

        it('should throws if CustomerRepository.findOneBy throws', async () => {
            jest.spyOn(customerRepository, 'findOneBy').mockImplementationOnce(async() => {
                throw new Error();
            });
            const promise = sutCustomerService.findByUuid('any_uuid');
            await expect(promise).rejects.toThrow()
        });

        it('should return null if customer not exists', async () => {
            jest.spyOn(customerRepository, 'findOneBy').mockResolvedValueOnce(Promise.resolve(null));
            const response = await sutCustomerService.findByUuid('any_uuid');
            expect(response).toEqual(null);
        });

        it('should return a customer on success', async () => {
            const response = await sutCustomerService.findByUuid('any_uuid');
            expect(response).toEqual(customerMock);
        });
    });

    describe('removeByUuid', () => {
        it('should call CustomerRepository.findOneBy with correct values', async () => {
            await sutCustomerService.removeByUuid('any_uuid');
            expect(customerRepository.findOneBy).toHaveBeenCalledWith({ uuid: 'any_uuid' });
            expect(customerRepository.findOneBy).toHaveBeenCalledTimes(1);
        });

        it('should throws if CustomerRepository.findOneBy throws', async () => {
            jest.spyOn(customerRepository, 'findOneBy').mockImplementationOnce(async() => {
                throw new Error();
            });
            const promise = sutCustomerService.removeByUuid('any_uuid');
            await expect(promise).rejects.toThrow()
        });

        it('should call CustomerRepository.save with correct deletedAt', async () => {
            const data = mockCustomerEntity()
            jest.spyOn(customerRepository, 'findOneBy').mockResolvedValueOnce(Promise.resolve(data))
            expect(data.deletedAt).toBe(null)
            const response = await sutCustomerService.removeByUuid('any_uuid');
            expect(customerRepository.save).toHaveBeenCalledTimes(1);
            expect(response.deletedAt).toBeTruthy()
        });

        it('should return a customer on success', async () => {
            const response = await sutCustomerService.removeByUuid('any_uuid');
            expect(response).toEqual(customerMock);
        });
    });
});
