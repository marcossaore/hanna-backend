import { Injectable } from '@nestjs/common';

@Injectable()
export class UserService {

    private readonly users = [
        {
            id: 1,
            email: 'john@test.com',
            password: 'changeme',
        },
        {
            id: 2,
            email: 'maria@test.com',
            password: 'guess'
        },
    ];

    async findByEmail(email: string): Promise<any> {
        // buscar do banco de dados
        return this.users.find(user => user.email === email);
    }
}
