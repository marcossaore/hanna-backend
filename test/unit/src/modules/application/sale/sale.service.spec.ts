import { Test, TestingModule } from '@nestjs/testing'
import { mockCreateSaleWithAmount } from '../../../../../unit/mock/sale.mock'
import { SaleService } from '@/modules/application/sale/sale.service'

describe('Service: SaleService', () => {
  let sutSaleservice: SaleService
  let saleRepository: any

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: 'CONNECTION',
          useValue: {
            getRepository: () => jest.fn()
          }
        },
        SaleService
      ]
    }).compile()

    sutSaleservice = module.get<SaleService>(SaleService)
    saleRepository = (sutSaleservice as any).saleRepository = {
      save: jest.fn()
    }
  })

  it('should call SaleService.create with correct values', async () => {
    const data = mockCreateSaleWithAmount()
    await sutSaleservice.create(data)
    expect(saleRepository.save).toHaveBeenCalledWith(data)
  })
})
