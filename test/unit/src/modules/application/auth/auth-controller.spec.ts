import { Test, TestingModule } from '@nestjs/testing';
import { mockUserEntity, mockUserPermission } from '../../../../mock/user.mock';
import { mockCompanyEntity } from '../../../../mock/company.mock';
import { mockLoginDto } from '../../../../mock/auth.mock';
import { Tenant } from '@infra/db/app/entities/tenant/tenant.entity';
import { User } from '@infra/db/companies/entities/user/user.entity';
import { HashService } from '@infra/plugins/hash/hash.service';
import { LoadTenantConnectionService } from '@/modules/application/tenant-connection/load-tenant-connection.service';
import { TenantService } from '@/modules/application/tenant/tenant.service';
import { UserServiceLazy } from '@/modules/application/user/user.service.lazy';
import { AuthController } from '@/modules/application/auth/auth.controller';

const requestSpy: any = {
    session: {

    }
}

describe('AuthController', () => {
    let entityTenantMock: Tenant;
    let entityUserMock: User;
    let userPermissionMock: any;
    let sutAuthController: AuthController;
    let tenantService : TenantService;
    let loadTenantConnectionService: LoadTenantConnectionService;
    let userServiceLazy: UserServiceLazy;
    let hashService: HashService;

    beforeEach(async () => {
        entityTenantMock = mockCompanyEntity();
        entityUserMock = mockUserEntity();
        userPermissionMock = mockUserPermission();

        const module: TestingModule = await Test.createTestingModule({
            controllers: [AuthController],
            providers: [
                {
                    provide: TenantService,
                    useValue: {
                        findByDocument: jest.fn().mockResolvedValue(Promise.resolve(entityTenantMock))
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
                        load: jest.fn().mockReturnValue(
                            {
                                findByEmail: jest.fn().mockResolvedValue(Promise.resolve(entityUserMock)),
                                getRoles: jest.fn().mockResolvedValue(Promise.resolve({ role: {permissions: userPermissionMock } }))
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
        tenantService = module.get<TenantService>(TenantService);
        loadTenantConnectionService = module.get<LoadTenantConnectionService>(LoadTenantConnectionService);
        userServiceLazy = module.get<UserServiceLazy>(UserServiceLazy);
        hashService = module.get<HashService>(HashService);
    });

    afterEach(() => {
        jest.clearAllMocks();
    })

    describe('login', () => {
        it('should call TenantService.findByDocument with correct document', async () => {
            const data = mockLoginDto();
            await sutAuthController.login(data, requestSpy);
            expect(tenantService.findByDocument).toHaveBeenCalledWith(data.document);
            expect(tenantService.findByDocument).toHaveBeenCalledTimes(1);
        });

        it('should throws if TenantService.findByDocument returns null', async () => {
            const data = mockLoginDto();
            jest.spyOn(tenantService, 'findByDocument').mockReturnValueOnce(Promise.resolve(null));
            const promise = sutAuthController.login(data, requestSpy);
            await expect(promise).rejects.toThrow(new Error('O CNPJ, email ou senha são inválidos!'));
        });

        it('should throws if TenantService.findByDocument throws', async () => {
            const data = mockLoginDto();
            jest.spyOn(tenantService, 'findByDocument').mockImplementationOnce(() => {
                throw new Error();
            });
            const promise = sutAuthController.login(data, requestSpy);
            await expect(promise).rejects.toThrow(new Error());
        });

        it('should call LoadTenantConnectionService.load with correct document', async () => {
            const data = mockLoginDto();
            await sutAuthController.login(data, requestSpy);
            expect(loadTenantConnectionService.load).toHaveBeenCalledWith(entityTenantMock.companyIdentifier);
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

        it('should throws if LoadTenantConnectionService.load returns null', async () => {
            const data = mockLoginDto();
            jest.spyOn(loadTenantConnectionService, 'load').mockResolvedValueOnce(null);
            const promise = sutAuthController.login(data, requestSpy);
            await expect(promise).rejects.toThrow(new Error('O CNPJ, email ou senha são inválidos!'));
        });

        it('should call UserServiceLazy.load with correct connection', async () => {
            const data = mockLoginDto();
            await sutAuthController.login(data, requestSpy);
            expect(userServiceLazy.load).toHaveBeenCalledWith(loadTenantConnectionService.load(entityTenantMock.companyIdentifier));
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

        it('should call UserService.getRoles with correct uuid', async () => {
            const data = mockLoginDto();
            const userService = userServiceLazy.load('any_connection' as any);
            await sutAuthController.login(data, requestSpy);
            expect(userService.getRoles).toHaveBeenCalledWith(entityUserMock.uuid);
            expect(userService.getRoles).toHaveBeenCalledTimes(1);
        });

        it('should throws if UserService.getRoles throws', async () => {
            const data = mockLoginDto();
            const userService = userServiceLazy.load('any_connection' as any);
            jest.spyOn(userService, 'getRoles').mockImplementationOnce(() => {
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
                    identifier: entityTenantMock.companyIdentifier,
                    uuid: entityTenantMock.uuid
                },
                user: {
                    name: entityUserMock.name,
                    uuid: entityUserMock.uuid,
                    permissions: [
                        {
                            module: {
                                name: 'sales',
                                grants: [
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
                            grants: [
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