import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import configuration from '../_config/configuration';
import { CompanyModule } from '../company/company.module';
import appMigrations from '../../db/app/app.migrations'
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    TypeOrmModule.forRootAsync({
        useFactory: (configService: ConfigService) => {
            const dataSource = {
                host: configService.get('database.host'),
                port: configService.get('database.port'),
                username: configService.get('database.user'),
                password: configService.get('database.password'),
                database: configService.get('database.db'),
                type: 'mysql',
                entities: [__dirname + '/../../db/app/entities/**/*.entity{.ts,.js}']
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
    CompanyModule,
    AuthModule
  ],
})
export class AppModule {} 
