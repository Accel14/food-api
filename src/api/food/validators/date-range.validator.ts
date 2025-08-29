import {
    registerDecorator,
    ValidationOptions,
    ValidationArguments,
} from 'class-validator';

interface DateRangeOptions {
    maxDays: number;
}

/**
 * Декоратор для проверки интервала между begin_date и end_date на уровне класса
 */
export function ValidateDateRange(
    options: DateRangeOptions,
    validationOptions?: ValidationOptions,
): ClassDecorator {
    return function (constructor: Function) {
        registerDecorator({
            name: 'validateDateRange',
            target: constructor,
            propertyName: undefined as any, // указываем, что это "class-level"
            constraints: [options],
            options: validationOptions,
            validator: {
                validate(_: any, args: ValidationArguments) {
                    const { maxDays } = args.constraints[0] as DateRangeOptions;
                    const obj: any = args.object;

                    const begin = obj.begin_date;
                    const end = obj.end_date;
                    if (!begin || !end) return true;

                    const parseDate = (num: number) =>
                        new Date(
                            Math.floor(num / 10000),
                            Math.floor((num % 10000) / 100) - 1,
                            num % 100,
                        );

                    const beginDate = parseDate(begin);
                    const endDate = parseDate(end);

                    const diffTime = endDate.getTime() - beginDate.getTime();
                    const diffDays = diffTime / (1000 * 60 * 60 * 24);

                    return diffDays <= maxDays;
                },
                defaultMessage(args: ValidationArguments) {
                    const { maxDays } = args.constraints[0] as DateRangeOptions;
                    return `Интервал дат не должен превышать ${maxDays} дней`;
                },
            },
        });
    };
}
