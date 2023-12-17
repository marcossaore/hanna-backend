import { Test, TestingModule } from '@nestjs/testing'
import { mockCreateBillDtoWithAmount } from '../../../../mock/sale.mock'
import { BillService } from '@/modules/application/bill/bill.service'

describe('Service: BillService', () => {
  let sutBillService: BillService
  let billRepository: any

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: 'CONNECTION',
          useValue: {
            getRepository: () => jest.fn()
          }
        },
        BillService
      ]
    }).compile()

    sutBillService = module.get<BillService>(BillService)
    billRepository = (sutBillService as any).billRepository = {
      save: jest.fn()
    }
  })

  it('should call BillService.create with correct values', async () => {
    const data = mockCreateBillDtoWithAmount()
    await sutBillService.create(data)
    expect(billRepository.save).toHaveBeenCalledWith(data)
  })
})
