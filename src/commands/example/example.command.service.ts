import { Injectable } from '@nestjs/common';
import { Command, Positional } from 'nestjs-command';

// how to execute it: npx nestjs-command tenant:create-secret <tenantIdentifier>
@Injectable()
export class ExampleCommandService {
    constructor() {}

    @Command({
        command: 'example:create-something <arg>',
        describe: 'create a example with something',
    })
    async createSecret(
        @Positional({
            name: 'arg',
            describe: 'some describe',
            type: 'string',
        })
        arg: string,
    ) {
        console.log(arg, ' OK!');
    }
}
