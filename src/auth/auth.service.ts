import { Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { HashService } from 'src/_common/services/Password/hash.service';

@Injectable()
export class AuthService {
    constructor(private usersService: UserService) {}

    // tipar o retorno
    async validate(email: string, password: string): Promise<any> {
        const user = await this.usersService.findByEmail(email);
        // validate with hash.service
        if (user && user.password === password) {
            const { password, ...result } = user;
            return result;
        }
        return null;
    }
}
