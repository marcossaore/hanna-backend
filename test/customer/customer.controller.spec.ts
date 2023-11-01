import { Test, TestingModule } from '@nestjs/testing';
import { mockCreateCustomerWithAddressDto, mockCustomerEntity } from '../mock/customer.mock';
import { Customer } from '../../db/companies/entities/customer/customer.entity';
import { GenerateUuidService } from '../../src/_common/services/Uuid/generate-uuid-service';
import { CustomerService } from '../../src/customer/customer.service';
import { CustomerController } from '../../src/customer/customer.controller';

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
            provide: GenerateUuidService,
            useValue: {
                generate: jest.fn().mockReturnValue('any_uuid')
            }
        },
        {
            provide: CustomerService,
            useValue: {
                findByPhone: jest.fn().mockResolvedValue(Promise.resolve(null)),
                create: jest.fn().mockResolvedValue(customerEntityMock)
            }
        }
    ],
    }).compile();

    sutCustomerController = module.get<CustomerController>(CustomerController);
    generateUuidService = module.get<GenerateUuidService>(GenerateUuidService);
    customerService = module.get<CustomerService>(CustomerService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  })

    describe('CREATE', () => {
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
            expect(customerService.create).toHaveBeenCalledWith({
                ...data,
                uuid: 'any_uuid'
            });
            expect(customerService.create).toHaveBeenCalledTimes(1);
        });

        it('should call CustomerService.create with correct values: including email and complement', async () => {
            const data = mockCreateCustomerWithAddressDto({ email: 'any_email', complement: 'any_complement'});
            await sutCustomerController.create(data);
            expect(customerService.create).toHaveBeenCalledWith({
                ...data,
                email: 'any_email',
                uuid: 'any_uuid',
                address: {
                    ...data.address,
                    complement: 'any_complement'
                },
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
});
