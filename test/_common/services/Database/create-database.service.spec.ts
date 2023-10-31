import { Test, TestingModule } from '@nestjs/testing';
import { DbManagerProtocol } from '../../../../src/_common/services/Database/repository/protocols/db-manager.protocol';
import { MySqlDbManagerService } from '../../../../src/_common/services/Database/repository/mysql-db-manager';
import { CreateDatabaseService } from '../../../../src/_common/services/Database/create-database.service';

describe('Service: CreateDatabaseService', () => {
    let sutCreateDatabaseService: CreateDatabaseService;
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
                    provide: 'HOST_DB_CONFIG',
                    useValue: {
                        host: 'config_host', user: 'config_user', password: 'config_password', port: 'config_port'
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
        dbManageService = module.get<DbManagerProtocol>(MySqlDbManagerService);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should call DbManagerService.createConnection with correct values provided by ConfigService', async () => {
        await sutCreateDatabaseService.create(mockCredentials);
        expect(dbManageService.createConnection).toHaveBeenCalledTimes(1);
        expect(dbManageService.createConnection).toHaveBeenCalledWith({
            host: 'config_host',
            user: 'config_user',
            port: 'config_port',
            password: 'config_password'
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