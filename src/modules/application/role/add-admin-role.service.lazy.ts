import { User } from '@infra/db/companies/entities/user/user.entity';
import { AddRole } from './protocols/add-role';
import { Connection } from 'typeorm';

export class AddAdminRole extends AddRole {
    constructor(connection: Connection) {
        super(connection);
    }

    async add(user: User): Promise<User> {
        this.user = user;
        await this.deleteExistingRole();
        const role = await this.roleRepository.findOne({
            relations: ['permissions'],
            where: {
                name: 'admin',
            },
        });
        this.user.role = role;
        return this.user;
    }
}
