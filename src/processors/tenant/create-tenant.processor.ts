import { Injectable } from '@nestjs/common'
import { Job } from 'bull'
import {
  OnQueueCompleted,
  OnQueueFailed,
  Process,
  Processor
} from '@nestjs/bull'
import { SeedRunnerService } from '@infra/db/companies/seeds/seed-runner.service.'
import { GenerateDbCredentialsService } from '@infra/plugins/database/generate-db-credentials.service'
import { CreateDatabaseService } from '@infra/plugins/database/create-database.service'
import { MigrationsCompanyService } from '@infra/plugins/database/migrations-company.service'
import { GenerateUuidService } from '@infra/plugins/uuid/generate-uuid-service'
import { TokenServiceAdapter } from '@infra/plugins/token/token-service.adapter'
import { AddAdminRoleServiceLazy } from '@/modules/application/role/add-admin-role.service'
import { TenantService } from '@/modules/application/tenant/tenant.service'
import { UserServiceLazy } from '@/modules/application/user/user.service.lazy'
import { SecretsService } from '@/modules/infra/secrets/secrets-service'
import { LoadTenantConnectionService } from '@/modules/application/tenant-connection/load-tenant-connection.service'
import { MailService } from '@/modules/infra/mail/mail.service'
import { ConfigService } from '@nestjs/config'

@Injectable()
@Processor('create-tenant')
export class CreateTenantProcessor {
  constructor(
    private readonly configService: ConfigService,
    private readonly tenantService: TenantService,
    private readonly generateDbCredentialsService: GenerateDbCredentialsService,
    private readonly createDatabaseService: CreateDatabaseService,
    private readonly secretsService: SecretsService,
    private readonly loadTenantConnectionService: LoadTenantConnectionService,
    private readonly migrationsCompanyService: MigrationsCompanyService,
    private readonly seedRunnerService: SeedRunnerService,
    private readonly userService: UserServiceLazy,
    private readonly generateUuidService: GenerateUuidService,
    private readonly adminRoleService: AddAdminRoleServiceLazy,
    private readonly mailService: MailService,
    private readonly tokenServiceAdapter: TokenServiceAdapter
  ) {}

  @Process()
  async handleJob(job: Job) {
    try {
      const company = await this.tenantService.findByUuid(job.data.uuid)
      const credentials = this.generateDbCredentialsService.generate(
        company.name
      )
      await this.createDatabaseService.create({
        db: company.companyIdentifier,
        ...credentials
      })
      await this.secretsService.save(
        company.companyIdentifier,
        JSON.stringify({
          ...credentials
        })
      )

      const connection = await this.loadTenantConnectionService.load(
        company.companyIdentifier,
        5
      )

      if (!connection) {
        throw new Error('Connection it was not established!')
      }

      await this.migrationsCompanyService.run(company.companyIdentifier)
      await this.seedRunnerService.seed(connection)

      const userService = this.userService.load(connection)
      const uuid = this.generateUuidService.generate()

      const user = await userService.save({
        uuid,
        name: company.partnerName,
        email: company.email,
        phone: company.phone
      })

      const adminRoleService = this.adminRoleService.load(connection)
      await userService.addRole(user.uuid, adminRoleService)

      const expiresIn10Minutes = 10 * 60

      const token = this.tokenServiceAdapter.sign(
        {
          companyId: company.uuid,
          companyName: company.name,
          userId: uuid,
          userName: company.partnerName
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
    this.tenantService.markAsProcessed(job.data.uuid)
  }

  @OnQueueFailed()
  onFailed(job: Job, error: Error) {
    this.tenantService.markAsRejected(job.data.uuid, error)
  }
}
