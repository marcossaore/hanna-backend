import {
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  registerDecorator,
  ValidationArguments
} from 'class-validator'

@ValidatorConstraint({ name: 'isEquals', async: false })
export class IsEqualsValidationConstraint
  implements ValidatorConstraintInterface
{
  validate(value: any, args: ValidationArguments) {
    const [relatedPropertyName] = args.constraints
    const relatedValue = (args.object as any)[relatedPropertyName]
    return value === relatedValue
  }

  defaultMessage(args: ValidationArguments) {
    const [relatedPropertyName] = args.constraints
    return `${args.property} must be equal to ${relatedPropertyName}`
  }
}

export function IsEqual(
  property: string,
  validationOptions?: ValidationOptions
) {
  return function (object: Record<string, any>, propertyName: string) {
    registerDecorator({
      name: 'isEqual',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [property],
      options: validationOptions,
      validator: IsEqualsValidationConstraint
    })
  }
}
