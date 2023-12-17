import { LoadTenantConnectionService } from '@/modules/application/tenant-connection/load-tenant-connection.service'
import { TenantService } from '@/modules/application/tenant/tenant.service'
import { SecretsService } from '@/modules/infra/secrets/secrets-service'
import { SeedRunnerService } from '@infra/db/companies/seeds/seed-runner.service.'
import { MigrationsCompanyService } from '@infra/plugins/database/migrations-company.service'
import { Injectable } from '@nestjs/common'
import { Command } from 'nestjs-command'

@Injectable()
export class RunMigrationsAndSeedersToTenantiesService {
  constructor(
    private readonly tenantService: TenantService,
    private readonly migrationsCompanyService: MigrationsCompanyService,
    private readonly loadTenantConnectionService: LoadTenantConnectionService,
    private readonly seedRunnerService: SeedRunnerService,
    private readonly secretsService: SecretsService
  ) {}

  @Command({
    command: 'tenanties:migraseed',
    describe: 'run for all tenanties, migrations and seeders'
  })
  async run(skip = 1) {
    const tenant = await this.tenantService.getFirstTenant(skip)
    if (!tenant) {
      console.log('finish')
      process.exit()
    }
    console.log('tenant :', tenant.companyIdentifier)
    console.log('run migrations')
    await this.migrationsCompanyService.run(tenant.companyIdentifier)
    const credentials = JSON.parse(
      await this.secretsService.get(tenant.companyIdentifier)
    )

    const connection = await this.loadTenantConnectionService.load(
      tenant.companyIdentifier,
      credentials.dbUser,
      credentials.dbPass,
      5
    )

    if (!connection) {
      throw new Error('Connection it was not established!')
    }

    console.log('run seeders')
    await this.seedRunnerService.seed(connection)

    skip++
    console.log('')
    return await this.run(skip)
  }
}
