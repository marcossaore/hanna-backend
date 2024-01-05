import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { UserService } from '../../user/user.service'

@Injectable()
export class PermissionsGuard implements CanActivate {
  private readonly convertActions = { 
    read: 'leitura',
    create: 'criação',
    edit: 'edição',
    delete: 'deleção'
  }

  constructor(
    private reflector: Reflector,
    private userService: UserService
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const metadata = this.reflector.get<{ module: string; action: string }>(
      'permission',
      context.getHandler()
    )

    if (!metadata) {
      throw new UnauthorizedException(`Você não possui permissão de ${this.convertActions[metadata.action]} ao módulo: "${metadata.module}".`)
    }

    const request = context.switchToHttp().getRequest()

    const hasPermission = await this.userService.hasRole(request.locals.userId, metadata.module, metadata.action)

    if (!hasPermission[metadata.action]) {
      throw new UnauthorizedException(`Você não possui permissão de ${this.convertActions[metadata.action]} ao módulo: "${metadata.module}".`)
    }

    request.locals.permission = hasPermission;

    return true
  }
}
