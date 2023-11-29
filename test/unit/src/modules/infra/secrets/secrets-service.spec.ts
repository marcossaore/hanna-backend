import { Test, TestingModule } from '@nestjs/testing';
import { SecretsService } from '@/modules/infra/secrets/secrets-service';

describe('Service: SecretsService', () => {
    let sutSecretsService: SecretsService;
    let secretsManager: any;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                {
                    provide: 'SECRETS_MANAGER',
                    useValue: {
                        save: jest.fn(),
                        get: jest.fn().mockResolvedValue(Promise.resolve(null)),
                    },
                },
                SecretsService,
            ],
        }).compile();

        sutSecretsService = module.get<SecretsService>(SecretsService);
        secretsManager = module.get('SECRETS_MANAGER');
    });

    describe('save', () => {
        it('should call SecretsManager.save with correct values', async () => {
            await sutSecretsService.save('any_key', 'any_data');
            expect(secretsManager.get).toBeCalledTimes(1);
            expect(secretsManager.get).toHaveBeenCalledWith('any_key');
            expect(secretsManager.save).toBeCalledTimes(1);
            expect(secretsManager.save).toBeCalledWith('any_key', 'any_data');
        });

        it('should throws if SecretsManager.save throws (get)', async () => {
            jest.spyOn(secretsManager, 'get').mockImplementationOnce(() => {
                throw new Error();
            });
            const promise = sutSecretsService.save('any_key', 'any_data');
            await expect(promise).rejects.toThrow();
        });

        it('should throws if SecretsManager.save throws (save)', async () => {
            jest.spyOn(secretsManager, 'save').mockImplementationOnce(() => {
                throw new Error();
            });
            const promise = sutSecretsService.save('any_key', 'any_data');
            await expect(promise).rejects.toThrow();
        });

        it('should throws if SecretsManager.get returns some value', async () => {
            jest.spyOn(secretsManager, 'get').mockResolvedValueOnce({
                key: 'value ',
            });
            const promise = sutSecretsService.save('any_key', 'any_data');
            await expect(promise).rejects.toThrow(
                'Secret informed already exists!',
            );
        });
    });

    describe('get', () => {
        it('should call SecretsManager.get with correct values', async () => {
            await sutSecretsService.get('any_key');
            expect(secretsManager.get).toBeCalledTimes(1);
            expect(secretsManager.get).toHaveBeenCalledWith('any_key');
        });

        it('should throws if SecretsManager.get throws', async () => {
            jest.spyOn(secretsManager, 'get').mockImplementationOnce(() => {
                throw new Error();
            });
            const promise = sutSecretsService.save('any_key', 'any_data');
            await expect(promise).rejects.toThrow();
        });

        it('should return null if SecretsManager.get no returns', async () => {
            const response = await sutSecretsService.get('any_key');
            expect(response).toBeNull();
        });

        it('should return data if SecretsManager.get returns', async () => {
            jest.spyOn(secretsManager, 'get').mockResolvedValueOnce({
                key: 'value',
            });
            const response = await sutSecretsService.get('any_key');
            expect(response).toEqual({
                key: 'value',
            });
        });
    });
});
