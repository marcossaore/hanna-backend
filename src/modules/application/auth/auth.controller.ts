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
import { ConfigService } from '@nestjs/config'
import { now } from '@/adapters/helpers/date'

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
    private readonly configService: ConfigService,
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
  ): Promise<any> {
    const company = await this.tenantService.findByDocument(loginDto.document)

    if (!company) {
      throw userUnauthorized()
    }

    // let credentials = null

    // try {
    //   credentials = JSON.parse(
    //     await this.secretsService.get(company.companyIdentifier)
    //   )
    // } catch (error) {
    //   throw userUnauthorized()
    // }

    const credentials = this.configService.get('database');

    const connection = await this.loadTenantConnectionService.load(
      company.companyIdentifier,
      credentials.user,
      credentials.password
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

    const expiresIn1Day =  1 * 24 * 60 * 60

    const currentDate = now()
    const expiresIn = new Date(currentDate.getTime() + expiresIn1Day * 1000);
    const token = this.tokenServiceAdapter.sign(
      {
        userId: user.id,
        companyIdentifier: company.companyIdentifier
      },
      expiresIn1Day
    )

    return {
      id: user.id,
      name: user.name,
      permissions,
      token,
      expiresIn
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

    // let credentials = null

    // try {
    //   credentials = JSON.parse(
    //     await this.secretsService.get(company.companyIdentifier)
    //   )
    // } catch (error) {
    //   throw userUnauthorized()
    // }

    const credentials = this.configService.get('database');

    const connection = await this.loadTenantConnectionService.load(
      company.companyIdentifier,
      credentials.user,
      credentials.password
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
