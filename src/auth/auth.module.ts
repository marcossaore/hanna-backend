import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport'
import { AuthService } from './auth.service';
import { UserService } from '../user/user.service';
import { LocalStrategy } from './local.strategy';
import { AuthController } from './auth.controller';
import { SessionSerializer } from './session.serializer';
import { SessionModule } from 'src/session/session.module';

@Module({
    imports: [SessionModule, PassportModule.register({ session: true })],
    providers: [UserService, AuthService, LocalStrategy, SessionSerializer],
    controllers: [AuthController]
})
export class AuthModule {}
