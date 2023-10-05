import { BadRequestException, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { ValidationError, validate } from 'class-validator';
import { CompanyAdmin } from './company-admin';
import { CompanyAdminDto } from './company-admin.dto';
import { DefaultHttpException } from '../../_common/errors/default-http-exception';

@Injectable()
export class AdminCompaniesValidator {

    private validationErrors: ValidationError[] = [];

    async handle(admins: CompanyAdmin[]): Promise<HttpException|void> {

        if (!admins) {
            return new DefaultHttpException(
                {
                    type: (new BadRequestException).message,
                    field: 'admins',
                    message: 'A propriedade "admins" deve ser informada'
                }, 
                HttpStatus.BAD_REQUEST
            );
        }

        if (!Array.isArray(admins)) {
            return new DefaultHttpException(
                {
                    type: (new BadRequestException).message,
                    field: 'admins',
                    message: 'O campo deve ser do tipo "array"!'
                }, 
                HttpStatus.BAD_REQUEST
            );
        }

        if (admins.length === 0) {
            return new DefaultHttpException(
                {
                    type: (new BadRequestException).message,
                    field: 'admins',
                    message: 'Ao menos 1 admin deve ser cadastrado!'
                }, 
                HttpStatus.BAD_REQUEST
            );
        }

        for (const admin of admins) {
            const adminDto = plainToClass(CompanyAdminDto, admin);
            this.validationErrors = await validate(adminDto);

            const hasError = this.hasError();

            if (hasError) {
                return hasError;
            }
        }
    }

    private hasError () : DefaultHttpException|null {
        if (this.validationErrors.length > 0) {
            for (const error of this.validationErrors) {
                for (const key in error.constraints) {
                    const errorFound = JSON.parse(error.constraints[key]);
                    errorFound.type = (new BadRequestException).message;
                    return new DefaultHttpException(errorFound, HttpStatus.BAD_REQUEST);
                }
            }
        }

        return null;
    }
}