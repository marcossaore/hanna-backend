import { Inject, Injectable } from '@nestjs/common';
import { User } from '../../db/companies/entities/user/user.entity';
import { Connection, Repository } from 'typeorm';

@Injectable()
export class UserService {

    private readonly userRepository: Repository<User>

    constructor(
        @Inject('CONNECTION') private readonly connection: Connection
    ) {
        this.userRepository = this.connection.getRepository(User)
    }

    async findByEmail(email: string): Promise<any> {
        return this.userRepository.findOneBy({ email });
    }
}
