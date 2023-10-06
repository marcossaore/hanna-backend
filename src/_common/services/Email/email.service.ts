import { Injectable } from "@nestjs/common";

@Injectable()
export class EmailService {
    async send (emailOptions: {to: string, copyTo?: string|string[], subject: string, template: string}): Promise<boolean> {
        return true;
    }
}