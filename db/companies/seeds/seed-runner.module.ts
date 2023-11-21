import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SeedRunnerService } from './seed-runner.service.';
import { AddGrantsSeedService } from './all/add-grants.seed.service';
import { AddModulesSeedService } from './all/add-modules.seed.service';
import { AddRolesSeedService } from './all/add-roles.seed.service';

@Module({
    providers: [
           {
            inject: [ConfigService],
            provide: SeedRunnerService,
            useFactory (configService: ConfigService) {
                return new SeedRunnerService(
                    configService,
                    [
                        new AddGrantsSeedService(),
                        new AddModulesSeedService(),
                        new AddRolesSeedService()
                    ]
                );
            }
        }
    ],
    exports: [SeedRunnerService]
})
export class SeedRunnerModule {}
