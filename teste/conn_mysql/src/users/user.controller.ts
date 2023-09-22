// user.controller.ts
import { Controller, Get, HttpException, HttpStatus } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async findAll() {
    try {
      const users = await this.userService.findAll();
      console.log(users); // Isso irá imprimir os dados da tabela no console
      return users;
    } catch (error) {
      throw new HttpException({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        error: 'Error fetching users',
      }, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
