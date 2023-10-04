import { ValidationOptions, ValidatorConstraint, ValidatorConstraintInterface, registerDecorator, ValidationArguments } from 'class-validator';

@ValidatorConstraint({ name: 'isCompanyIdentifier', async: false })
export class IsCompanyIdentifierValidationConstraint implements ValidatorConstraintInterface {

    private error = null;

    validate(companyIdentifier: string, _args: ValidationArguments) {

        if (!companyIdentifier) {
            this.error = 'deve ser informada!'
            return false;
        }

        if(companyIdentifier.length < 6 || companyIdentifier.length > 12) {
            this.error = 'deve ter no mínimo 6 e máximo 12 caracteres!'
            return false;
        }

        if (/\s/.test(companyIdentifier)) {
            this.error = 'não deve conter espaços!'
            return false;
        }

        return true;
    }

    defaultMessage(args: ValidationArguments) {
        return JSON.stringify({message: `A identificação única da empresa ${this.error}`, field: args.property});
    }
}

export function IsCompanyIdentifier(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isCompanyIdentifier',
      target: object.constructor,
      propertyName: propertyName,
      constraints: ['isCompanyIdentifier'],
      options: validationOptions,
      validator: IsCompanyIdentifierValidationConstraint,
    });
  };
}
