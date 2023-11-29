import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { UserAppController } from '@/modules/application/user/user.app.controller';
import { TokenServiceAdapter } from '@infra/plugins/token/token-service.adapter';

describe('Controller: UserAppController', () => {
    let sutUserAppController: UserAppController;
    let configService: ConfigService;
    let tokenServiceAdapter: TokenServiceAdapter;
    let responseSpy: any;
    let querySpy: any;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                {
                    provide: ConfigService,
                    useValue: {
                        get: jest.fn().mockReturnValue({
                            getUrl: 'http://any_url',
                        }),
                    },
                },
                {
                    provide: TokenServiceAdapter,
                    useValue: {
                        verify: jest.fn().mockReturnValue({
                            userName: 'any_user_name',
                            companyName: 'any_company_name',
                            postUrl: 'any_post_url',
                        }),
                    },
                },
            ],
            controllers: [UserAppController],
        }).compile();

        responseSpy = {
            render: jest.fn(),
        };
        querySpy = {
            token: 'any_token',
        };
        configService = module.get<ConfigService>(ConfigService);
        tokenServiceAdapter =
            module.get<TokenServiceAdapter>(TokenServiceAdapter);
        sutUserAppController = module.get<UserAppController>(UserAppController);
    });

    describe('SutUserAppController.postUrl', () => {
        it('should SutUserAppController have postUrl property filled by ConfigService', async () => {
            const postUrl = (sutUserAppController as any).postUrl;
            expect(configService.get).toHaveBeenCalledTimes(1);
            expect(configService.get).toHaveBeenCalledWith('app');
            expect(postUrl).toBe('http://any_url');
        });
    });

    describe('newPassword', () => {
        it('should call TokenServiceAdapter.verify with correct values', async () => {
            sutUserAppController.newPassword(
                responseSpy as any,
                querySpy as any,
            );
            expect(tokenServiceAdapter.verify).toBeCalledWith(querySpy.token);
            expect(tokenServiceAdapter.verify).toBeCalledTimes(1);
        });

        it('should throws if TokenServiceAdapter.verify throws', async () => {
            jest.spyOn(tokenServiceAdapter, 'verify').mockImplementationOnce(
                () => {
                    throw new Error('TOKEN SERVICE ADAPTER ERROR');
                },
            );
            expect(() =>
                sutUserAppController.newPassword(
                    responseSpy as any,
                    querySpy as any,
                ),
            ).toThrowError('TOKEN SERVICE ADAPTER ERROR');
        });

        it('should res.render with correct values', async () => {
            sutUserAppController.newPassword(
                responseSpy as any,
                querySpy as any,
            );
            expect(responseSpy.render).toBeCalledWith('user-new-password', {
                name: 'any_user_name',
                companyName: 'any_company_name',
                postUrl: 'http://any_url/api/auth/new-password?token=any_token',
            });
            expect(responseSpy.render).toBeCalledTimes(1);
        });
    });
});
