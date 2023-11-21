import { Module } from '@nestjs/common';
import { Tenant } from '@infra/db/app/entities/tenant/tenant.entity';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HashService } from '@/_common/services/Password/hash.service';
import { UserServiceLazy } from '@/user/user.service.lazy';
import { AuthController } from './auth.controller';
import { TenantService } from '@/tenant/tenant.service';

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
        TypeOrmModule.forFeature([Tenant])
    ],
    providers: [TenantService, UserServiceLazy, HashService],
    controllers: [AuthController]
})
export class AuthModule {}
