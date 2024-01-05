import { ConfigService } from '@nestjs/config'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Module } from '@nestjs/common'
import { Tenant } from '@infra/db/app/entities/tenant/tenant.entity'
import { TenantService } from '@/modules/application/tenant/tenant.service'
import { RunMigrationsAndSeedersToTenantiesService } from './run-migrations-and-seeders-to-tenanties.service'
import { SeedRunnerModule } from '@infra/db/companies/seeds/seed-runner.module'
import { MigrationsCompanyModule } from '@infra/plugins/database/migrations-company.module'
import { LoadTenantConnectionModule } from '@/modules/application/tenant-connection/tenant-load-connection.module'
import { join } from 'path'

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: (configService: ConfigService) => {
        const { host, port, user, password, db, type } =
          configService.get('database')

        const dataSource = {
          host,
          port,
          username: user,
          password,
          database: db,
          type,
          entities: [
            join(
              __dirname + '/../../infra/db/app/entities/**/*.entity{.ts,.js}'
            )
          ],
          migrations: [
            join(__dirname + '/../../infra/db/app/migrations/*{.ts,.js}')
          ]
        } as any

        const environment = configService.get('environment')

        if (environment === 'dev') {
          dataSource.synchronize = true
          dataSource.migrationsRun = false
        } else {
          dataSource.synchronize = false
          dataSource.migrationsRun = true
        }
        return dataSource
      },
      inject: [ConfigService]
    }),
    TypeOrmModule.forFeature([Tenant]),
    SeedRunnerModule,
    MigrationsCompanyModule,
    LoadTenantConnectionModule
  ],
  providers: [TenantService, RunMigrationsAndSeedersToTenantiesService]
})
export class RunMigrationsAndSeedersToTenantiesCommand {}
