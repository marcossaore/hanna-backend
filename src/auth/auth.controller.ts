import { Controller, Request, UseGuards, Post } from '@nestjs/common';
import { AuthenticatedGuard } from './authenticated.guard';

@Controller('auth')
export class AuthController {
  @UseGuards(AuthenticatedGuard)
  @Post('/login')
  //tipar o retorno
  async login(@Request() req): Promise<any> {
    return req.user;
  }
}
