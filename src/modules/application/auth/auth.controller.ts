import { Controller, Post, Body, Req, HttpCode } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { userUnauthorized } from '@/factories/errors';
import { TenantService } from '@/modules/application/tenant/tenant.service';
import { HashService } from '@infra/plugins/hash/hash.service';
import { UserServiceLazy } from '@/modules/application/user/user.service.lazy';
import { LoadTenantConnectionService } from '@/modules/application/tenant-connection/load-tenant-connection.service';
import { appPrefix } from '../app/application.prefixes';

type GrantType = {
    id: number;
    name: string;
};

type OptionType = {
    id: number;
    name: string;
};

type ModuleType = {
    module: {
        name: string;
        grants: GrantType[];
        options: OptionType[];
    };
};

type PermissionType = {
    uuid: string;
    name: string;
    permissions: ModuleType[];
};

@Controller(`${appPrefix}/auth`)
export class AuthController {
    constructor(
        private readonly tenantService: TenantService,
        private readonly loadTenantConnectionService: LoadTenantConnectionService,
        private readonly userService: UserServiceLazy,
        private readonly hashService: HashService,
    ) {}

    @Post('/login')
    @HttpCode(200)
    async login(
        @Body() loginDto: LoginDto,
        @Req() request,
    ): Promise<PermissionType> {
        const company = await this.tenantService.findByDocument(
            loginDto.document,
        );

        if (!company) {
            throw userUnauthorized();
        }

        const connection = await this.loadTenantConnectionService.load(
            company.companyIdentifier,
        );
        if (!connection) {
            throw userUnauthorized();
        }

        const userService = this.userService.load(connection);
        const user = await userService.findByEmail(loginDto.email);
        if (!user) {
            throw userUnauthorized();
        }

        const passwordIsMatched = await this.hashService.verify(
            user.password,
            loginDto.password,
        );
        if (!passwordIsMatched) {
            throw userUnauthorized();
        }

        const userPermissions = await userService.getRoles(user.uuid);
        const permissions = userPermissions.role.permissions.map(
            ({ module }) => {
                return {
                    module: {
                        name: module.name,
                        grants: module.grants,
                        options: module.options,
                    },
                };
            },
        );

        request.session.auth = {
            tenant: {
                identifier: company.companyIdentifier,
                uuid: company.uuid,
            },
            user: {
                uuid: user.uuid,
                name: user.name,
                permissions,
            },
        };

        return {
            uuid: user.uuid,
            name: user.name,
            permissions,
        };
    }

    @Post('/logout')
    @HttpCode(204)
    async logout(@Req() request): Promise<void> {
        if (request.session.auth) {
            request.session.destroy();
        }
    }
}
