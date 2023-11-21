import { ValidatorConstraint, ValidatorConstraintInterface, registerDecorator, ValidationArguments } from 'class-validator';

interface StrongPassOptions {
    minLength?: number;
    requireUppercase?: boolean;
    requireLowercase?: boolean;
    requireDigit?: boolean;
    requireSpecialChar?: boolean;
}

@ValidatorConstraint({ name: 'isStrongPass', async: false })
export class IsStrongPassConstraint  implements ValidatorConstraintInterface {
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
}

export function IsStrongPass(message: string, options?: StrongPassOptions) {
    return function (object: Object, propertyName: string) {
        registerDecorator({
            name: 'isStrongPass',
            target: object.constructor,
            propertyName: propertyName,
            constraints: [options],
            options: {
                message
            },
            validator: IsStrongPassConstraint,
        });
    };
}
