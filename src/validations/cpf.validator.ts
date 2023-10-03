import { ValidationOptions, ValidatorConstraint, ValidatorConstraintInterface, registerDecorator, ValidationArguments } from 'class-validator';

@ValidatorConstraint({ name: 'isCpf', async: false })
export class IsCpfValidationConstraint implements ValidatorConstraintInterface {
  validate(cpf: string, _args: ValidationArguments) {

    if (!/[0-9]{11}/.test(cpf)) {
        return false;
    }

    if (cpf === "00000000000") {
        return false;
    }

    let soma = 0;

    for (let i = 1; i <= 9; i++) {
        soma += parseInt(cpf.substring(i - 1, i)) * (11 - i);
    }

    let resto = soma % 11;

    if (resto === 10 || resto === 11 || resto < 2) {
        resto = 0;
    } else {
        resto = 11 - resto;
    }

    if (resto !== parseInt(cpf.substring(9, 10))) {
        return false;
    }

    soma = 0;

    for (let i = 1; i <= 10; i++) {
        soma += parseInt(cpf.substring(i - 1, i)) * (12 - i);
    }
    
    resto = soma % 11;

    if (resto === 10 || resto === 11 || resto < 2) {
        resto = 0;
    } else {
        resto = 11 - resto;
    }
 
    if (resto !== parseInt(cpf.substring(10, 11))) {
        return false;
    }

    return true;
  }

  defaultMessage(args: ValidationArguments) {
    return `${args.property} must contain valid CPF!`;
  }
}

export function IsCpf(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isCpf',
      target: object.constructor,
      propertyName: propertyName,
      constraints: ['isCpf'],
      options: validationOptions,
      validator: IsCpfValidationConstraint,
    });
  };
}
