import { Test, TestingModule } from '@nestjs/testing'
import { GenerateDbCredentialsService } from '@infra/plugins/database/generate-db-credentials.service'

describe('Service: GenerateDbCredentialsService', () => {
  let sutGenerateDbCredentialsService: GenerateDbCredentialsService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GenerateDbCredentialsService]
    }).compile()

    sutGenerateDbCredentialsService = module.get<GenerateDbCredentialsService>(
      GenerateDbCredentialsService
    )
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should returns dbUser with 11 chars when a password with 6 chars is provided', async () => {
    const response = sutGenerateDbCredentialsService.generate('6chars')
    expect(response.dbUser.length).toBe(11)
    expect(response.dbUser).toContain('6chars')
    expect(/\d{4}/.test(response.dbUser)).toBe(true)
  })

  it('should returns dbUser with 11 chars when a password grether then 6 chars is provided', async () => {
    const response = sutGenerateDbCredentialsService.generate('6_OrMoreChars')
    expect(response.dbUser.length).toBe(11)
    expect(response.dbUser).toContain('6_OrMo')
    expect(/\d{4}/.test(response.dbUser)).toBe(true)
  })

  it('should returns dbPass with some value', async () => {
    const response = sutGenerateDbCredentialsService.generate('6_OrMoreChars')
    expect(response.dbPass).toBeTruthy()
  })

  it('should returns dbPass and dbUser when cucceds', async () => {
    const response = sutGenerateDbCredentialsService.generate('any_value')
    expect(response.dbUser).toBeTruthy()
    expect(response.dbPass).toBeTruthy()
  })
})
