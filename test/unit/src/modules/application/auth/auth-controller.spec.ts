import { Test, TestingModule } from '@nestjs/testing'
import { mockUserEntity, mockUserPermission } from '../../../../mock/user.mock'
import { mockCompanyEntity } from '../../../../mock/company.mock'
import {
  mockLoginDto,
  mockUserCreatePasswordDto
} from '../../../../mock/auth.mock'
import { Tenant } from '@infra/db/app/entities/tenant/tenant.entity'
import { User } from '@infra/db/companies/entities/user/user.entity'
import { HashService } from '@infra/plugins/hash/hash.service'
import { LoadTenantConnectionService } from '@/modules/application/tenant-connection/load-tenant-connection.service'
import { TenantService } from '@/modules/application/tenant/tenant.service'
import { UserServiceLazy } from '@/modules/application/user/user.service.lazy'
import { AuthController } from '@/modules/application/auth/auth.controller'
import { TokenServiceAdapter } from '@infra/plugins/token/token-service.adapter'
import { SecretsService } from '@/modules/infra/secrets/secrets-service'

describe('AuthController', () => {
  let entityTenantMock: Tenant
  let entityUserMock: User
  let userPermissionMock: any
  let sutAuthController: AuthController
  let tenantService: TenantService
  let loadTenantConnectionService: LoadTenantConnectionService
  let userServiceLazy: UserServiceLazy
  let hashService: HashService
  let tokenServiceAdapter: TokenServiceAdapter
  let secretsService: SecretsService

  const requestSpy: any = {
    session: {
      cookie: {
        _expires: 'any_expires'
      },
      destroy: () => {}
    }
  }

  beforeEach(async () => {
    requestSpy.session.auth = undefined
    entityTenantMock = mockCompanyEntity()
    entityUserMock = mockUserEntity()
    userPermissionMock = mockUserPermission()

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: TenantService,
          useValue: {
            findByDocument: jest
              .fn()
              .mockResolvedValue(Promise.resolve(entityTenantMock)),
            findById: jest
              .fn()
              .mockResolvedValue(Promise.resolve(entityTenantMock))
          }
        },
        {
          provide: LoadTenantConnectionService,
          useValue: {
            load: jest.fn().mockReturnValue({} as any)
          }
        },
        {
          provide: UserServiceLazy,
          useValue: {
            load: jest.fn().mockReturnValue({
              findByEmail: jest
                .fn()
                .mockResolvedValue(Promise.resolve(entityUserMock)),
              getRolesGrouped: jest
                .fn()
                .mockResolvedValue(Promise.resolve(userPermissionMock)),
              savePassword: jest.fn()
            })
          }
        },
        {
          provide: HashService,
          useValue: {
            verify: jest.fn().mockResolvedValue(Promise.resolve(true)),
            hash: jest.fn().mockResolvedValue(Promise.resolve('any_hash'))
          }
        },
        {
          provide: TokenServiceAdapter,
          useValue: {
            verify: jest.fn().mockReturnValue({
              companyId: 'any_company_id',
              userId: 'any_user_id'
            })
          }
        },
        {
          provide: SecretsService,
          useValue: {
            get: jest.fn().mockReturnValue(
              JSON.stringify({
                dbUser: 'any_db_user',
                dbPass: 'any_db_pass'
              })
            )
          }
        }
      ]
    }).compile()

    sutAuthController = module.get<AuthController>(AuthController)
    tenantService = module.get<TenantService>(TenantService)
    loadTenantConnectionService = module.get<LoadTenantConnectionService>(
      LoadTenantConnectionService
    )
    userServiceLazy = module.get<UserServiceLazy>(UserServiceLazy)
    hashService = module.get<HashService>(HashService)
    tokenServiceAdapter = module.get<TokenServiceAdapter>(TokenServiceAdapter)
    secretsService = module.get<SecretsService>(SecretsService)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  describe('login', () => {
    it('should call TenantService.findByDocument with correct document', async () => {
      const data = mockLoginDto()
      await sutAuthController.login(data, requestSpy)
      expect(tenantService.findByDocument).toHaveBeenCalledWith(data.document)
      expect(tenantService.findByDocument).toHaveBeenCalledTimes(1)
    })

    it('should throws if TenantService.findByDocument returns null', async () => {
      const data = mockLoginDto()
      jest
        .spyOn(tenantService, 'findByDocument')
        .mockReturnValueOnce(Promise.resolve(null))
      const promise = sutAuthController.login(data, requestSpy)
      await expect(promise).rejects.toThrow(
        new Error('O CNPJ, email ou senha são inválidos!')
      )
    })

    it('should throws if TenantService.findByDocument throws', async () => {
      const data = mockLoginDto()
      jest.spyOn(tenantService, 'findByDocument').mockImplementationOnce(() => {
        throw new Error()
      })
      const promise = sutAuthController.login(data, requestSpy)
      await expect(promise).rejects.toThrow(new Error())
    })

    it('should call SecretsService.get with correct key', async () => {
      const data = mockLoginDto()
      await sutAuthController.login(data, requestSpy)
      expect(secretsService.get).toHaveBeenCalledWith(
        entityTenantMock.companyIdentifier
      )
      expect(secretsService.get).toHaveBeenCalledTimes(1)
    })

    it('should throw if SecretsService.get throws', async () => {
      jest.spyOn(secretsService, 'get').mockImplementationOnce(() => {
        throw new Error()
      })
      const data = mockLoginDto()
      const promise = sutAuthController.login(data, requestSpy)
      await expect(promise).rejects.toThrow(
        'O CNPJ, email ou senha são inválidos!'
      )
    })

    it('should call LoadTenantConnectionService.load with correct document', async () => {
      const data = mockLoginDto()
      await sutAuthController.login(data, requestSpy)
      expect(loadTenantConnectionService.load).toHaveBeenCalledWith(
        entityTenantMock.companyIdentifier,
        'any_db_user',
        'any_db_pass'
      )
      expect(loadTenantConnectionService.load).toHaveBeenCalledTimes(1)
    })

    it('should throws if LoadTenantConnectionService.load throws', async () => {
      const data = mockLoginDto()
      jest
        .spyOn(loadTenantConnectionService, 'load')
        .mockImplementationOnce(() => {
          throw new Error()
        })
      const promise = sutAuthController.login(data, requestSpy)
      await expect(promise).rejects.toThrow(new Error())
    })

    it('should throws if LoadTenantConnectionService.load returns null', async () => {
      const data = mockLoginDto()
      jest
        .spyOn(loadTenantConnectionService, 'load')
        .mockResolvedValueOnce(null)
      const promise = sutAuthController.login(data, requestSpy)
      await expect(promise).rejects.toThrow(
        new Error('O CNPJ, email ou senha são inválidos!')
      )
    })

    it('should call UserServiceLazy.load with correct connection', async () => {
      const data = mockLoginDto()
      await sutAuthController.login(data, requestSpy)
      expect(userServiceLazy.load).toHaveBeenCalledWith(
        loadTenantConnectionService.load(
          entityTenantMock.companyIdentifier,
          'any_db_user',
          'any_db_pass'
        )
      )
      expect(userServiceLazy.load).toHaveBeenCalledTimes(1)
    })

    it('should throws if UserServiceLazy.load throws', async () => {
      const data = mockLoginDto()
      jest.spyOn(userServiceLazy, 'load').mockImplementationOnce(() => {
        throw new Error()
      })
      const promise = sutAuthController.login(data, requestSpy)
      await expect(promise).rejects.toThrow(new Error())
    })

    it('should call UserService.findByEmail with correct email', async () => {
      const data = mockLoginDto()
      const userService = userServiceLazy.load('any_connection' as any)
      await sutAuthController.login(data, requestSpy)
      expect(userService.findByEmail).toHaveBeenCalledWith(data.email)
      expect(userService.findByEmail).toHaveBeenCalledTimes(1)
    })

    it('should throws if UserService.findByEmail returns null', async () => {
      const data = mockLoginDto()
      const userService = userServiceLazy.load('any_connection' as any)
      jest
        .spyOn(userService, 'findByEmail')
        .mockReturnValueOnce(Promise.resolve(null))
      const promise = sutAuthController.login(data, requestSpy)
      await expect(promise).rejects.toThrow(
        new Error('O CNPJ, email ou senha são inválidos!')
      )
    })

    it('should throws if UserService.findByEmail throws', async () => {
      const data = mockLoginDto()
      const userService = userServiceLazy.load('any_connection' as any)
      jest.spyOn(userService, 'findByEmail').mockImplementationOnce(() => {
        throw new Error()
      })
      const promise = sutAuthController.login(data, requestSpy)
      await expect(promise).rejects.toThrow(new Error())
    })

    it('should call HashService.verify with correct values', async () => {
      const data = mockLoginDto()
      await sutAuthController.login(data, requestSpy)
      expect(hashService.verify).toHaveBeenCalledWith(
        entityUserMock.password,
        data.password
      )
      expect(hashService.verify).toHaveBeenCalledTimes(1)
    })

    it('should throws if HashService.verify no match', async () => {
      const data = mockLoginDto()
      jest
        .spyOn(hashService, 'verify')
        .mockReturnValueOnce(Promise.resolve(false))
      const promise = sutAuthController.login(data, requestSpy)
      await expect(promise).rejects.toThrow(
        new Error('O CNPJ, email ou senha são inválidos!')
      )
    })

    it('should throws if HashService.verify throws', async () => {
      const data = mockLoginDto()
      jest.spyOn(hashService, 'verify').mockImplementationOnce(() => {
        throw new Error()
      })
      const promise = sutAuthController.login(data, requestSpy)
      await expect(promise).rejects.toThrow(new Error())
    })

    it('should call UserService.getRoles with correct id', async () => {
      const data = mockLoginDto()
      const userService = userServiceLazy.load('any_connection' as any)
      await sutAuthController.login(data, requestSpy)
      expect(userService.getRolesGrouped).toHaveBeenCalledWith(
        entityUserMock.id
      )
      expect(userService.getRolesGrouped).toHaveBeenCalledTimes(1)
    })

    it('should throws if UserService.getRoles throws', async () => {
      const data = mockLoginDto()
      const userService = userServiceLazy.load('any_connection' as any)
      jest.spyOn(userService, 'getRolesGrouped').mockImplementationOnce(() => {
        throw new Error()
      })
      const promise = sutAuthController.login(data, requestSpy)
      await expect(promise).rejects.toThrow(new Error())
    })

    it('should save request session values', async () => {
      const data = mockLoginDto()
      await sutAuthController.login(data, requestSpy)
      expect(requestSpy.session.auth).toEqual({
        tenant: {
          identifier: entityTenantMock.companyIdentifier,
          id: entityTenantMock.id,
          credentials: {
            user: 'any_db_user',
            password: 'any_db_pass'
          }
        },
        user: {
          name: entityUserMock.name,
          id: entityUserMock.id,
          permissions: [
            {
              name: 'sales',
              grants: {
                read: true,
                edit: true,
                create: true,
                delete: true
              },
              options: {
                accountMode: false,
                pinPass: false
              }
            },
            {
              name: 'bathGrooming',
              modules: [
                {
                  name: 'schedule',
                  grants: {
                    read: true,
                    edit: true,
                    create: true,
                    delete: true
                  },
                  options: {}
                },
                {
                  name: 'services',
                  grants: {
                    read: true,
                    edit: true,
                    create: true,
                    delete: true
                  },
                  options: {}
                },
                {
                  name: 'plans',
                  grants: {
                    read: true,
                    edit: true,
                    create: true,
                    delete: true
                  },
                  options: {}
                }
              ]
            }
          ]
        }
      })
    })

    it('should return permissions on success', async () => {
      const data = mockLoginDto()
      const response = await sutAuthController.login(data, requestSpy)
      expect(response).toEqual({
        name: entityUserMock.name,
        id: entityUserMock.id,
        expiresIn: 'any_expires',
        permissions: [
          {
            name: 'sales',
            grants: {
              read: true,
              edit: true,
              create: true,
              delete: true
            },
            options: {
              accountMode: false,
              pinPass: false
            }
          },
          {
            name: 'bathGrooming',
            modules: [
              {
                name: 'schedule',
                grants: {
                  read: true,
                  edit: true,
                  create: true,
                  delete: true
                },
                options: {}
              },
              {
                name: 'services',
                grants: {
                  read: true,
                  edit: true,
                  create: true,
                  delete: true
                },
                options: {}
              },
              {
                name: 'plans',
                grants: {
                  read: true,
                  edit: true,
                  create: true,
                  delete: true
                },
                options: {}
              }
            ]
          }
        ]
      })
    })
  })

  describe('logout ', () => {
    it('should not call destroy when auth no exists', async () => {
      const destroySpy = jest.spyOn(requestSpy.session, 'destroy')
      await sutAuthController.logout(requestSpy)
      expect(destroySpy).toHaveBeenCalledTimes(0)
    })

    it('should call destroy when auth is provided', async () => {
      const destroySpy = jest.spyOn(requestSpy.session, 'destroy')
      const data = mockLoginDto()
      await sutAuthController.login(data, requestSpy)
      await sutAuthController.logout(requestSpy)
      expect(destroySpy).toHaveBeenCalledTimes(1)
    })
  })

  describe('newPassword', () => {
    const querySpy = {
      token: 'any_token'
    }

    it('should call TokenServiceAdapter.verify with correct token', async () => {
      const data = mockUserCreatePasswordDto()
      await sutAuthController.newPassword(data, querySpy as any)
      expect(tokenServiceAdapter.verify).toHaveBeenCalledWith(querySpy.token)
      expect(tokenServiceAdapter.verify).toHaveBeenCalledTimes(1)
    })

    it('should throws if TokenServiceAdapter.verify throws', async () => {
      const data = mockUserCreatePasswordDto()
      jest.spyOn(tokenServiceAdapter, 'verify').mockImplementationOnce(() => {
        throw new Error()
      })
      const promise = sutAuthController.newPassword(data, querySpy)
      await expect(promise).rejects.toThrow()
    })

    it('should call TenantService.findById with correct company id', async () => {
      const data = mockUserCreatePasswordDto()
      await sutAuthController.newPassword(data, querySpy)
      expect(tenantService.findById).toHaveBeenCalledWith('any_company_id')
      expect(tenantService.findById).toHaveBeenCalledTimes(1)
    })

    it('should throws if TenantService.findById throws', async () => {
      const data = mockUserCreatePasswordDto()
      jest.spyOn(tenantService, 'findById').mockImplementationOnce(() => {
        throw new Error()
      })
      const promise = sutAuthController.newPassword(data, querySpy)
      await expect(promise).rejects.toThrow(new Error())
    })

    it('should call LoadTenantConnectionService.load with correct document', async () => {
      const data = mockUserCreatePasswordDto()
      await sutAuthController.newPassword(data, querySpy)
      expect(loadTenantConnectionService.load).toHaveBeenCalledWith(
        entityTenantMock.companyIdentifier,
        'any_db_user',
        'any_db_pass'
      )
      expect(loadTenantConnectionService.load).toHaveBeenCalledTimes(1)
    })

    it('should throws if LoadTenantConnectionService.load throws', async () => {
      const data = mockUserCreatePasswordDto()
      jest
        .spyOn(loadTenantConnectionService, 'load')
        .mockImplementationOnce(() => {
          throw new Error()
        })
      const promise = sutAuthController.newPassword(data, querySpy)
      await expect(promise).rejects.toThrow(new Error())
    })

    it('should call HashService.hash with correct values', async () => {
      const data = mockUserCreatePasswordDto()
      await sutAuthController.newPassword(data, querySpy)
      expect(hashService.hash).toHaveBeenCalledWith(data.password)
      expect(hashService.hash).toHaveBeenCalledTimes(1)
    })

    it('should throws if HashService.hash throws', async () => {
      const data = mockUserCreatePasswordDto()
      jest.spyOn(hashService, 'hash').mockImplementationOnce(() => {
        throw new Error()
      })
      const promise = sutAuthController.newPassword(data, querySpy)
      await expect(promise).rejects.toThrow(new Error())
    })

    it('should call UserServiceLazy.load with correct connection', async () => {
      const data = mockUserCreatePasswordDto()
      await sutAuthController.newPassword(data, querySpy)
      expect(userServiceLazy.load).toHaveBeenCalledWith(
        loadTenantConnectionService.load(
          entityTenantMock.companyIdentifier,
          'any_db_user',
          'any_db_pass'
        )
      )
      expect(userServiceLazy.load).toHaveBeenCalledTimes(1)
    })

    it('should throws if UserServiceLazy.load throws', async () => {
      const data = mockUserCreatePasswordDto()
      jest.spyOn(userServiceLazy, 'load').mockImplementationOnce(() => {
        throw new Error()
      })
      const promise = sutAuthController.newPassword(data, querySpy)
      await expect(promise).rejects.toThrow(new Error())
    })

    it('should call UserService.savePassword with correct values', async () => {
      const data = mockUserCreatePasswordDto()
      const userService = userServiceLazy.load('any_connection' as any)
      await sutAuthController.newPassword(data, querySpy)
      expect(userService.savePassword).toHaveBeenCalledWith(
        'any_user_id',
        'any_hash'
      )
      expect(userService.savePassword).toHaveBeenCalledTimes(1)
    })

    it('should throws if UserService.savePassword throws', async () => {
      const data = mockUserCreatePasswordDto()
      const userService = userServiceLazy.load('any_connection' as any)
      jest.spyOn(userService, 'savePassword').mockImplementationOnce(() => {
        throw new Error()
      })
      const promise = sutAuthController.newPassword(data, querySpy)
      await expect(promise).rejects.toThrow(new Error())
    })
  })
})
