import {
  Controller,
  Post,
  Body,
  HttpCode,
  Query,
  UseInterceptors,
  ClassSerializerInterceptor,
  UnauthorizedException,
  ForbiddenException
} from '@nestjs/common'
import { LoginDto } from './dto/login.dto'
import { TenantService } from '@/modules/application/tenant/tenant.service'
import { HashService } from '@infra/plugins/hash/hash.service'
import { UserServiceLazy } from '@/modules/application/user/user.service.lazy'
import { LoadTenantConnectionService } from '@/modules/application/tenant-connection/load-tenant-connection.service'
import { appPrefix } from '../app/application.prefixes'
import { UserCreatePasswordDto } from './dto/user-create-password.dto'
import { TokenServiceAdapter } from '@infra/plugins/token/token-service.adapter'
import { InfoMessageInterceptor } from '@/adapters/interceptors/info-message-interceptor'
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
  token: string
  expiresIn: Date
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
    private readonly tokenServiceAdapter: TokenServiceAdapter
  ) {}

  @Post('/login')
  @HttpCode(200)
  async login(
    @Body() loginDto: LoginDto,
  ): Promise<PermissionType> {
    const company = await this.tenantService.findByDocument(loginDto.document)

    if (!company) {
      throw new UnauthorizedException('O CNPJ, email ou senha são inválidos!')
    }

    const credentials = this.configService.get('database');

    const connection = await this.loadTenantConnectionService.load(
      company.companyIdentifier,
      credentials.user,
      credentials.password
    )

    if (!connection) {
      throw new UnauthorizedException('O CNPJ, email ou senha são inválidos!')
    }

    const userService = this.userService.load(connection)
    const user = await userService.findByEmail(loginDto.email)
    if (!user) {
      throw new UnauthorizedException('O CNPJ, email ou senha são inválidos!')
    }

    const passwordIsMatched = await this.hashService.verify(
      user.password,
      loginDto.password
    )
    if (!passwordIsMatched) {
      throw new UnauthorizedException('O CNPJ, email ou senha são inválidos!')
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
    const tokenDecrypted = this.tokenServiceAdapter.verify(query.token);
    if (!tokenDecrypted) {
      throw new ForbiddenException('Tempo para criação de senha expirado!')
    }
    const { companyId, userId } = tokenDecrypted
    const company = await this.tenantService.findById(companyId)
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
