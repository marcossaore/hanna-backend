import { Inject, Injectable } from '@nestjs/common';
import * as session from 'express-session';
import { createClient } from 'redis';
import RedisStore from 'connect-redis';

@Injectable()
export class SessionManager {

    private redisStore: any = null;

    constructor (@Inject('SESSION_OPTIONS') private readonly sessionOptions: any) {
        const redisClient = createClient({
            url: `redis://${this.sessionOptions.user}:${this.sessionOptions.pass}@${this.sessionOptions.host}:${this.sessionOptions.port}`
        });

        redisClient.connect().catch(console.error)

        this.redisStore = new RedisStore({
            client: redisClient,
            prefix: `${this.sessionOptions.prefix}`
        })

    }
    
    getSession(): any {
        return session({
            store: this.redisStore,
            secret: this.sessionOptions.secret,
            resave: false,
            saveUninitialized: false,
            cookie: { maxAge: 360000, secure: true }
        });
    }
}
