import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CompanyModule } from '../company/company.module';
import configuration from '../_config/configuration';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    TypeOrmModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        host: configService.get('database.host'),
        port: configService.get('database.port'),
        username: configService.get('database.user'),
        password: configService.get('database.password'),
        database: configService.get('database.db'),
        type: 'mysql',
        entities: [__dirname + '/../**/*.entity{.ts,.js}'],
        synchronize: configService.get('environment') === 'dev' ? true : false,
        // migrations: [__dirname + '../migrations/*.js']
      }),
      inject: [ConfigService],
    }),
    CompanyModule,
  ]
})
export class AppModule {}
