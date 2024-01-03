import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { DefaultHttpException } from '@/shared/errors/default-http-exception'
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
      throw new DefaultHttpException(
        `Você não possui permissão de ${this.convertActions[metadata.action]} ao módulo: "${metadata.module}" `,
        403
      )
    }

    const request = context.switchToHttp().getRequest()

    const hasPermission = await this.userService.hasRole(request.locals.userId, metadata.module, metadata.action)

    if (!hasPermission[metadata.action]) {
      throw new DefaultHttpException(
        `Você não possui permissão de ${this.convertActions[metadata.action]} ao módulo: "${metadata.module}" `,
        403
      )
    }

    request.locals.permission = hasPermission;

    return true
  }
}
