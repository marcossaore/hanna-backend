import { ulid } from 'ulid'

export class GenerateUuidService {
    generate (): string {
        return ulid();
    }
}