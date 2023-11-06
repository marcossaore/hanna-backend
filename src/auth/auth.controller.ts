import { Controller, Post, Body, Req } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { userUnauthorized } from '../_common/helpers/factories/errors';
import { CompanyService } from '../company/company.service';
import { LoadTenantConnectionService } from '../tenant-connection/load-tenant-connection.service';
import { HashService } from '../_common/services/Password/hash.service';
import { UserServiceLazy } from '../user/user.service.lazy';

type ActionType = {
    id: number, 
    name: string
}

type OptionType = {
    id: number, 
    name: string
}

type ModuleType = {
    module: {
        name: string,
        actions: ActionType[],
        options: OptionType[]
    }
}

type PermissionType = {
    uuid: string,
    name: string,
    permissions: ModuleType[]
}

@Controller('auth')
export class AuthController {
    constructor(
        private readonly companyService: CompanyService,
        private readonly loadTenantConnectionService: LoadTenantConnectionService,
        private readonly userService: UserServiceLazy,
        private readonly hashService: HashService,
    ) {}

    @Post('/login')
    async login(@Body() loginDto: LoginDto, @Req() request): Promise<PermissionType> {
        const company = await this.companyService.findByDocument(loginDto.document);
        if (!company) {
            throw userUnauthorized();
        }

        const connection = await this.loadTenantConnectionService.load(company.companyIdentifier);
        if (!connection) {
            throw userUnauthorized();
        }
        
        const userService = this.userService.load(connection);
        const user = await userService.findByEmail(loginDto.email);
        if (!user) {
            throw userUnauthorized();
        }

        const passwordIsMatched = await this.hashService.verify(user.password, loginDto.password);
        if (!passwordIsMatched) {
            throw userUnauthorized();
        }

        const userPermissions = await userService.getModulesPermission(user.uuid);
        const permissions = userPermissions.permissions.map(({ module, actions, options }) => {
            return {
                module: {
                    ...module,
                    actions,
                    options
                }
            }
        })

        request.session.auth = {
            tenant: {
                identifier: company.companyIdentifier,
                uuid: company.uuid,
            },
            user: {
                uuid: user.uuid,
                name: user.name,
                permissions
            }
        }
        
        return {
            uuid: user.uuid,
            name: user.name,
            permissions
        };
    }
}
