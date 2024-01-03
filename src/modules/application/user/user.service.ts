import { Inject, Injectable } from '@nestjs/common'
import { Connection, Repository } from 'typeorm'
import { User } from '@infra/db/companies/entities/user/user.entity'
import { AddRole } from '../role/protocols/add-role'

@Injectable()
export class UserService {
  private readonly userRepository: Repository<User>

  constructor(@Inject('CONNECTION') private readonly connection: Connection) {
    this.userRepository = this.connection.getRepository(User)
  }

  async findByEmail(email: string): Promise<any> {
    return this.userRepository.findOneBy({
      email
    })
  }

  async save(data: Partial<User>): Promise<User> {
    const user = await this.userRepository.save(data)
    return user
  }

  async addRole(id: string, addRole: AddRole): Promise<void> {
    const user = await this.userRepository.findOneBy({ id })
    const userWithRoles = await addRole.add(user)
    await this.userRepository.save(userWithRoles)
  }

  async hasRole (userId: string, module: string, grant: string): Promise<any> {
    const roleForUser = await this.userRepository.findOne({
      relations: [
        'role.permissions.grants',
        'role.permissions.module',
        'role.permissions.roleOptions.option'
      ],
      where: {
        id: userId,
        role: {
          permissions: {
            grants: {
              name: grant
            },
            module: {
              name: module
            }
          }
        }
      },
    })

    if (!roleForUser) {
      return {
        module,
        [grant]: false,
        options: []
      }
    }

    let options = []

    const permission = roleForUser.role.permissions[0];
    const activeOptions = permission.roleOptions.filter(({ isActive }) => isActive )
    
    if (activeOptions.length > 0) {
      options = activeOptions.map(({ option }) => option.name )
    }

    return {
      module,
      [grant]: true,
      options
    }
  }

  async getRoles(id: string): Promise<User> {
    const user = await this.userRepository.findOne({
      relations: [
        'role.permissions.grants',
        'role.permissions.module',
        'role.permissions.roleOptions.option'
      ],
      where: {
        id
      },
      select: {
        id: true,
        name: true
      }
    })
    return user
  }

  async getRolesGrouped(id: string): Promise<any> {
    const user = await this.getRoles(id)
    const permissions = []
    for (const { module, roleOptions, grants } of user.role.permissions) {
      let hasBelongsTo = -1

      for (let index = 0; index < permissions.length; index++) {
        const permission = permissions[index]
        if (module.belongsTo && permission.name === module.belongsTo) {
          hasBelongsTo = index
        }
      }

      const options = {}

      for (const { isActive, option } of roleOptions) {
        options[option.name] = isActive
      }

      const grantsAsObj = {
        read: false,
        edit: false,
        create: false,
        delete: false
      }

      for (const { name } of grants) {
        grantsAsObj[name] = true
      }

      if (hasBelongsTo >= 0) {
        permissions[hasBelongsTo].modules.push({
          name: module.name,
          grants: grantsAsObj,
          options: options
        })
      } else {
        if (!module.belongsTo) {
          permissions.push({
            name: module.name,
            grants: grantsAsObj,
            options: options
          })
        } else {
          permissions.push({
            name: module.belongsTo,
            modules: [
              {
                name: module.name,
                grants: grantsAsObj,
                options: options
              }
            ]
          })
        }
      }
    }
    return permissions
  }

  async savePassword(id: string, hashedPassword: string): Promise<void> {
    const user = await this.userRepository.findOne({
      where: {
        id
      }
    })
    user.password = hashedPassword
    await this.userRepository.save(user)
  }
}
