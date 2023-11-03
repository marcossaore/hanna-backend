import { Command, Positional, Option } from 'nestjs-command';
import { Injectable } from '@nestjs/common';
import { GenerateDbCredentialsService } from '../../_common/services/Database/generate-db-credentials.service';
import { SecretsService } from '../../_common/services/Secret/secrets-service';


// how to execute it: npx nestjs-command tenant:create-secret <tenantIdentifier>
@Injectable()
export class TenantCommand {
  constructor(
    private readonly generateDbCredentialsService: GenerateDbCredentialsService,
    private readonly secretsService: SecretsService,
) {}

  @Command({
    command: 'tenant:create-secret <tenant-identifier>',
    describe: 'create a tenant secret',
  })
  async createSecret(
    @Positional({
      name: 'tenantIdentifier',
      describe: 'the identifier in db',
      type: 'string'
    })
    tenantIdentifier: string
  ) {
    const credentials = this.generateDbCredentialsService.generate(tenantIdentifier);

    try {        
        await this.secretsService.save(
            tenantIdentifier,    
            JSON.stringify({
                ...credentials
            })
        );
        console.log('OK!')
    } catch (error) {
        console.error(error)
    }
  }
}