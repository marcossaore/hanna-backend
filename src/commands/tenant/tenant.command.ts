import { Command, Positional, Option } from 'nestjs-command';
import { Injectable } from '@nestjs/common';
import { SecretsService } from '../../_common/services/Secret/secrets-service';

@Injectable()
export class TenantCommand {
  constructor(private readonly secretsService: SecretsService) {}

  @Command({
    command: 'create:user <username>',
    describe: 'create a user',
  })
  async create(
    @Positional({
      name: 'username',
      describe: 'the username',
      type: 'string'
    })
    username: string,
    @Option({
      name: 'group',
      describe: 'user group (ex: "jedi")',
      type: 'string',
      alias: 'g',
      required: false
    })
    group: string,
    @Option({
      name: 'saber',
      describe: 'if user has a lightsaber',
      type: 'boolean',
      default: false,
      required: false
    })
    saber: boolean
  ) {
    console.log({
        service: this,
        username,
        group,
        saber
    })
  }
}