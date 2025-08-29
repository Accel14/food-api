import { IsNotEmpty, IsNumber, IsString, IsIn, IsArray, ValidateNested } from "class-validator";
import { ValidateDateRange } from "../../validators/date-range.validator";
import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";

@ValidateDateRange({ maxDays: 31 }, { message: 'Максимальный интервал - 31 день' })
export class GetPaymentsRequestDto {
    @ApiProperty({ example: 'get_payments', description: 'Наименование команды' })
    @IsNotEmpty()
    @IsString()
    command: 'get_payments';

    @ApiProperty({ example: '476', description: 'Идентификатор КШП' })
    @IsNotEmpty()
    @IsString()
    account: string;

    @ApiProperty({ example: 'provider', description: 'Тип аккаунта' })
    @IsNotEmpty()
    @IsString()
    @IsIn(['provider'])
    account_type: 'provider';

    @ApiProperty({ example: 'superagent', description: 'идентификатор агента' })
    @IsNotEmpty()
    @IsString()
    agent: string;

    @ApiProperty({ example: 'buffet', description: 'Тип услуги' })
    @IsNotEmpty()
    @IsString()
    @IsIn(['buffet', 'diningroom'], { message: 'service_type должен быть buffet или diningroom' })
    service_type: 'buffet' | 'diningroom';

    @ApiProperty({ example: 20200324, description: 'Начальная дата (включительно)' })
    @IsNotEmpty()
    @IsNumber()
    begin_date: number;

    @ApiProperty({ example: 20200325, description: 'Конечная дата (НЕ включительно)' })
    @IsNotEmpty()
    @IsNumber()
    end_date: number;

    @ApiProperty({ example: '45d56', description: 'Идентификатор школы' })
    @IsString()
    school_id: string;
}

export class GetPaymentsResponseDto {
    @ApiProperty({ example: 0, description: 'Результат' })
    @IsNumber()
    result: number;

    @ApiProperty({ example: 'Успешное завершение операции', description: 'Комментарий завершения операции' })
    @IsString()
    comment: string;

    @ApiProperty({ description: 'Счета' })
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => PaymentsAccountDto)
    payments: PaymentsAccountDto[];
}

export class PaymentsAccountDto {
    @IsString()
    account: string;

    @IsNumber()
    sum: number;

    @IsNumber()
    date: number;
}