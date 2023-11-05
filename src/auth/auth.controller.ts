import { Controller, Post, Body, UnauthorizedException, Req } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
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
            throw new UnauthorizedException('O CNPJ, email ou senha são inválidos!')
        }

        const connection = await this.loadTenantConnectionService.load(company.companyIdentifier);
        const userService = this.userService.load(connection);
        const user = await userService.findByEmail(loginDto.email);
        if (!user) {
            throw new UnauthorizedException('O CNPJ, email ou senha são inválidos!')
        }

        const passwordIsMatched = await this.hashService.verify(user.password, loginDto.password);
        if (!passwordIsMatched) {
            throw new UnauthorizedException('O CNPJ, email ou senha são inválidos!')
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
