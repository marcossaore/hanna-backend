import { Controller, Request, UseGuards, Get } from '@nestjs/common';
import { AuthenticatedGuard } from './authenticated.guard';

@Controller('auth')
export class AuthController {
  @UseGuards(AuthenticatedGuard)
  @Get('/login')
  //tipar o retorno
  async login(@Request() req): Promise<any> {
    return req.user;
  }
}
