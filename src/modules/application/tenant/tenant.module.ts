import { Module } from '@nestjs/common'
import { BullModule } from '@nestjs/bull'
import { ConfigService } from '@nestjs/config'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Tenant } from '@infra/db/app/entities/tenant/tenant.entity'
import { TenantService } from './tenant.service'
import { TenantController } from './tenant.controller'
import { CreateTenantProcessorModule } from '@/processors/tenant/create-tenant.processor.module'

@Module({
  imports: [
    TypeOrmModule.forFeature([Tenant]),
    BullModule.registerQueueAsync({
      name: 'create-tenant',
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        redis: {
          host: configService.get('queue.host'),
          port: configService.get('queue.port'),
          password: configService.get('queue.pass'),
          username: configService.get('queue.user')
        }
      })
    }),
    CreateTenantProcessorModule
  ],
  controllers: [TenantController],
  providers: [TenantService]
})
export class TenantModule {}
