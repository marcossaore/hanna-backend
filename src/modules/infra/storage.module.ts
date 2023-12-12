import { Module } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { StorageCloud } from '@infra/plugins/storage/storage.cloud'
import { StorageService } from './storage.service'

@Module({
  providers: [
    {
      inject: [ConfigService],
      provide: StorageService,
      useFactory(configService: ConfigService) {
        const { key, secret, region, version, endpoint, bucket } =
          configService.get('aws')
        const storageCloud = new StorageCloud({
          key,
          secret,
          region,
          version,
          endpoint,
          bucket
        })
        return new StorageService(storageCloud)
      }
    }
  ],
  exports: [StorageService]
})
export class StorageModule {}
