import { Injectable } from '@nestjs/common';
import * as jsonwebtoken from 'jsonwebtoken';

@Injectable()
export class TokenAdapter {
    constructor(
        private readonly options: {secret: string, expiresIn: string}
    ) {}


    sign(data: any) {
        try {
            console.log('teste')
            const token = jsonwebtoken.sign(data, this.options.secret, {
                expiresIn: this.options.expiresIn,
            });
            
            return token;

        } catch (error) {
            console.log('error', error)
            return null;
        }
    }
}
