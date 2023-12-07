import { Injectable } from '@nestjs/common'
import { Connection, Repository } from 'typeorm'
import { Module } from '../../entities/module/module.entity'
import { Role } from '../../entities/module/role.entity'

@Injectable()
export class AddRolesSeedService implements SeedProtocol<Connection> {
  private moduleRepository: Repository<Module>
  private roleRepository: Repository<Role>

  async seed(connection: Connection) {
    this.moduleRepository = connection.getRepository(Module)
    this.roleRepository = connection.getRepository(Role)
    await this.addAdminRole()
  }

  async addAdminRole() {
    const hasAdminRole = await this.roleRepository.findOneBy({
      name: 'admin'
    })

    if (hasAdminRole) {
      return
    }

    const allModules = await this.moduleRepository.find({
      relations: ['grants', 'options']
    })

    const associatePermissions = []

    for (const module of allModules) {
      const appendModule = {
        module: {
          id: module.id
        },
        grants: module.grants
      }

      if (module.options.length > 0) {
        const roleOptions = []
        for (const option of module.options) {
          roleOptions.push({
            option
          })
        }
        appendModule['roleOptions'] = roleOptions
      }

      associatePermissions.push(appendModule)
    }

    await this.roleRepository.save({
      name: 'admin',
      permissions: associatePermissions
    })
  }
}
