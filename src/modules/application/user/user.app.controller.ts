import { Body, Controller, Get, Post, Query, Res, UnauthorizedException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { Response } from 'express'
import { noApiPrefix } from '../app/application.prefixes'
import { TokenServiceAdapter } from '@infra/plugins/token/token-service.adapter'
import { TenantService } from '../tenant/tenant.service'
import { LoadTenantConnectionService } from '../tenant-connection/load-tenant-connection.service'
import { UserServiceLazy } from './user.service.lazy'
import { MailService } from '@/modules/infra/mail/mail.service'

@Controller(`${noApiPrefix}/user`)
export class UserAppController {
  private postUrl: string

  constructor(
    private readonly configService: ConfigService,
    private readonly tokenServiceAdapter: TokenServiceAdapter,
    private readonly tenantService: TenantService,
    private readonly loadTenantConnectionService: LoadTenantConnectionService,
    private readonly userService: UserServiceLazy,
    private readonly mailService: MailService
  ) {
    this.postUrl = this.configService.get('app').getUrl
  }

  @Get('/recovery-password')
  async recoveryPassword(@Res() res: Response, @Query() query) {
    return res.render('user-resend-token', {
      sendTokenEndpoint: `${this.postUrl}/app/user/resend-token`,
      successEndpoint: `${this.postUrl}/app/user/resend-token-ok`,
      isRecovery: true
    })
  }


  @Get('/new-password')
  async newPassword(@Res() res: Response, @Query() query) {
    const userData = this.tokenServiceAdapter.verify(query.token)
    if (!userData) {
      return res.render('user-resend-token', {
        sendTokenEndpoint: `${this.postUrl}/app/user/resend-token`,
        successEndpoint: `${this.postUrl}/app/user/resend-token-ok`
      })
    }
    return res.render('user-new-password', {
      name: userData.userName,
      companyName: userData.companyName,
      newPasswordEndpoint: `${this.postUrl}/api/auth/new-password?token=${query.token}`,
      resendTokenEndpoint: `${this.postUrl}/app/user/new-password?token=${query.token}`,
      successEndpoint: `${this.postUrl}/app/user/new-password-created`
    })
  }

  @Post('/resend-token')
  async resendToken(@Body() body) {
    const tenant = await this.tenantService.findByDocument(body.document)
    if (!tenant) {
      throw new UnauthorizedException('O CNPJ ou email são inválidos!')
    }
    const credentials = this.configService.get('database');
    const connection = await this.loadTenantConnectionService.load(
      tenant.companyIdentifier,
      credentials.user,
      credentials.password
    )
    const userService = this.userService.load(connection)
    const user = await userService.findByEmail(body.email)

    if (!user) {
      throw new UnauthorizedException('O CNPJ ou email são inválidos!')
    }

    const expiresIn10Minutes = 10 * 60
    const token = this.tokenServiceAdapter.sign(
      {
        companyId: tenant.id,
        companyName: tenant.name,
        userId: user.id,
        isRecovery: user.password ? true : false,
        userName: user.name
      },
      expiresIn10Minutes
    )
    this.mailService.send({
      to: tenant.email,
      subject: user.password ? 'Recuperaçao de senha' : 'Criação de senha',
      template: user.password ? 'company-account-recovery' : 'company-account-create',
      data: {
        name: tenant.name,
        document: tenant.document,
        partnerName: tenant.partnerName,
        email: tenant.email,
        link: `${this.postUrl}/app/user/new-password?token=${token}`
      }
    })
    return {
      userName: user.name
    }
  }

  @Get('new-password-created')
  newPasswordCreated(@Res() res: Response, @Query() query) {
    return res.render('user-new-password-created', {
      userName: query.userName,
      companyName: query.companyName
    })
  }

  @Get('resend-token-ok')
  resentTokenOk(@Res() res: Response, @Query() query) {
    return res.render('user-resend-token-ok', {
      userName: query.userName
    })
  }
}
