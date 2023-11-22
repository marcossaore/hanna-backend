import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import configuration from '@/shared/config/configuration';
import appMigrations from '@infra/db/app/app.migrations';
import { TenantModule } from '@/modules/application/tenant/tenant.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    TypeOrmModule.forRootAsync({
        useFactory: (configService: ConfigService) => {

            const { host, port, user, password, db, type } = configService.get('database');

            console.log('host ', host)
            console.log('port ', port)
            const dataSource = {
                host,
                port,
                username: user,
                password,
                database: db,
                type,
                entities: [__dirname + '/../../../../infra/db/app/entities/**/*.entity{.ts,.js}']
            } as any;

            if (configService.get('environment') === 'dev') {
                dataSource.synchronize = true;
                dataSource.migrationsRun = false
            } else {
                dataSource.synchronize = false;
                dataSource.migrationsRun = true;
                dataSource.migrations = appMigrations;
            }
            return dataSource;
        },
        inject: [ConfigService],
    }),
    TenantModule
  ],
})
export class AppModule {} 
