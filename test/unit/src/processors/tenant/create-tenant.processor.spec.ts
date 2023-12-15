import { Test, TestingModule } from '@nestjs/testing'
import { ConfigService } from '@nestjs/config'
import { mockCompanyEntity } from '../../../mock/company.mock'
import { mockUserEntity } from '../../../mock/user.mock'
import { Tenant } from '@infra/db/app/entities/tenant/tenant.entity'
import { User } from '@infra/db/companies/entities/user/user.entity'
import { MigrationsCompanyService } from '@infra/plugins/database/migrations-company.service'
import { SeedRunnerService } from '@infra/db/companies/seeds/seed-runner.service.'
import { CreateDatabaseService } from '@infra/plugins/database/create-database.service'
import { GenerateDbCredentialsService } from '@infra/plugins/database/generate-db-credentials.service'
import { TokenServiceAdapter } from '@infra/plugins/token/token-service.adapter'
import { UserServiceLazy } from '@/modules/application/user/user.service.lazy'
import { TenantService } from '@/modules/application/tenant/tenant.service'
import { SecretsService } from '@/modules/infra/secrets/secrets-service'
import { MailService } from '@/modules/infra/mail/mail.service'
import { AddAdminRoleServiceLazy } from '@/modules/application/role/add-admin-role.service'
import { LoadTenantConnectionService } from '@/modules/application/tenant-connection/load-tenant-connection.service'
import { CreateTenantProcessor } from '@/processors/tenant/create-tenant.processor'

const mockJobData: any = {
  data: {
    id: 'any_id'
  }
}

