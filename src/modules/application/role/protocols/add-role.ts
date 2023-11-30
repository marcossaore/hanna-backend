import { Role } from '@infra/db/companies/entities/module/role.entity'
import { User } from '@infra/db/companies/entities/user/user.entity'
import { Connection, Repository } from 'typeorm'

export abstract class AddRole {
  protected roleRepository: Repository<Role>
  protected user: User

  constructor(private readonly connection: Connection) {
    this.roleRepository = this.connection.getRepository(Role)
  }

  abstract add(user: User): Promise<User>

  protected async deleteExistingRole(): Promise<void> {
    const existsRoleToUser = await this.roleRepository.findOneBy({
      user: this.user
    })

    if (existsRoleToUser) {
      this.roleRepository.delete(existsRoleToUser)
    }
  }
}
