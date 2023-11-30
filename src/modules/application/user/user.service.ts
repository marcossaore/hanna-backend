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

  async addRole(uuid: string, addRole: AddRole): Promise<void> {
    const user = await this.userRepository.findOneBy({ uuid })
    const userWithRoles = await addRole.add(user)
    await this.userRepository.save(userWithRoles)
  }

  async getRoles(uuid: string): Promise<User> {
    const user = await this.userRepository.findOne({
      relations: [
        'role.permissions.module.grants',
        'role.permissions.module.options'
      ],
      where: {
        uuid
      },
      select: {
        id: true,
        uuid: true,
        name: true,
        role: {
          id: true,
          permissions: {
            id: true,
            module: {
              id: true,
              name: true,
              grants: {
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
      }
    })
    return user
  }

  async savePassword(uuid: string, hashedPassword: string): Promise<void> {
    const user = await this.userRepository.findOne({
      where: {
        uuid
      }
    })
    user.password = hashedPassword
    await this.userRepository.save(user)
  }
}
