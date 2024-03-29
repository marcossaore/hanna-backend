import { Injectable } from '@nestjs/common'
import { Job } from 'bull'
import {
  OnQueueCompleted,
  OnQueueFailed,
  Process,
  Processor
} from '@nestjs/bull'
import { SeedRunnerService } from '@infra/db/companies/seeds/seed-runner.service.'
import { CreateDatabaseService } from '@infra/plugins/database/create-database.service'
import { MigrationsCompanyService } from '@infra/plugins/database/migrations-company.service'
import { TokenServiceAdapter } from '@infra/plugins/token/token-service.adapter'
import { AddAdminRoleServiceLazy } from '@/modules/application/role/add-admin-role.service'
import { TenantService } from '@/modules/application/tenant/tenant.service'
import { UserServiceLazy } from '@/modules/application/user/user.service.lazy'
import { LoadTenantConnectionService } from '@/modules/application/tenant-connection/load-tenant-connection.service'
import { MailService } from '@/modules/infra/mail/mail.service'
import { ConfigService } from '@nestjs/config'

@Injectable()
@Processor('create-tenant')
export class CreateTenantProcessor {
  constructor(
    private readonly configService: ConfigService,
    private readonly tenantService: TenantService,
    private readonly createDatabaseService: CreateDatabaseService,
    private readonly loadTenantConnectionService: LoadTenantConnectionService,
    private readonly migrationsCompanyService: MigrationsCompanyService,
    private readonly seedRunnerService: SeedRunnerService,
    private readonly userService: UserServiceLazy,
    private readonly adminRoleService: AddAdminRoleServiceLazy,
    private readonly mailService: MailService,
    private readonly tokenServiceAdapter: TokenServiceAdapter
  ) {}

  @Process()
  async handleJob(job: Job) {
    try {
      const company = await this.tenantService.findById(job.data.id)
      await this.createDatabaseService.create(company.companyIdentifier)
      const credentials = this.configService.get('database');
      const connection = await this.loadTenantConnectionService.load(
        company.companyIdentifier,
        credentials.user,
        credentials.password,
        30
      )

      if (!connection) {
        throw new Error('Connection it was not established!')
      }

      await this.migrationsCompanyService.run(company.companyIdentifier)
      await this.seedRunnerService.seed(connection)

      const userService = this.userService.load(connection)

      const user = await userService.save({
        name: company.partnerName,
        email: company.email,
        phone: company.phone
      })

      const adminRoleService = this.adminRoleService.load(connection)
      await userService.addRole(user.id, adminRoleService)

      const expiresIn10Minutes = 10 * 60

      const token = this.tokenServiceAdapter.sign(
        {
          companyId: company.id,
          companyName: company.name,
          userId: user.id,
          userName: company.partnerName,
          isRecovery: false
        },
        expiresIn10Minutes
      )

      const url = this.configService.get('app').getUrl

      await this.mailService.send({
        to: company.email,
        subject: 'Conta criada com sucesso!',
        template: 'company-account-create',
        data: {
          name: company.name,
          document: company.document,
          partnerName: company.partnerName,
          email: company.email,
          link: `${url}/app/user/new-password?token=${token}`
        }
      })
    } catch (error) {
      throw error
    }
  }

  @OnQueueCompleted()
  onCompleted(job: Job) {
    this.tenantService.markAsProcessed(job.data.id)
  }

  @OnQueueFailed()
  onFailed(job: Job, error: Error) {
    this.tenantService.markAsRejected(job.data.id, error)
  }
}
