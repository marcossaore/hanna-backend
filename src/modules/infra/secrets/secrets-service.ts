import { Inject, Injectable } from "@nestjs/common";

@Injectable()
export class SecretsService {
    constructor (@Inject('SECRETS_MANAGER') private readonly secretsManager) {}

    async save (key: string, data: string) {
        const existsKey = await this.get(key);
        if (existsKey) {
            throw new Error('Secret informed already exists!')
        }
        this.secretsManager.save(key, data);
    }

    async get (key: string) {
        return this.secretsManager.get(key);
    }
}