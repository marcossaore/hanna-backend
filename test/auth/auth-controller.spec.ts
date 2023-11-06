import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from '../../src/auth/auth.controller';
import { User } from '../../db/companies/entities/user/user.entity';
import { Company } from '../../db/app/entities/company/company.entity';
import { CompanyService } from '../../src/company/company.service';
import { LoadTenantConnectionService } from '../../src/tenant-connection/load-tenant-connection.service';
import { UserServiceLazy } from '../../src/user/user.service.lazy';
import { HashService } from '../../src/_common/services/Password/hash.service';
import { mockLoginDto } from '../mock/auth.mock';
import { mockUserEntity, mockUserPermission } from '../mock/user.mock';
import { mockCompanyEntity } from '../mock/company.mock';

const requestSpy: any = {
    session: {

    }
}

describe('AuthController', () => {
  let sutAuthController: AuthController;
  let companyService : CompanyService;
  let loadTenantConnectionService: LoadTenantConnectionService;
  let userServiceLazy: UserServiceLazy;
  let hashService: HashService;
  let entityCompanyMock: Company;
  let entityUserMock: User;
  let userPermissionMock: any;

  beforeEach(async () => {

    entityCompanyMock = mockCompanyEntity();
    entityUserMock = mockUserEntity();
    userPermissionMock = mockUserPermission();

    const module: TestingModule = await Test.createTestingModule({
        controllers: [AuthController],
        providers: [
            {
                provide: CompanyService,
                useValue: {
                    findByDocument: jest.fn().mockResolvedValue(Promise.resolve(entityCompanyMock))
                }
            },
            {
                provide: LoadTenantConnectionService,
                useValue: {
                    load: jest.fn()
                }
            },
            {
                provide: UserServiceLazy,
                useValue: {
                    load: jest.fn().mockReturnValue(
                        {
                            findByEmail: jest.fn().mockResolvedValue(Promise.resolve(entityUserMock)),
                            getModulesPermission: jest.fn().mockResolvedValue(Promise.resolve({ permissions: userPermissionMock }))
                        }
                    )
                }
            },
            {
                provide: HashService,
                useValue: {
                    verify: jest.fn().mockResolvedValue(Promise.resolve(true))
                }
            }
        ]
    }).compile();

    sutAuthController = module.get<AuthController>(AuthController);
    companyService = module.get<CompanyService>(CompanyService);
    loadTenantConnectionService = module.get<LoadTenantConnectionService>(LoadTenantConnectionService);
    userServiceLazy = module.get<UserServiceLazy>(UserServiceLazy);
    hashService = module.get<HashService>(HashService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  })

    describe('login', () => {
        it('should call CompanyService.findByDocument with correct document', async () => {
            const data = mockLoginDto();
            await sutAuthController.login(data, requestSpy);
            expect(companyService.findByDocument).toHaveBeenCalledWith(data.document);
            expect(companyService.findByDocument).toHaveBeenCalledTimes(1);
        });

        it('should throws if CompanyService.findByDocument returns null', async () => {
            const data = mockLoginDto();
            jest.spyOn(companyService, 'findByDocument').mockReturnValueOnce(Promise.resolve(null));
            const promise = sutAuthController.login(data, requestSpy);
            await expect(promise).rejects.toThrow(new Error('O CNPJ, email ou senha são inválidos!'));
        });

        it('should throws if CompanyService.findByDocument throws', async () => {
            const data = mockLoginDto();
            jest.spyOn(companyService, 'findByDocument').mockImplementationOnce(() => {
                throw new Error();
            });
            const promise = sutAuthController.login(data, requestSpy);
            await expect(promise).rejects.toThrow(new Error());
        });

        it('should call LoadTenantConnectionService.load with correct document', async () => {
            const data = mockLoginDto();
            await sutAuthController.login(data, requestSpy);
            expect(loadTenantConnectionService.load).toHaveBeenCalledWith(entityCompanyMock.companyIdentifier);
            expect(loadTenantConnectionService.load).toHaveBeenCalledTimes(1);
        });

        it('should throws if LoadTenantConnectionService.load throws', async () => {
            const data = mockLoginDto();
            jest.spyOn(loadTenantConnectionService, 'load').mockImplementationOnce(() => {
                throw new Error();
            });
            const promise = sutAuthController.login(data, requestSpy);
            await expect(promise).rejects.toThrow(new Error());
        });

        it('should call UserServiceLazy.load with correct connection', async () => {
            const data = mockLoginDto();
            await sutAuthController.login(data, requestSpy);
            expect(userServiceLazy.load).toHaveBeenCalledWith(loadTenantConnectionService.load(entityCompanyMock.companyIdentifier));
            expect(userServiceLazy.load).toHaveBeenCalledTimes(1);
        });

        it('should throws if UserServiceLazy.load throws', async () => {
            const data = mockLoginDto();
            jest.spyOn(userServiceLazy, 'load').mockImplementationOnce(() => {
                throw new Error();
            });
            const promise = sutAuthController.login(data, requestSpy);
            await expect(promise).rejects.toThrow(new Error());
        });

        it('should call UserService.findByEmail with correct email', async () => {
            const data = mockLoginDto();
            const userService = userServiceLazy.load('any_connection' as any);
            await sutAuthController.login(data, requestSpy);
            expect(userService.findByEmail).toHaveBeenCalledWith(data.email);
            expect(userService.findByEmail).toHaveBeenCalledTimes(1);
        });

        it('should throws if UserService.findByEmail returns null', async () => {
            const data = mockLoginDto();
            const userService = userServiceLazy.load('any_connection' as any);
            jest.spyOn(userService, 'findByEmail').mockReturnValueOnce(Promise.resolve(null));
            const promise = sutAuthController.login(data, requestSpy);
            await expect(promise).rejects.toThrow(new Error('O CNPJ, email ou senha são inválidos!'));
        });

        it('should throws if UserService.findByEmail throws', async () => {
            const data = mockLoginDto();
            const userService = userServiceLazy.load('any_connection' as any);
            jest.spyOn(userService, 'findByEmail').mockImplementationOnce(() => {
                throw new Error();
            });
            const promise = sutAuthController.login(data, requestSpy);
            await expect(promise).rejects.toThrow(new Error());
        });

        it('should call HashService.verify with correct values', async () => {
            const data = mockLoginDto();
            await sutAuthController.login(data, requestSpy);
            expect(hashService.verify).toHaveBeenCalledWith(entityUserMock.password, data.password);
            expect(hashService.verify).toHaveBeenCalledTimes(1);
        });

        it('should throws if HashService.verify no match', async () => {
            const data = mockLoginDto();
            jest.spyOn(hashService, 'verify').mockReturnValueOnce(Promise.resolve(false));
            const promise = sutAuthController.login(data, requestSpy);
            await expect(promise).rejects.toThrow(new Error('O CNPJ, email ou senha são inválidos!'));
        });

        it('should throws if HashService.verify throws', async () => {
            const data = mockLoginDto();
            jest.spyOn(hashService, 'verify').mockImplementationOnce(() => {
                throw new Error();
            });
            const promise = sutAuthController.login(data, requestSpy);
            await expect(promise).rejects.toThrow(new Error());
        });

        it('should call UserService.getModulesPermission with correct uuid', async () => {
            const data = mockLoginDto();
            const userService = userServiceLazy.load('any_connection' as any);
            await sutAuthController.login(data, requestSpy);
            expect(userService.getModulesPermission).toHaveBeenCalledWith(entityUserMock.uuid);
            expect(userService.getModulesPermission).toHaveBeenCalledTimes(1);
        });

        it('should throws if UserService.getModulesPermission throws', async () => {
            const data = mockLoginDto();
            const userService = userServiceLazy.load('any_connection' as any);
            jest.spyOn(userService, 'getModulesPermission').mockImplementationOnce(() => {
                throw new Error();
            });
            const promise = sutAuthController.login(data, requestSpy);
            await expect(promise).rejects.toThrow(new Error());
        });

        it('should save request session values', async () => {
            const data = mockLoginDto();
            await sutAuthController.login(data, requestSpy);
            expect(requestSpy.session.auth).toEqual({
                tenant: {
                    identifier: entityCompanyMock.companyIdentifier,
                    uuid: entityCompanyMock.uuid
                },
                user: {
                    name: entityUserMock.name,
                    uuid: entityUserMock.uuid,
                    permissions: [
                        {
                            module: {
                                name: 'sales',
                                actions: [
                                    {
                                        id: 1,
                                        name: 'read'
                                    },
                                    {
                                        id: 2,
                                        name: 'create'
                                    },
                                    {
                                        id: 3,
                                        name: 'edit'
                                    },
                                    {
                                        id: 4,
                                        name: 'delete'
                                    }
                                ],
                                options: [
                                    {
                                        id: 1,
                                        name: 'pinPass'
                                    },
                                    {
                                        id: 2,
                                        name: 'accountMode'
                                    }
                                ]
                            }
                        }
                    ]
                },
            });
        });

        it('should return permissions on success ', async () => {
            const data = mockLoginDto();
            const response = await sutAuthController.login(data, requestSpy);
            expect(response).toEqual({
                name: entityUserMock.name,
                uuid: entityUserMock.uuid,
                permissions: [
                    {
                        module: {
                            name: 'sales',
                            actions: [
                                {
                                    id: 1,
                                    name: 'read'
                                },
                                {
                                    id: 2,
                                    name: 'create'
                                },
                                {
                                    id: 3,
                                    name: 'edit'
                                },
                                {
                                    id: 4,
                                    name: 'delete'
                                }
                            ],
                            options: [
                                {
                                    id: 1,
                                    name: 'pinPass'
                                },
                                {
                                    id: 2,
                                    name: 'accountMode'
                                }
                            ]
                        }
                    }
                ]
            });
        });

    });
});
