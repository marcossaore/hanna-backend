import { Controller, Get, Query, Res } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Response } from 'express';
import { noApiPrefix } from '../app/application.prefixes';
import { TokenServiceAdapter } from '@infra/plugins/token/token-service.adapter';

@Controller(`${noApiPrefix}/user`)
export class UserAppController {
    private postUrl: string;

    constructor(
        private readonly configService: ConfigService,
        private readonly tokenServiceAdapter: TokenServiceAdapter,
    ) {
        this.postUrl = this.configService.get('app').getUrl;
    }

    @Get('/new-password')
    newPassword(@Res() res: Response, @Query() query) {
        const userData = this.tokenServiceAdapter.verify(query.token);
        return res.render('user-new-password', {
            name: userData.userName,
            companyName: userData.companyName,
            postUrl: `${this.postUrl}/api/auth/new-password?token=${query.token}`,
        });
    }
}
