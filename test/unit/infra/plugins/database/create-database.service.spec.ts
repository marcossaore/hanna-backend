import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { DbManagerProtocol } from '@infra/plugins/database/repository/protocols/db-manager.protocol';
import { CreateDatabaseService } from '@infra/plugins/database/create-database.service';
import { MySqlDbManagerService } from '@infra/plugins/database/repository/mysql-db-manager';

describe('Service: CreateDatabaseService', () => {
    let sutCreateDatabaseService: CreateDatabaseService;
    let confiService: ConfigService;
    let dbManageService: MySqlDbManagerService;
    let mockCredentials = {
        db: 'any_db',
        dbUser: 'any_db_user',
        dbPass: 'any_db_pass'
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                {
                    provide: ConfigService,
                    useValue: {
                        get: jest.fn().mockReturnValue({
                            host: 'any_host',
                            port: 'any_port',
                            user: 'any_user', 
                            password: 'any_pass' 
                        })
                    }
                },
                {
                    provide: MySqlDbManagerService,
                    useValue: {
                        createConnection: jest.fn().mockReturnThis(),
                        query: jest.fn(),
                        end: jest.fn()
                    }
                },
                CreateDatabaseService
            ]
        })
        .compile();

        sutCreateDatabaseService = module.get<CreateDatabaseService>(CreateDatabaseService);
        confiService = module.get<ConfigService>(ConfigService);
        dbManageService = module.get<DbManagerProtocol>(MySqlDbManagerService);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('CreateDatabaseService should have dbConfig with values provided by ConfigService', async () => {
        const dbConfig = (sutCreateDatabaseService as any).dbConfig;
        expect(dbConfig).toEqual({
            host: 'any_host',
            port: 'any_port',
            user: 'any_user', 
            password: 'any_pass'
        });
    });

    it('should call DbManagerService.createConnection with correct values provided by ConfigService', async () => {
        await sutCreateDatabaseService.create(mockCredentials);
        expect(dbManageService.createConnection).toHaveBeenCalledTimes(1);
        expect(dbManageService.createConnection).toHaveBeenCalledWith({
            host: 'any_host',
            port: 'any_port',
            user: 'any_user', 
            password: 'any_pass'
        });
    });

    it('should call DbManagerService.query with correct values', async () => {
        await sutCreateDatabaseService.create(mockCredentials);
        expect(dbManageService.query).toHaveBeenCalledWith(`CREATE DATABASE IF NOT EXISTS \`${mockCredentials.db}\``);
        expect(dbManageService.query).toHaveBeenCalledWith(
            `CREATE USER IF NOT EXISTS ?@'%' IDENTIFIED BY ?`,
            [mockCredentials.dbUser, mockCredentials.dbPass]
        );
        expect(dbManageService.query).toHaveBeenCalledWith(
            `GRANT SELECT, INSERT, UPDATE, DELETE ON \`${mockCredentials.db}\`.* TO ?@'%'`,
            [mockCredentials.dbUser]
        );
        expect(dbManageService.query).toHaveBeenCalledWith('FLUSH PRIVILEGES');

        expect(dbManageService.query).toHaveBeenCalledTimes(4);
    });

     it('should call DbManagerService.query with correct values if some query fails and throws', async () => {
        jest.spyOn(dbManageService, 'query').mockImplementationOnce(() => {
            throw new Error()
        });
        const promise = sutCreateDatabaseService.create(mockCredentials);
        await expect(promise).rejects.toThrow();
        expect(dbManageService.query).toHaveBeenCalledWith(`DROP DATABASE IF EXISTS \`${mockCredentials.db}\``);
        expect(dbManageService.query).toHaveBeenCalledWith(`DROP USER IF EXISTS ?@'%'`, [mockCredentials.dbUser]);
        expect(dbManageService.query).toHaveBeenCalledTimes(3);
        expect(dbManageService.end).toHaveBeenCalledTimes(1);
    });

    it('should call DbManagerService.end when succeds finally', async () => {
        await sutCreateDatabaseService.create(mockCredentials);
        expect(dbManageService.end).toHaveBeenCalledTimes(1);
    });
});