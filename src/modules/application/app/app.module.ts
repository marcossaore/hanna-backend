import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TenantModule } from '@/modules/application/tenant/tenant.module';
import configuration from '@/shared/config/configuration';
import { join } from 'path';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            load: [configuration],
        }),
        TypeOrmModule.forRootAsync({
            useFactory: (configService: ConfigService) => {
                const { host, port, user, password, db, type } =
                    configService.get('database');

                const dataSource = {
                    host,
                    port,
                    username: user,
                    password,
                    database: db,
                    type,
                    entities: [
                        join(
                            process.cwd(),
                            '/infra/db/app/entities/**/*.entity{.ts,.js}',
                        ),
                    ],
                    migrations: [
                        join(
                            process.cwd(),
                            '/infra/db/app/migrations/*{.ts,.js}',
                        ),
                    ],
                } as any;

                const environment = configService.get('environment');

                if (environment === 'dev') {
                    // dataSource.entities = [join(__dirname, '/infra/db/app/entities/**/*.entity{.ts,.js}')];
                    dataSource.synchronize = true;
                    dataSource.migrationsRun = false;
                } else {
                    if (environment === 'test') {
                        // dataSource.entities = [join(__dirname, '/infra/db/app/entities/**/*.entity{.ts,.js}')]
                        // dataSource.migrations = [join(__dirname + '/infra/db/app/migrations/*{.ts,.js}')];
                    }
                    // }else {
                    //     dataSource.migrations = [join('dist/infra/db/app/migrations/*{.ts,.js}')];
                    // }
                    dataSource.synchronize = false;
                    dataSource.migrationsRun = true;
                }
                return dataSource;
            },
            inject: [ConfigService],
        }),
        TenantModule,
    ],
})
export class AppModule {}
