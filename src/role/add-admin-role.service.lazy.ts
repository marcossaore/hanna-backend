import { User } from "@db/companies/entities/user/user.entity";
import { AddRole } from "./protocols/add-role";

export class AddAdminRole extends AddRole {
    async add(user: User): Promise<User> {
        this.user = user;
        await this.deleteExistingRole();
        const role = await this.roleRepository.findOneBy({ name: 'admin '});
        this.user.role = role;
        return this.user;
    }
}