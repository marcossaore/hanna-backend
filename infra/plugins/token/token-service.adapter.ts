import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as jsonwebtoken from 'jsonwebtoken';

@Injectable()
export class TokenServiceAdapter {
    private options: {secret: string, expiresIn: string};

    constructor(
        private readonly configService: ConfigService
    ) {
        this.options = this.configService.get('jwt');
    }

    sign(data: any, expiresIn: any = null) {
        const token = jsonwebtoken.sign(data, this.options.secret, {
            expiresIn: expiresIn || this.options.expiresIn,
        });
        return token;
    }

    verify(token: string) {
      try {
        return jsonwebtoken.verify(token, this.options.secret);
      } catch (error) {
        return null;
      } 
    }
}