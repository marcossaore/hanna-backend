import { Connection } from 'typeorm'
import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { LoadTenantDataSourceService } from './load-tenant-datasource.service'

@Injectable()
export class LoadTenantConnectionService {
  private dbConfig: { host: string; port: number; type: any }

  constructor(
    private readonly configService: ConfigService,
    private readonly loadTenantDatasourceService: LoadTenantDataSourceService
  ) {
    this.dbConfig = this.configService.get('database')
  }
  async load(
    tenantName: string,
    user: string,
    password: string,
    timeoutInSeconds: number = 0
  ): Promise<Connection> {
    try {
      const datasource = this.loadTenantDatasourceService.load({
        host: this.dbConfig.host,
        port: this.dbConfig.port,
        user,
        password,
        db: tenantName,
        connectTimeout: timeoutInSeconds,
        type: this.dbConfig.type
      })
      return datasource
    } catch (error) {
      return null
    }
  }
}
