import {
  Controller,
  Post,
  Body,
  Req,
  HttpCode,
  Query,
  UseInterceptors,
  ClassSerializerInterceptor
} from '@nestjs/common'
import { LoginDto } from './dto/login.dto'
import { userUnauthorized } from '@/factories/errors'
import { TenantService } from '@/modules/application/tenant/tenant.service'
import { HashService } from '@infra/plugins/hash/hash.service'
import { UserServiceLazy } from '@/modules/application/user/user.service.lazy'
import { LoadTenantConnectionService } from '@/modules/application/tenant-connection/load-tenant-connection.service'
import { appPrefix } from '../app/application.prefixes'
import { UserCreatePasswordDto } from './dto/user-create-password.dto'
import { TokenServiceAdapter } from '@infra/plugins/token/token-service.adapter'
import { InfoMessageInterceptor } from '@/adapters/interceptors/info-message-interceptor'
import { SecretsService } from '@/modules/infra/secrets/secrets-service'

type GrantType = {
  read: boolean
  edit: boolean
  create: boolean
  delete: boolean
}

type OptionType = {
  [key: string]: boolean
}

type ModuleType = {
  name: string
  grants: GrantType
  options: OptionType
}

type ModulesType = {
  name: string
  modules: ModuleType[]
}

type PermissionType = {
  id: string
  name: string
  expiresIn: string
  permissions: ModuleType[] | ModulesType[]
}

@Controller(`${appPrefix}/auth`)
export class AuthController {
  constructor(
    private readonly tenantService: TenantService,
    private readonly userService: UserServiceLazy,
    private readonly hashService: HashService,
    private readonly loadTenantConnectionService: LoadTenantConnectionService,
    private readonly tokenServiceAdapter: TokenServiceAdapter,
    private readonly secretsService: SecretsService
  ) {}

  @Post('/login')
  @HttpCode(200)
  async login(
    @Body() loginDto: LoginDto,
    @Req() request
  ): Promise<PermissionType> {
    const company = await this.tenantService.findByDocument(loginDto.document)

    if (!company) {
      throw userUnauthorized()
    }

    let credentials = null

    try {
      credentials = JSON.parse(
        await this.secretsService.get(company.companyIdentifier)
      )
    } catch (error) {
      throw userUnauthorized()
    }

    const connection = await this.loadTenantConnectionService.load(
      company.companyIdentifier,
      credentials.dbUser,
      credentials.dbPass
    )

    if (!connection) {
      throw userUnauthorized()
    }

    const userService = this.userService.load(connection)
    const user = await userService.findByEmail(loginDto.email)
    if (!user) {
      throw userUnauthorized()
    }

    const passwordIsMatched = await this.hashService.verify(
      user.password,
      loginDto.password
    )
    if (!passwordIsMatched) {
      throw userUnauthorized()
    }

    const permissions = await userService.getRolesGrouped(user.id)

    request.session.auth = {
      tenant: {
        identifier: company.companyIdentifier,
        id: company.id,
        credentials: {
          user: credentials.dbUser,
          password: credentials.dbPass
        }
      },
      user: {
        id: user.id,
        name: user.name,
        permissions
      }
    }

    return {
      id: user.id,
      name: user.name,
      expiresIn: request.session.cookie._expires,
      permissions
    }
  }

  @Post('/logout')
  @HttpCode(204)
  async logout(@Req() request): Promise<void> {
    if (request.session.auth) {
      request.session.destroy()
    }
  }

  @UseInterceptors(
    new InfoMessageInterceptor(
      'Senha criada com sucesso, agora você pode acessar a plataforma Hanna!'
    ),
    ClassSerializerInterceptor
  )
  @Post('/new-password')
  @HttpCode(200)
  async newPassword(
    @Body() userCreatePasswordDto: UserCreatePasswordDto,
    @Query() query
  ): Promise<void> {
    const { companyId, userId } = this.tokenServiceAdapter.verify(query.token)
    const company = await this.tenantService.findById(companyId)

    let credentials = null

    try {
      credentials = JSON.parse(
        await this.secretsService.get(company.companyIdentifier)
      )
    } catch (error) {
      throw userUnauthorized()
    }

    const connection = await this.loadTenantConnectionService.load(
      company.companyIdentifier,
      credentials.dbUser,
      credentials.dbPass
    )

    const hashPassword = await this.hashService.hash(
      userCreatePasswordDto.password
    )

    const userService = this.userService.load(connection)
    await userService.savePassword(userId, hashPassword)
  }

  @Post('/pin')
  @HttpCode(200)
  async authPin() {
    return {
      isAuth: true
    }
  }
}
