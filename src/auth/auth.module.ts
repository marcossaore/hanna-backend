import { Module } from '@nestjs/common';
import { Company } from '@db/app/entities/company/company.entity';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HashService } from '@/_common/services/Password/hash.service';
import { UserServiceLazy } from '@/user/user.service.lazy';
import { CompanyService } from '@/company/company.service';
import { AuthController } from './auth.controller';

@Module({
    imports: [
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
                return dataSource;
            },
            inject: [ConfigService],
        }),
        TypeOrmModule.forFeature([Company])
    ],
    providers: [CompanyService, UserServiceLazy, HashService],
    controllers: [AuthController]
})
export class AuthModule {}
