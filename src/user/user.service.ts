import { Inject, Injectable } from '@nestjs/common';
import { Connection, Repository } from 'typeorm';
import { User } from '@db/companies/entities/user/user.entity';
import { AddRole } from '@/role/protocols/add-role';

@Injectable()
export class UserService {

    private readonly userRepository: Repository<User>

    constructor(
        @Inject('CONNECTION') private readonly connection: Connection
    ) {
        this.userRepository = this.connection.getRepository(User)
    }

    async findByEmail(email: string): Promise<any> {
        return this.userRepository.findOneBy({
            email
        });
    }

    async getModulesPermission(uuid: string): Promise<User> {
        const user = await this.userRepository.findOne({
            relations: ['permissions.module', 'permissions.actions', 'permissions.options'],
            where: {
                uuid
            },
            select: {
                id: true,
                // permissions: {
                //     id: true,
                //     module: {
                //         id: false,
                //         name: true
                //     },
                //     actions: {
                //         id: true,
                //         name: true
                //     },
                //     options: {
                //         id: true,
                //         name: true
                //     }
                // }
            }
        });

        return user;
    }

    async save (data: any) : Promise<User> {
        const user = await this.userRepository.save(data);
        return user;
    }

    async addRole (uuid: string, addRole: AddRole) : Promise<void> {
        const user = await this.userRepository.findOneBy({ uuid });
        const userWithRoles = await addRole.add(user);
        await this.userRepository.save(userWithRoles);
    }
}
