import { Module } from '@nestjs/common';
import { SeedRunnerService } from './seed-runner.service.';
import { AddGrantsSeedService } from './all/add-grants.seed.service';
import { AddModulesSeedService } from './all/add-modules.seed.service';
import { AddRolesSeedService } from './all/add-roles.seed.service';

@Module({
    providers: [
           {
            provide: SeedRunnerService,
            useFactory () {
                return new SeedRunnerService(
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
