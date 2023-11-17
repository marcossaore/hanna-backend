import { Test, TestingModule } from '@nestjs/testing';
import { mockCreateCustomerWithAddressDto, mockCustomerEntity } from '../mock/customer.mock';
import { Customer } from '@db/companies/entities/customer/customer.entity';
import { CustomerService } from '@/customer/customer.service';
import { GenerateUuidService } from '@/_common/services/Uuid/generate-uuid-service';
import { CustomerController } from '@/customer/customer.controller';

describe('CustomerController', () => {
  let sutCustomerController: CustomerController;
  let generateUuidService : GenerateUuidService;
  let customerService : CustomerService;
  let customerEntityMock = mockCustomerEntity()

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
        controllers: [CustomerController],
        providers: [
            {
                provide: 'CONNECTION',
                useValue: {
                    getRepository: jest.fn()
                }
            },
            {
                provide: GenerateUuidService,
                useValue: {
                    generate: jest.fn().mockReturnValue('any_uuid')
                }
            },
            {
                provide: CustomerService,
                useValue: {
                    findByUuid: jest.fn().mockResolvedValue(customerEntityMock),
                    findAll: jest.fn().mockResolvedValue(Promise.resolve(
                        [
                            mockCustomerEntity(),
                            mockCustomerEntity()
                        ],
                    )),
                    findByPhone: jest.fn().mockResolvedValue(Promise.resolve(null)),
                    findByEmail: jest.fn().mockResolvedValue(Promise.resolve(null)),
                    create: jest.fn().mockResolvedValue(customerEntityMock),
                    save: jest.fn(),
                    removeByUuid: jest.fn().mockResolvedValue(customerEntityMock)
                }
            }
        ]
    }).compile();

    sutCustomerController = module.get<CustomerController>(CustomerController);
    generateUuidService = module.get<GenerateUuidService>(GenerateUuidService);
    customerService = module.get<CustomerService>(CustomerService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  })

    describe('create', () => {
        it('should call CustomerService.findByPhone with correct value', async () => {
            const data = mockCreateCustomerWithAddressDto();
            await sutCustomerController.create(data);
            expect(customerService.findByPhone).toHaveBeenCalledWith(data.phone);
            expect(customerService.findByPhone).toHaveBeenCalledTimes(1);
        });

        it('should throws if CustomerService.findByPhone returns a customer', async () => {
            const data = mockCreateCustomerWithAddressDto();
            jest.spyOn(customerService, 'findByPhone').mockReturnValueOnce(Promise.resolve(
                {}  as Customer
            ));
            const promise = sutCustomerController.create(data);
            await expect(promise).rejects.toThrow(new Error('O cliente já está cadastrado!'));
        });

        it('should throws if CustomerService.findByPhone throws', async () => {
            const data = mockCreateCustomerWithAddressDto();
            jest.spyOn(customerService, 'findByPhone').mockImplementationOnce(() => {
                throw new Error();
            });
            const promise = sutCustomerController.create(data);
            await expect(promise).rejects.toThrow(new Error());
        });

        it('should not call CustomerService.findByEmail when email is not provided', async () => {
            const data = mockCreateCustomerWithAddressDto();
            await sutCustomerController.create({
                ...data,
                email: null
            });
            expect(customerService.findByEmail).toHaveBeenCalledTimes(0);
        });

        it('should call CustomerService.findByEmail with correct value when email is provided', async () => {
            const data = mockCreateCustomerWithAddressDto( { email: 'any_email' });
            await sutCustomerController.create(data);
            expect(customerService.findByEmail).toHaveBeenCalledWith(data.email);
            expect(customerService.findByEmail).toHaveBeenCalledTimes(1);
        });

        it('should throws if CustomerService.findByEmail returns a customer', async () => {
            const data = mockCreateCustomerWithAddressDto();
            jest.spyOn(customerService, 'findByEmail').mockReturnValueOnce(Promise.resolve(
                {}  as Customer
            ));
            const promise = sutCustomerController.create(data);
            await expect(promise).rejects.toThrow(new Error('O cliente já está cadastrado!'));
        });

        it('should throws if CustomerService.findByEmail throws', async () => {
            const data = mockCreateCustomerWithAddressDto();
            jest.spyOn(customerService, 'findByEmail').mockImplementationOnce(() => {
                throw new Error();
            });
            const promise = sutCustomerController.create(data);
            await expect(promise).rejects.toThrow(new Error());
        });

        it('should call GenerateUuidService.generate', async () => {
            const data = mockCreateCustomerWithAddressDto();
            await sutCustomerController.create(data);
            expect(generateUuidService.generate).toHaveBeenCalledTimes(1);
        });

        it('should throws if GenerateUuidService.generate throws', async () => {
            const data = mockCreateCustomerWithAddressDto();
            jest.spyOn(generateUuidService, 'generate').mockImplementationOnce(() => {
                throw new Error();
            });
            const promise = sutCustomerController.create(data);
            await expect(promise).rejects.toThrow(new Error());
        });

        it('should call CustomerService.create with correct values', async () => {
            const data = mockCreateCustomerWithAddressDto();
            await sutCustomerController.create(data);
            const { address, ...allData } = data;
            expect(customerService.create).toHaveBeenCalledWith({
                ...allData,
                ...address,
                uuid: 'any_uuid'
            });
            expect(customerService.create).toHaveBeenCalledTimes(1);
        });

        it('should call CustomerService.create with correct values: including email and complement', async () => {
            const data = mockCreateCustomerWithAddressDto({ email: 'any_email', complement: 'any_complement'});
            await sutCustomerController.create(data);
            const { address, ...allData } = data;
            expect(customerService.create).toHaveBeenCalledWith({
                ...allData,
                ...address,
                email: 'any_email',
                uuid: 'any_uuid',
                complement: 'any_complement'
            });
            expect(customerService.create).toHaveBeenCalledTimes(1);
        });

        it('should throws if CustomerService.create throws', async () => {
            const data = mockCreateCustomerWithAddressDto();
            jest.spyOn(customerService, 'create').mockImplementationOnce(() => {
                throw new Error();
            });
            const promise = sutCustomerController.create(data);
            await expect(promise).rejects.toThrow(new Error());
        });

        it('should returns a customer when succeds', async () => {
            const data = mockCreateCustomerWithAddressDto();
            const response = await sutCustomerController.create(data);
            expect(response).toEqual(customerEntityMock);
        });
    });

    describe('findAll', () => {
        it('should call CustomerService.findAll', async () => {
            await sutCustomerController.findAll();;
            expect(customerService.findAll).toHaveBeenCalledTimes(1);
        });

        it('should throws if CustomerService.findAll throws', async () => {
            jest.spyOn(customerService, 'findAll').mockImplementationOnce(() => {
                throw new Error();
            });
            const promise = sutCustomerController.findAll();
            await expect(promise).rejects.toThrow(new Error());
        });

        it('should return customers when succeds', async () => {
            const response = await sutCustomerController.findAll();
            expect(response.length).toEqual(2);
        });
    });

    describe('findByUuid', () => {
        it('should call CustomerService.findByUuid with correct value', async () => {
            await sutCustomerController.findByUuid('any_uuid');
            expect(customerService.findByUuid).toHaveBeenCalledWith('any_uuid');
            expect(customerService.findByUuid).toHaveBeenCalledTimes(1);
        });

        it('should throws if CustomerService.findByUuid returns null', async () => {
            jest.spyOn(customerService, 'findByUuid').mockResolvedValueOnce(Promise.resolve(null));
            const promise = sutCustomerController.findByUuid('any_uuid');
            await expect(promise).rejects.toThrow(new Error('Cliente não encontrado!'));
        });

        it('should throws if CustomerService.findByUuid throws', async () => {
            jest.spyOn(customerService, 'findByUuid').mockImplementationOnce(() => {
                throw new Error();
            });
            const promise = sutCustomerController.findByUuid('any_uuid');
            await expect(promise).rejects.toThrow(new Error());
        });

        it('should return a customer when succeds', async () => {
            const response = await sutCustomerController.findByUuid('any_uuid');
            expect(response).toEqual(customerEntityMock);
        });
    });

    describe('updateByUuid', () => {
        it('should call CustomerService.findByUuid with correct value', async () => {
            const data = mockCreateCustomerWithAddressDto();
            await sutCustomerController.updateByUuid('any_uuid', data);
            expect(customerService.findByUuid).toHaveBeenCalledWith('any_uuid');
            expect(customerService.findByUuid).toHaveBeenCalledTimes(1);
        });

        it('should throws if CustomerService.findByUuid returns null', async () => {
            jest.spyOn(customerService, 'findByUuid').mockResolvedValueOnce(Promise.resolve(null));
            const promise = sutCustomerController.findByUuid('any_uuid');
            await expect(promise).rejects.toThrow(new Error('Cliente não encontrado!'));
        });

        it('should throws if CustomerService.findByUuid throws', async () => {
            jest.spyOn(customerService, 'findByUuid').mockImplementationOnce(() => {
                throw new Error();
            });
            const promise = sutCustomerController.findByUuid('any_uuid');
            await expect(promise).rejects.toThrow(new Error());
        });

        it('should call CustomerService.save with correct values', async () => {
            const data = mockCreateCustomerWithAddressDto();
            await sutCustomerController.updateByUuid('any_uuid', data);
            expect(customerService.findByUuid).toHaveBeenCalledTimes(1);
        });

        it('should throws if CustomerService.save throws', async () => {
            const data = mockCreateCustomerWithAddressDto();
            jest.spyOn(customerService, 'save').mockImplementationOnce(() => {
                throw new Error();
            });
            const promise = sutCustomerController.updateByUuid('any_uuid', data);
            await expect(promise).rejects.toThrow(new Error());
        });

        it('should return a customer when succeds', async () => {
            const response = await sutCustomerController.findByUuid('any_uuid');
            expect(response).toEqual(customerEntityMock);
        });
    });

    describe('removeByUuid', () => {
        it('should call CustomerService.findByUuid with correct value', async () => {
            await sutCustomerController.removeByUuid('any_uuid');
            expect(customerService.findByUuid).toHaveBeenCalledWith('any_uuid');
            expect(customerService.findByUuid).toHaveBeenCalledTimes(1);
        });

        it('should throws if CustomerService.findByUuid returns null', async () => {
            jest.spyOn(customerService, 'findByUuid').mockResolvedValueOnce(Promise.resolve(null));
            const promise = sutCustomerController.removeByUuid('any_uuid');
            await expect(promise).rejects.toThrow(new Error('Cliente não encontrado!'));
        });

        it('should throws if CustomerService.findByUuid throws', async () => {
            jest.spyOn(customerService, 'findByUuid').mockImplementationOnce(() => {
                throw new Error();
            });
            const promise = sutCustomerController.removeByUuid('any_uuid');
            await expect(promise).rejects.toThrow(new Error());
        });

        it('should call CustomerService.removeByUuid with correct values', async () => {
            await sutCustomerController.removeByUuid('any_uuid');
            expect(customerService.removeByUuid).toHaveBeenCalledWith('any_uuid');
            expect(customerService.findByUuid).toHaveBeenCalledTimes(1);
        });

        it('should throws if CustomerService.removeByUuid throws', async () => {
            jest.spyOn(customerService, 'removeByUuid').mockImplementationOnce(() => {
                throw new Error();
            });
            const promise = sutCustomerController.removeByUuid('any_uuid');
            await expect(promise).rejects.toThrow(new Error());
        });

        it('should return a customer when succeds', async () => {
            const response = await sutCustomerController.removeByUuid('any_uuid');
            expect(response).toEqual(customerEntityMock);
        });
    });
});
