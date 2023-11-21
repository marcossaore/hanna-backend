import * as argon2 from 'argon2';
import { HashService } from '@/_common/services/Password/hash.service';

jest.mock('argon2');

describe('Service: HashService', () => {
    let sutHashService: HashService;

    beforeEach(async () => {
        sutHashService = new HashService();
        jest.spyOn(argon2, 'hash').mockReturnValue(Promise.resolve('hashed_value'));
        jest.spyOn(argon2, 'verify').mockReturnValue(Promise.resolve(true));
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('hash', () => {
        it('should call argon2.hash with correct key', async () => {
            await sutHashService.hash('any_hash');
            expect(argon2.hash).toBeCalledWith('any_hash');
            expect(argon2.hash).toBeCalledTimes(1);
        });

        it('should throws if argon2.hash throws', async () => {
            jest.spyOn(argon2, 'hash').mockImplementationOnce(() => {
                throw new Error();
            });
            const promise = sutHashService.hash('any_hash');
            await expect(promise).rejects.toThrow();
        });

        it('should returns a hashed value on success', async () => {
            const response = await sutHashService.hash('any_hash');
            expect(response).toBe('hashed_value');
        });
    });

    describe('verify', () => {
        it('should call argon2.verify with correct values', async () => {
            await sutHashService.verify('hashed', 'key');
            expect(argon2.verify).toBeCalledWith('hashed', 'key');
            expect(argon2.verify).toBeCalledTimes(1);
        });

        it('should throws if argon2.hash throws', async () => {
            jest.spyOn(argon2, 'verify').mockImplementationOnce(() => {
                throw new Error();
            });
            const promise = sutHashService.verify('hashed', 'key');
            await expect(promise).rejects.toThrow();
        });

        it('should returns true when succeds', async () => {
            const response = await sutHashService.verify('hashed', 'key');
            expect(response).toBe(true);
        });
    });
});