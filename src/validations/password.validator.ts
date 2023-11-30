import {
    ValidatorConstraint,
    ValidatorConstraintInterface,
    registerDecorator,
    ValidationArguments,
} from 'class-validator';

interface StrongPassOptions {
    message?: string;
    minLength?: number;
    requireUppercase?: boolean;
    requireLowercase?: boolean;
    requireDigit?: boolean;
    requireSpecialChar?: boolean;
}

@ValidatorConstraint({ name: 'isStrongPass', async: false })
export class IsStrongPassConstraint implements ValidatorConstraintInterface {
    validate(password: string, args: ValidationArguments) {
        if (!password) {
            return false;
        }

        const options: StrongPassOptions = args.constraints[0] || {};

        const {
            minLength = 8,
            requireUppercase = true,
            requireLowercase = true,
            requireDigit = true,
            requireSpecialChar = true,
        } = options;

        const hasUppercase = /[A-Z]/.test(password);
        const hasLowercase = /[a-z]/.test(password);
        const hasDigit = /\d/.test(password);
        const hasSpecialChar = /(?=.*\W)/.test(password);

        return (
            password.length >= minLength &&
            (!requireUppercase || hasUppercase) &&
            (!requireLowercase || hasLowercase) &&
            (!requireDigit || hasDigit) &&
            (!requireSpecialChar || hasSpecialChar)
        );
    }

    defaultMessage(args: ValidationArguments) {
        return JSON.stringify({
            message: args.constraints[0].message,
            field: args.property,
        });
    }
}

export function IsStrongPass(options?: StrongPassOptions) {
    if (!options?.message) {
        options = {
            ...options,
            message:
                'A senha deve conter no mínimo 8 caracteres, com ao menos 1 letra maíuscula, 1 minúscula, 1 dígito e 1 caracter especial (*?!...)',
        };
    }
    return function (object: unknown, propertyName: string) {
        registerDecorator({
            name: 'isStrongPass',
            target: object.constructor,
            propertyName: propertyName,
            constraints: [options],
            validator: IsStrongPassConstraint,
        });
    };
}
