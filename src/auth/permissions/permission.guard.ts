import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { DefaultHttpException } from '../../_common/errors/default-http-exception';

@Injectable()
export class PermissionsGuard implements CanActivate {

    private readonly convertActions = [
        { read: 'leitura' },
        { create: 'criação' }, 
        { edit: 'edição' },
        { delete: 'deleção' }
    ];

    constructor(private reflector: Reflector) {}

    canActivate(context: ExecutionContext): boolean {
        const metadata = this.reflector.get<{ module: string; action: string }>('permission', context.getHandler());
        
        if (!metadata) {
            throw new DefaultHttpException(`Você não possui permissão de ${this.convertAction(metadata.action)} ao módulo: "${module}" `, 403);
        }

        const request = context.switchToHttp().getRequest();

        const moduleIsAllowed = request.session.auth.user.permissions.filter(({ module }) => {
            return metadata.module === module.name && 
            module.actions.filter(({ name }) => name === metadata.action);
        });

        if (moduleIsAllowed.length === 0) {
            throw new DefaultHttpException(`Você não possui permissão de ${this.convertAction(metadata.action)} ao módulo: "${module}" `, 403);
        }

        return true;
    }

    private convertAction (action: string) {
        this.convertActions[action];
    }
}
