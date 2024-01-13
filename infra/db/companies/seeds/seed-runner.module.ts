import { Module } from '@nestjs/common';
import { SeedRunnerService } from './seed-runner.service.';
import { AddGrantsSeedService } from './all/add-grants.seed.service';
import { AddModulesSeedService } from './all/add-modules.seed.service';
import { AddRolesSeedService } from './all/add-roles.seed.service';
import { AddBreedsSeedService } from './all/add-breeds.seed.service';
import { AddCarriesSeedService } from './all/add-carries.seed.service';
import { AddServicesSeedService } from './all/add-services.seed.service';

@Module({
    providers: [
           {
            provide: SeedRunnerService,
            useFactory () {
                return new SeedRunnerService(
                    [
                        new AddGrantsSeedService(),
                        new AddModulesSeedService(),
                        new AddRolesSeedService(),
                        new AddBreedsSeedService(),
                        new AddCarriesSeedService(),
                        new AddServicesSeedService(),
                    ]
                );
            }
        }
    ],
    exports: [SeedRunnerService]
})
export class SeedRunnerModule {}
