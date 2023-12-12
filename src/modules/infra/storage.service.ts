import { Inject, Injectable } from '@nestjs/common'

@Injectable()
export class StorageService {
  constructor(@Inject('STORAGE_MANAGER') private readonly storageManager) {}

  async upload(buffer: Buffer, key: string): Promise<string> {
    const isUploaded = this.storageManager.upload(buffer, key)
    if (isUploaded) {
      return await this.getUrl(key)
    }
  }

  async getUrl(key: string) {
    return this.storageManager.getUrl(key)
  }
}
