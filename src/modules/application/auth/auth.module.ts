import { Module } from '@nestjs/common';
import { Tenant } from '@infra/db/app/entities/tenant/tenant.entity';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HashService } from '@infra/plugins/hash/hash.service';
import { UserServiceLazy } from '@/modules/application/user/user.service.lazy';
import { AuthController } from './auth.controller';
import { TenantService } from '@/modules/application/tenant/tenant.service';

@Module({
    imports: [
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
                        __dirname +
                            '/../../db/app/entities/**/*.entity{.ts,.js}',
                    ],
                } as any;
                return dataSource;
            },
            inject: [ConfigService],
        }),
        TypeOrmModule.forFeature([Tenant]),
    ],
    providers: [TenantService, UserServiceLazy, HashService],
    controllers: [AuthController],
})
export class AuthModule {}
