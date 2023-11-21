import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CreateDatabaseService } from './create-database.service';
import { MySqlDbManagerService } from './repository/mysql-db-manager';


@Module({
    providers: [
        ConfigService,
        MySqlDbManagerService,
        CreateDatabaseService
    ],
    exports: [
        CreateDatabaseService
    ]
})

export class CreateDatabaseModule {}
