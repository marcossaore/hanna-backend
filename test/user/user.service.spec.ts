import { Test, TestingModule } from '@nestjs/testing';
import { mockUserEntity, mockUserPermission } from '../mock/user.mock';
import { User } from '@db/companies/entities/user/user.entity';
import { UserService } from '@/user/user.service';

describe('Service: UserService', () => {
    let sutUserService: UserService;
    let userRepository: any;
    let userMock: User
    let permissionMock: any

    beforeEach(async () => {
        userMock = mockUserEntity();
        permissionMock = mockUserPermission();
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                {
                    provide: 'CONNECTION',
                    useValue: {
                        getRepository: jest.fn()
                    }
                },
                UserService
            ],
        }).compile();

        sutUserService = module.get<UserService>(UserService);
        userRepository = (sutUserService as any).userRepository = {
            findOneBy: jest.fn().mockResolvedValue(userMock),
            findOne: jest.fn().mockResolvedValue(permissionMock),
        };
    });

    describe('findByEmail', () => {
        it('should call UserRepository.findOneBy with correct value', async () => {
            await sutUserService.findByEmail('any_email');
            expect(userRepository.findOneBy).toBeCalledWith({ email: 'any_email' });
            expect(userRepository.findOneBy).toBeCalledTimes(1);
        });

        it('should return null if UserRepository.findOneBy returns null', async () => {
            jest.spyOn(userRepository, 'findOneBy').mockReturnValueOnce(null);
            const response = await sutUserService.findByEmail('any_email');
            expect(response).toBe(null);
        });

        it('should throws if UserRepository.findOneBy throws', async () => {
            jest.spyOn(userRepository, 'findOneBy').mockImplementationOnce(() => {
                throw new Error();
            });
            const promise = sutUserService.findByEmail('any_email');
            await expect(promise).rejects.toThrow();
        });

        it('should returns user on success', async () => {
            const response = await sutUserService.findByEmail('any_email');
            expect(response).toEqual(userMock);
        });
    });

    describe('getModulesPermission', () => {
        it('should call UserRepository.findOne with correct value', async () => {
            await sutUserService.getModulesPermission('any_uuid');
            expect(userRepository.findOne).toBeCalledWith(
                {
                    relations: ['permissions.module', 'permissions.actions', 'permissions.options'],
                    where: {
                        uuid: 'any_uuid'
                    },
                    select: {
                        id: true,
                        permissions: {
                            id: true,
                            module: {
                                id: false,
                                name: true
                            },
                            actions: {
                                id: true,
                                name: true
                            },
                            options: {
                                id: true,
                                name: true
                            }
                        }
                    }
                }
            );
            expect(userRepository.findOne).toBeCalledTimes(1);
        });

        it('should throws if UserRepository.findOne throws', async () => {
            jest.spyOn(userRepository, 'findOne').mockImplementationOnce(() => {
                throw new Error();
            });
            const promise = sutUserService.getModulesPermission('any_uuid');
            await expect(promise).rejects.toThrow();
        });

        it('should return modules on success', async () => {
            const response = await sutUserService.getModulesPermission('any_uuid');
            expect(response).toEqual(permissionMock);
        });
    });
});
