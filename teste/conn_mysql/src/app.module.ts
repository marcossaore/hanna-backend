import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from './users/user.model';
import { UserController } from './users/user.controller';
import { UserService } from './users/user.service';

@Module({
  imports: [
    SequelizeModule.forRoot({
      dialect: 'mysql',
      host: 'localhost',
      // port: 3306,
      username: 'dev',
      password: 'dev',
      database: 'hannadb',
      models: [User],
      autoLoadModels: true,
      synchronize: true,
    }),
    SequelizeModule.forFeature([User]),
  ],
  controllers: [UserController],
  providers: [UserService],
})
export class AppModule {}
