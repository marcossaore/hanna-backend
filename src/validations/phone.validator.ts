import {
    ValidationOptions,
    ValidatorConstraint,
    ValidatorConstraintInterface,
    registerDecorator,
    ValidationArguments,
} from 'class-validator';

@ValidatorConstraint({ name: 'isPhone', async: false })
export class IsPhoneValidationConstraint
    implements ValidatorConstraintInterface
{
    validate(phone: string) {
        if (!phone) {
            return false;
        }

        if (!/^\d+$/.test(phone)) {
            return false;
        }

        if (phone.length !== 11) {
            return false;
        }

        return true;
    }

    defaultMessage(args: ValidationArguments) {
        return `${args.property} must contain valid Phone!`;
    }
}

export function IsPhone(validationOptions?: ValidationOptions) {
    return function (object: unknown, propertyName: string) {
        registerDecorator({
            name: 'isPhone',
            target: object.constructor,
            propertyName: propertyName,
            constraints: ['isPhone'],
            options: validationOptions,
            validator: IsPhoneValidationConstraint,
        });
    };
}
