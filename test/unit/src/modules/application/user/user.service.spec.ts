import { Test, TestingModule } from '@nestjs/testing'
import {
  mockUserEntity,
  mockUserPermissionForRoleGrouped
} from '../../../../mock/user.mock'
import { User } from '@infra/db/companies/entities/user/user.entity'
import { UserService } from '@/modules/application/user/user.service'
import { faker } from '@faker-js/faker'

describe('Service: UserService', () => {
  let sutUserService: UserService
  let userRepository: any
  let userMock: User
  let permissionMock: any

  beforeEach(async () => {
    userMock = mockUserEntity()
    permissionMock = mockUserPermissionForRoleGrouped()
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: 'CONNECTION',
          useValue: {
            getRepository: jest.fn()
          }
        },
        UserService
      ]
    }).compile()

    sutUserService = module.get<UserService>(UserService)
    userRepository = (sutUserService as any).userRepository = {
      findOneBy: jest.fn().mockResolvedValue(userMock),
      save: jest.fn().mockResolvedValue(userMock),
      findOne: jest.fn().mockResolvedValue(permissionMock)
    }
  })

  describe('findByEmail', () => {
    it('should call UserRepository.findOneBy with correct value', async () => {
      await sutUserService.findByEmail('any_email')
      expect(userRepository.findOneBy).toBeCalledWith({
        email: 'any_email'
      })
      expect(userRepository.findOneBy).toBeCalledTimes(1)
    })

    it('should return null if UserRepository.findOneBy returns null', async () => {
      jest.spyOn(userRepository, 'findOneBy').mockReturnValueOnce(null)
      const response = await sutUserService.findByEmail('any_email')
      expect(response).toBe(null)
    })

    it('should throws if UserRepository.findOneBy throws', async () => {
      jest.spyOn(userRepository, 'findOneBy').mockImplementationOnce(() => {
        throw new Error()
      })
      const promise = sutUserService.findByEmail('any_email')
      await expect(promise).rejects.toThrow()
    })

    it('should returns user on success', async () => {
      const response = await sutUserService.findByEmail('any_email')
      expect(response).toEqual(userMock)
    })
  })

  describe('save', () => {
    it('should call UserRepository.save with correct values', async () => {
      await sutUserService.save({ name: 'user_name' })
      expect(userRepository.save).toBeCalledWith({ name: 'user_name' })
      expect(userRepository.save).toBeCalledTimes(1)
    })

    it('should return null if UserRepository.save returns null', async () => {
      jest.spyOn(userRepository, 'save').mockReturnValueOnce(null)
      const response = await sutUserService.save({ name: 'user_name' })
      expect(response).toBe(null)
    })

    it('should throws if UserRepository.save throws', async () => {
      jest.spyOn(userRepository, 'save').mockImplementationOnce(() => {
        throw new Error()
      })
      const promise = sutUserService.save({ name: 'user_name' })
      await expect(promise).rejects.toThrow()
    })

    it('should returns user on success', async () => {
      const response = await sutUserService.save({ name: 'user_name' })
      expect(response).toEqual(userMock)
    })
  })

  describe('addRole', () => {
    const mockDate = faker.date.anytime()
    const roleSpy = {
      add(user: any) {
        user.role = {
          id: 1,
          name: 'any_role',
          createdAt: mockDate,
          updatedAt: mockDate,
          permissions: [
            {
              id: 1,
              createdAt: mockDate,
              updatedAt: mockDate
            },
            {
              id: 2,
              createdAt: mockDate,
              updatedAt: mockDate
            }
          ]
        }
        return user
      }
    }

    it('should call UserRepository.findOneBy with correct id', async () => {
      await sutUserService.addRole('any_id', roleSpy as any)
      expect(userRepository.findOneBy).toBeCalledWith({
        id: 'any_id'
      })
      expect(userRepository.findOneBy).toBeCalledTimes(1)
    })

    it('should throws if UserRepository.findOneBy throws', async () => {
      jest.spyOn(userRepository, 'findOneBy').mockImplementationOnce(() => {
        throw new Error()
      })
      const promise = sutUserService.addRole('any_id', roleSpy as any)
      await expect(promise).rejects.toThrow()
    })

    it('should call AddRole.add with correct user', async () => {
      const addRoleSpy = jest.spyOn(roleSpy, 'add')
      await sutUserService.addRole('any_id', roleSpy as any)
      expect(addRoleSpy).toBeCalledWith(userMock)
      expect(addRoleSpy).toBeCalledTimes(1)
    })

    it('should throws AddRole.add  throws', async () => {
      jest.spyOn(roleSpy, 'add').mockImplementationOnce(() => {
        throw new Error()
      })
      const promise = sutUserService.addRole('any_id', roleSpy as any)
      await expect(promise).rejects.toThrow()
    })

    it('should call UserRepository.save user with roles', async () => {
      await sutUserService.addRole('any_id', roleSpy as any)
      expect((userMock as any).role).toBeTruthy()
      expect((userMock as any).role.permissions.length).toBe(2)
      expect(userRepository.save).toBeCalledWith(userMock)
      expect(userRepository.save).toBeCalledTimes(1)
    })

    it('should throws if UserRepository.save throws', async () => {
      jest.spyOn(userRepository, 'save').mockImplementationOnce(() => {
        throw new Error()
      })
      const promise = sutUserService.addRole('any_id', roleSpy as any)
      await expect(promise).rejects.toThrow()
    })

    it('should returns user on success', async () => {
      const response = await sutUserService.save({ name: 'user_name' })
      expect(response).toEqual(userMock)
    })
  })

  describe('getRoles', () => {
    it('should call UserRepository.findOne with correct value', async () => {
      await sutUserService.getRoles('any_id')
      expect(userRepository.findOne).toBeCalledWith({
        relations: [
          'role.permissions.grants',
          'role.permissions.module',
          'role.permissions.roleOptions.option'
        ],
        where: {
          id: 'any_id'
        },
        select: {
          id: true,
          name: true
        }
      })
      expect(userRepository.findOne).toBeCalledTimes(1)
    })

    it('should throws if UserRepository.getRoles throws', async () => {
      jest.spyOn(userRepository, 'findOne').mockImplementationOnce(() => {
        throw new Error()
      })
      const promise = sutUserService.getRoles('any_id')
      await expect(promise).rejects.toThrow()
    })

    it('should return modules on success', async () => {
      const response = await sutUserService.getRoles('any_id')
      expect(response).toEqual(permissionMock)
    })
  })

  describe('getRolesGrouped', () => {
    it('should call getRoles from service with correct value', async () => {
      const getRolesSpy = jest.spyOn(sutUserService as any, 'getRoles')
      await sutUserService.getRolesGrouped('any_id')
      expect(getRolesSpy).toBeCalledTimes(1)
      expect(getRolesSpy).toHaveBeenCalledWith('any_id')
    })

    it('should throws if getRoles throws', async () => {
      jest
        .spyOn(sutUserService as any, 'getRoles')
        .mockImplementationOnce(() => {
          throw new Error()
        })
      const promise = sutUserService.getRolesGrouped('any_id')
      await expect(promise).rejects.toThrow()
    })

    it('should return modules on success', async () => {
      const response = await sutUserService.getRolesGrouped('any_id')
      expect(response).toEqual([
        {
          grants: {
            create: true,
            delete: true,
            edit: true,
            read: true
          },
          name: 'sales',
          options: {
            accountMode: false,
            pinPass: true
          }
        },
        {
          modules: [
            {
              grants: {
                create: true,
                delete: true,
                edit: true,
                read: true
              },
              name: 'schedule',
              options: {}
            }
          ],
          name: 'bathGrooming'
        }
      ])
    })
  })

  describe('savePassword', () => {
    it('should call UserRepository.findOne with correct values', async () => {
      await sutUserService.savePassword('any_id', 'any_pass')
      expect(userRepository.findOne).toBeCalledWith({
        where: {
          id: 'any_id'
        }
      })
      expect(userRepository.findOne).toBeCalledTimes(1)
    })

    it('should throws if UserRepository.findOne throws', async () => {
      jest.spyOn(userRepository, 'findOne').mockImplementationOnce(() => {
        throw new Error()
      })
      const promise = sutUserService.savePassword('any_id', 'any_pass')
      await expect(promise).rejects.toThrow()
    })

    it('should call UserRepository.save user with new password', async () => {
      jest.spyOn(userRepository, 'findOne').mockResolvedValueOnce(userMock)
      await sutUserService.savePassword('any_id', 'any_pass')
      expect(userMock.password).toBe('any_pass')
      expect(userRepository.save).toBeCalledWith(userMock)
      expect(userRepository.save).toBeCalledTimes(1)
    })

    it('should throws if UserRepository.save throws', async () => {
      jest.spyOn(userRepository, 'save').mockImplementationOnce(() => {
        throw new Error()
      })
      const promise = sutUserService.savePassword('any_id', 'any_pass')
      await expect(promise).rejects.toThrow()
    })

    it('should not return on success', async () => {
      const response = await sutUserService.savePassword('any_id', 'any_pass')
      expect(response).toBeUndefined()
    })
  })
})
