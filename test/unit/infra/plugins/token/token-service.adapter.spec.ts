import * as jsonwebtoken from 'jsonwebtoken';
import { TokenServiceAdapter } from '@infra/plugins/token/token-service.adapter';

describe('Service: TokenServiceAdapter', () => {
    let sutTokenServiceAdapter: TokenServiceAdapter;

    beforeEach(async () => {
        sutTokenServiceAdapter = new TokenServiceAdapter({
            get: jest.fn().mockReturnValue({
                secret: 'any_secret',
                expiresIn: 'any_expires_in',
            }),
        } as any);
        jest.spyOn(jsonwebtoken, 'sign').mockReturnValue('token_value');
        jest.spyOn(jsonwebtoken, 'verify').mockReturnValue('untoken_value');
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('sign', () => {
        it('should call jsonwebtoken.sign with correct key', async () => {
            sutTokenServiceAdapter.sign({
                key: 'value',
            });
            expect(jsonwebtoken.sign).toBeCalledWith(
                {
                    key: 'value',
                },
                'any_secret',
                {
                    expiresIn: 'any_expires_in',
                },
            );
            expect(jsonwebtoken.sign).toBeCalledTimes(1);
        });

        it('should throws if jsonwebtoken.sign throws', async () => {
            jest.spyOn(jsonwebtoken, 'sign').mockImplementationOnce(() => {
                throw new Error('JWT ERROR');
            });
            expect(() =>
                sutTokenServiceAdapter.sign({ key: 'value' }),
            ).toThrowError('JWT ERROR');
        });

        it('should returns a token value on success', async () => {
            const response = sutTokenServiceAdapter.sign({
                key: 'value',
            });
            expect(response).toBe('token_value');
        });
    });

    describe('verify', () => {
        it('should call jsonwebtoken.verify with correct values', async () => {
            sutTokenServiceAdapter.verify('any_token');
            expect(jsonwebtoken.verify).toBeCalledWith(
                'any_token',
                'any_secret',
            );
            expect(jsonwebtoken.verify).toBeCalledTimes(1);
        });

        it('should return null if jsonwebtoken.verify throws', async () => {
            jest.spyOn(jsonwebtoken, 'verify').mockImplementationOnce(() => {
                throw new Error('JWT ERROR');
            });
            expect(() =>
                sutTokenServiceAdapter.verify('any_token'),
            ).toThrowError('JWT ERROR');
        });

        it('should an untoken value when succeds', async () => {
            const response = sutTokenServiceAdapter.verify('hashed');
            expect(response).toBe('untoken_value');
        });
    });
});
