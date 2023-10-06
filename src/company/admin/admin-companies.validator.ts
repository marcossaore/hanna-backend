import { BadRequestException, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { ValidationError, validate } from 'class-validator';
import { AdminCompany } from './admin-company';
import { AdminCompanyDto } from './admin-company.dto';
import { DefaultHttpException } from '../../_common/errors/default-http-exception';

@Injectable()
export class AdminCompaniesValidator {

    private validationErrors: ValidationError[] = [];

    async handle(admins: AdminCompany[]): Promise<HttpException|void> {

        if (!admins) {
            return new DefaultHttpException(
                {
                    type: (new BadRequestException).message,
                    field: 'admins',
                    message: 'A propriedade "admins" deve ser informada!'
                }, 
                HttpStatus.BAD_REQUEST
            );
        }

        if (!Array.isArray(admins)) {
            return new DefaultHttpException(
                {
                    type: (new BadRequestException).message,
                    field: 'admins',
                    message: 'A propriedade deve ser do tipo "array"!'
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

        const hasDuplicatedEmail = this.hasDuplicatedEmail(admins);

        if (hasDuplicatedEmail) {
            return hasDuplicatedEmail;
        }

        for (let index = 0; index < admins.length; index++) {
            const admin = admins[index];

            const adminDto = plainToClass(AdminCompanyDto, admin);
            this.validationErrors = await validate(adminDto);

            const hasError = this.hasError(index);

            if (hasError) {
                return hasError;
            }
        }
    }

    private hasError (atIndex: number) : DefaultHttpException|null {
        if (this.validationErrors.length > 0) {
            for (const error of this.validationErrors) {
                for (const key in error.constraints) {
                    const errorFound = JSON.parse(error.constraints[key]);
                    errorFound.field = `admins[${atIndex}].${errorFound.field}`;
                    errorFound.type = (new BadRequestException).message;
                    return new DefaultHttpException(errorFound, HttpStatus.BAD_REQUEST);
                }
            }

        }

        return null;
    }

    private hasDuplicatedEmail (admins: AdminCompany[]) : DefaultHttpException|void {
        const filterEmail = [];
        for (let index = 0; index < admins.length; index++) {
            if(!filterEmail.includes(admins[index].email)) {
                filterEmail.push(admins[index].email);
            } else {
                return new DefaultHttpException(
                    {
                        type: (new BadRequestException).message,
                        field: `admins[${index}].email`,
                        message: 'Não pode haver dois ou mais admins cadastrados para a empresa com o mesmo email!'
                    }, 
                    HttpStatus.BAD_REQUEST
                );
            }
        }
    }
}