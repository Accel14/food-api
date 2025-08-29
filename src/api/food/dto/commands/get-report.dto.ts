import { IsNotEmpty, IsNumber, IsString, IsArray, IsIn, ValidateNested } from "class-validator";
import { Type } from "class-transformer";
import { ValidateDateRange } from "../../validators/date-range.validator";
import { ApiProperty } from "@nestjs/swagger";

@ValidateDateRange({ maxDays: 31 }, { message: 'Максимальный интервал - 31 день' })
export class GetReportRequestDto {
    @ApiProperty({ example: 'get_report', description: 'Наименование команды' })
    @IsNotEmpty()
    @IsString()
    command: 'get_report';

    @ApiProperty({ example: '025', description: 'Идентификатор КШП' })
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
}

export class GetReportResponseDto {
    @ApiProperty({ example: 0, description: 'Результат' })
    @IsNumber()
    result: number;

    @ApiProperty({ example: 'Успешное завершение операции', description: 'Комментарий завершения операции' })
    @IsString()
    comment: string;

    @ApiProperty({ description: 'Отчеты' })
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => ReportItemDto)
    report: ReportItemDto[];
}

export class ReportItemDto {
    @IsString()
    menu_id: string;

    @IsNumber()
    number: number;

    @IsNumber()
    date: number;

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => AccountDto)
    accounts: AccountDto[];
}

export class AccountDto {
    @IsString()
    account: string;
}