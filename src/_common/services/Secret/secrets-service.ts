import { Inject, Injectable } from "@nestjs/common";

@Injectable()
export class SecretsService {
    constructor (@Inject('SECRETS_MANAGER') private readonly secretsManager) {}

    async save (key: string, data: string) {
        this.secretsManager.save(key, data);
    }
}