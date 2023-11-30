import { Connection } from 'typeorm'
import { AddRole } from './protocols/add-role'
import { AddAdminRole } from './add-admin-role.service.lazy'
import { Lazy } from '@/shared/protocols/lazy'

export class AddAdminRoleServiceLazy implements Lazy<Connection, AddAdminRole> {
  load(connection: Connection): AddRole {
    return new AddAdminRole(connection)
  }
}