describe('Processor: CreateTenant', () => {
  let tenantEntityMock: Tenant
  let userEntityMock: User
  let configService: ConfigService
  let sutCreateTenantProcessor: CreateTenantProcessor
  let tenantService: TenantService
  let generateDbCredentialsService: GenerateDbCredentialsService
  let createDataBaseService: CreateDatabaseService
  let secretsService: SecretsService
  let loadTenantConnectionService: LoadTenantConnectionService
  let seedRunnerService: SeedRunnerService
  let mailService: MailService
  let migrationsCompanyService: MigrationsCompanyService
  let userService: UserServiceLazy
  let addAdminRoleService: AddAdminRoleServiceLazy
  let tokenServiceAdapter: TokenServiceAdapter

  beforeEach(async () => {
    tenantEntityMock = mockCompanyEntity()
    userEntityMock = mockUserEntity()

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateTenantProcessor,
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn().mockReturnValue({
              getUrl: 'http://any_url'
            })
          }
        },
        {
          provide: TenantService,
          useValue: {
            findById: jest.fn().mockResolvedValue(tenantEntityMock),
            markAsProcessed: jest.fn(),
            markAsRejected: jest.fn()
          }
        },
        {
          provide: GenerateDbCredentialsService,
          useValue: {
            generate: jest.fn().mockReturnValue({
              dbUser: 'any_db_user',
              dbPass: 'any_db_pass'
            })
          }
        },
        {
          provide: CreateDatabaseService,
          useValue: {
            create: jest.fn(null)
          }
        },
        {
          provide: SecretsService,
          useValue: {
            save: jest.fn()
          }
        },
        {
          provide: MigrationsCompanyService,
          useValue: {
            run: jest.fn()
          }
        },
        {
          provide: LoadTenantConnectionService,
          useValue: {
            load: jest.fn().mockReturnValue('any_connection' as any)
          }
        },
        {
          provide: SeedRunnerService,
          useValue: {
            seed: jest.fn()
          }
        },
        {
          provide: UserServiceLazy,
          useValue: {
            load: jest.fn().mockReturnValue({
              save: jest.fn().mockResolvedValue(userEntityMock),
              addRole: jest.fn().mockResolvedValue('any_role')
            })
          }
        },
        {
          provide: AddAdminRoleServiceLazy,
          useValue: {
            load: jest.fn().mockResolvedValue('any_role')
          }
        },
        {
          provide: TokenServiceAdapter,
          useValue: {
            sign: jest.fn().mockReturnValue('any_hash')
          }
        },
        {
          provide: MailService,
          useValue: {
            send: jest.fn().mockResolvedValue(true)
          }
        }
      ]
    }).compile()

    configService = module.get<ConfigService>(ConfigService)
    sutCreateTenantProcessor = module.get<CreateTenantProcessor>(
      CreateTenantProcessor
    )
    tenantService = module.get<TenantService>(TenantService)
    generateDbCredentialsService = module.get<GenerateDbCredentialsService>(
      GenerateDbCredentialsService
    )
    createDataBaseService = module.get<CreateDatabaseService>(
      CreateDatabaseService
    )
    secretsService = module.get<SecretsService>(SecretsService)
    migrationsCompanyService = module.get<MigrationsCompanyService>(
      MigrationsCompanyService
    )
    loadTenantConnectionService = module.get<LoadTenantConnectionService>(
      LoadTenantConnectionService
    )
    seedRunnerService = module.get<SeedRunnerService>(SeedRunnerService)
    userService = module.get<UserServiceLazy>(UserServiceLazy)
    addAdminRoleService = module.get<AddAdminRoleServiceLazy>(
      AddAdminRoleServiceLazy
    )
    tokenServiceAdapter = module.get<TokenServiceAdapter>(TokenServiceAdapter)
    mailService = module.get<MailService>(MailService)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  describe('handleJob', () => {
    it('should call TenantService.findById with correct id', async () => {
      await sutCreateTenantProcessor.handleJob(mockJobData)
      expect(tenantService.findById).toHaveBeenCalledTimes(1)
      expect(tenantService.findById).toHaveBeenCalledWith('any_id')
    })

    it('should throws if TenantService.findById throws', async () => {
      jest.spyOn(tenantService, 'findById').mockImplementationOnce(() => {
        throw new Error()
      })
      const promise = sutCreateTenantProcessor.handleJob(mockJobData)
      await expect(promise).rejects.toThrow()
    })

    it('should call GenerateDbCredentialsService.generate', async () => {
      await sutCreateTenantProcessor.handleJob(mockJobData)
      expect(generateDbCredentialsService.generate).toHaveBeenCalledTimes(1)
      expect(generateDbCredentialsService.generate).toHaveBeenCalledWith(
        tenantEntityMock.name
      )
    })

    it('should throws if GenerateDbCredentialsService.generate throws', async () => {
      jest
        .spyOn(generateDbCredentialsService, 'generate')
        .mockImplementationOnce(() => {
          throw new Error()
        })
      const promise = sutCreateTenantProcessor.handleJob(mockJobData)
      await expect(promise).rejects.toThrow()
    })

    it('should call CreateDatabaseService.create', async () => {
      await sutCreateTenantProcessor.handleJob(mockJobData)
      expect(createDataBaseService.create).toHaveBeenCalledTimes(1)
      expect(createDataBaseService.create).toHaveBeenCalledWith({
        db: tenantEntityMock.companyIdentifier,
        dbUser: 'any_db_user',
        dbPass: 'any_db_pass'
      })
    })

    it('should throws if CreateDatabaseService.create throws', async () => {
      jest.spyOn(createDataBaseService, 'create').mockImplementationOnce(() => {
        throw new Error()
      })
      const promise = sutCreateTenantProcessor.handleJob(mockJobData)
      await expect(promise).rejects.toThrow()
    })

    it('should call SecretsService.save with correct values', async () => {
      await sutCreateTenantProcessor.handleJob(mockJobData)
      expect(secretsService.save).toHaveBeenCalledTimes(1)
      expect(secretsService.save).toHaveBeenCalledWith(
        tenantEntityMock.companyIdentifier,
        JSON.stringify({
          dbUser: 'any_db_user',
          dbPass: 'any_db_pass'
        })
      )
    })

    it('should throws if SecretsService.save throws', async () => {
      jest.spyOn(secretsService, 'save').mockImplementationOnce(() => {
        throw new Error()
      })
      const promise = sutCreateTenantProcessor.handleJob(mockJobData)
      await expect(promise).rejects.toThrow()
    })

    it('should call LoadTenantConnectionService.load with correct values', async () => {
      await sutCreateTenantProcessor.handleJob(mockJobData)
      expect(loadTenantConnectionService.load).toHaveBeenCalledTimes(1)
      expect(loadTenantConnectionService.load).toHaveBeenCalledWith(
        tenantEntityMock.companyIdentifier,
        30
      )
    })

    it('should throws if LoadTenantConnectionService.load returns null', async () => {
      jest
        .spyOn(loadTenantConnectionService, 'load')
        .mockResolvedValueOnce(null)
      const promise = sutCreateTenantProcessor.handleJob(mockJobData)
      await expect(promise).rejects.toThrow(
        new Error('Connection it was not established!')
      )
    })

    it('should throws if LoadTenantConnectionService.load throws', async () => {
      jest
        .spyOn(loadTenantConnectionService, 'load')
        .mockImplementationOnce(() => {
          throw new Error()
        })
      const promise = sutCreateTenantProcessor.handleJob(mockJobData)
      await expect(promise).rejects.toThrow()
    })

    it('should call MigrationsCompanyService.run with correct value', async () => {
      await sutCreateTenantProcessor.handleJob(mockJobData)
      expect(migrationsCompanyService.run).toHaveBeenCalledTimes(1)
      expect(migrationsCompanyService.run).toHaveBeenCalledWith(
        tenantEntityMock.companyIdentifier
      )
    })

    it('should throws if MigrationsCompanyService.run throws', async () => {
      jest.spyOn(migrationsCompanyService, 'run').mockImplementationOnce(() => {
        throw new Error()
      })
      const promise = sutCreateTenantProcessor.handleJob(mockJobData)
      await expect(promise).rejects.toThrow()
    })

    it('should call SeedRunnerService.seed with correct connection', async () => {
      await sutCreateTenantProcessor.handleJob(mockJobData)
      expect(seedRunnerService.seed).toHaveBeenCalledTimes(1)
      expect(seedRunnerService.seed).toHaveBeenCalledWith('any_connection')
    })

    it('should throws if SeedRunnerService.seed throws', async () => {
      jest.spyOn(seedRunnerService, 'seed').mockImplementationOnce(() => {
        throw new Error()
      })
      const promise = sutCreateTenantProcessor.handleJob(mockJobData)
      await expect(promise).rejects.toThrow()
    })

    it('should call UserService.load witth correct connection', async () => {
      await sutCreateTenantProcessor.handleJob(mockJobData)
      expect(userService.load).toHaveBeenCalledTimes(1)
      expect(seedRunnerService.seed).toHaveBeenCalledWith('any_connection')
    })

    it('should throws if UserService.load throws', async () => {
      jest.spyOn(userService, 'load').mockImplementationOnce(() => {
        throw new Error()
      })
      const promise = sutCreateTenantProcessor.handleJob(mockJobData)
      await expect(promise).rejects.toThrow()
    })

    it('should call UserService.save with correct values', async () => {
      const userServiceLoaded = userService.load('any_connection' as any)
      await sutCreateTenantProcessor.handleJob(mockJobData)
      expect(userServiceLoaded.save).toHaveBeenCalledTimes(1)
      expect(userServiceLoaded.save).toHaveBeenCalledWith({
        name: tenantEntityMock.partnerName,
        email: tenantEntityMock.email,
        phone: tenantEntityMock.phone
      })
    })

    it('should throws if UserService.save throws', async () => {
      const userServiceLoaded = userService.load('any_connection' as any)
      jest.spyOn(userServiceLoaded, 'save').mockImplementationOnce(() => {
        throw new Error()
      })
      const promise = sutCreateTenantProcessor.handleJob(mockJobData)
      await expect(promise).rejects.toThrow()
    })

    it('should call AddAdminRole.load witth correct connection', async () => {
      await sutCreateTenantProcessor.handleJob(mockJobData)
      expect(addAdminRoleService.load).toHaveBeenCalledTimes(1)
      expect(addAdminRoleService.load).toHaveBeenCalledWith('any_connection')
    })

    it('should throws if AddAdminRole.load throws', async () => {
      jest.spyOn(addAdminRoleService, 'load').mockImplementationOnce(() => {
        throw new Error()
      })
      const promise = sutCreateTenantProcessor.handleJob(mockJobData)
      await expect(promise).rejects.toThrow()
    })

    it('should call UserService.addRole witth correct values', async () => {
      const userServiceLoaded = userService.load('any_connection' as any)
      const sypAddAdminRoleService = jest.spyOn(addAdminRoleService, 'load')
      await sutCreateTenantProcessor.handleJob(mockJobData)
      expect(userServiceLoaded.addRole).toHaveBeenCalledTimes(1)
      expect(userServiceLoaded.addRole).toHaveBeenCalledWith(
        userEntityMock.id,
        sypAddAdminRoleService.mock.results[0].value
      )
    })

    it('should throws if UserService.addRole throws', async () => {
      const userServiceLoaded = userService.load('any_connection' as any)
      jest.spyOn(userServiceLoaded, 'addRole').mockImplementationOnce(() => {
        throw new Error()
      })
      const promise = sutCreateTenantProcessor.handleJob(mockJobData)
      await expect(promise).rejects.toThrow()
    })

    it('should call TokenServiceAdapter.sign with correct value', async () => {
      const expiresIn10Minutes = 10 * 60
      await sutCreateTenantProcessor.handleJob(mockJobData)
      expect(tokenServiceAdapter.sign).toHaveBeenCalledTimes(1)
      expect(tokenServiceAdapter.sign).toHaveBeenCalledWith(
        {
          companyId: tenantEntityMock.id,
          companyName: tenantEntityMock.name,
          userId: userEntityMock.id,
          userName: tenantEntityMock.partnerName
        },
        expiresIn10Minutes
      )
    })

    it('should throws if TokenServiceAdapter.run throws', async () => {
      jest.spyOn(tokenServiceAdapter, 'sign').mockImplementationOnce(() => {
        throw new Error()
      })
      const promise = sutCreateTenantProcessor.handleJob(mockJobData)
      await expect(promise).rejects.toThrow()
    })

    it('should call ConfigService.get with correct value', async () => {
      await sutCreateTenantProcessor.handleJob(mockJobData)
      expect(configService.get).toHaveBeenCalledTimes(1)
      expect(configService.get).toHaveBeenCalledWith('app')
    })

    it('should throws if ConfigService.get throws', async () => {
      jest.spyOn(configService, 'get').mockImplementationOnce(() => {
        throw new Error()
      })
      const promise = sutCreateTenantProcessor.handleJob(mockJobData)
      await expect(promise).rejects.toThrow()
    })

    it('should call MailService.send with correct values', async () => {
      await sutCreateTenantProcessor.handleJob(mockJobData)
      expect(mailService.send).toHaveBeenCalledTimes(1)
      expect(mailService.send).toHaveBeenCalledWith({
        to: tenantEntityMock.email,
        subject: 'Conta criada com sucesso!',
        template: 'company-account-create',
        data: {
          name: tenantEntityMock.name,
          document: tenantEntityMock.document,
          partnerName: tenantEntityMock.partnerName,
          email: tenantEntityMock.email,
          link: 'http://any_url/app/user/new-password?token=any_hash'
        }
      })
    })

    it('should throws if MailService.send throws', async () => {
      jest.spyOn(mailService, 'send').mockImplementationOnce(() => {
        throw new Error()
      })
      const promise = sutCreateTenantProcessor.handleJob(mockJobData)
      await expect(promise).rejects.toThrow()
    })
  })

  describe('onCompleted', () => {
    it('should call TenantService.markAsProcessed with correct values', () => {
      sutCreateTenantProcessor.onCompleted(mockJobData)
      expect(tenantService.markAsProcessed).toHaveBeenCalledTimes(1)
      expect(tenantService.markAsProcessed).toHaveBeenCalledWith('any_id')
    })
  })

  describe('onFailed', () => {
    it('should call TenantService.markAsRejected with correct values', () => {
      sutCreateTenantProcessor.onFailed(
        mockJobData,
        new Error('Some error occurs!')
      )
      expect(tenantService.markAsRejected).toHaveBeenCalledTimes(1)
      expect(tenantService.markAsRejected).toHaveBeenCalledWith(
        'any_id',
        new Error('Some error occurs!')
      )
    })
  })
})
