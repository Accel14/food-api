import { IsOptional, IsNumber, IsString, IsIn, Min, Max } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class PayRequestDto {
    @ApiProperty({ example: 'pay', description: 'Наименование команды' })
    @IsString()
    command: 'pay';

    @ApiProperty({ example: 123456, description: 'Идентификатор транзакции' })
    @IsOptional()
    @IsNumber()
    @Min(0)
    @Max(99999999999999999999)
    txn_id: number;

    @ApiProperty({ example: 'F8688E83', description: 'Номер лицевого счета / номер карты школьника / номер mifare' })
    @IsString()
    account: string;

    @ApiProperty({ example: 'mifare', description: 'Тип аккаунта' })
    @IsIn(['ls', 'card', 'mifare'], { message: "account_type должен быть ls, card или mifare" })
    account_type: 'ls' | 'card' | 'mifare';

    @ApiProperty({ example: 0.0, description: 'Сумма' })
    @IsNumber()
    @Min(0)
    sum: number;

    @ApiProperty({ example: 'superagent', description: 'Идентификатор агента' })
    @IsString()
    agent: string;

    @ApiProperty({ example: 0, description: 'Дата транзакции' })
    @Min(19000101000000)
    @Max(99991231235959)
    txn_date: number;

    @ApiProperty({ example: 'buffet', description: 'Тип услуги' })
    @IsIn(['buffet', 'diningroom'], { message: "service_type должен быть buffet или diningroom" })
    service_type: 'buffet' | 'diningroom';
}

export class PayResponseDto {
    @ApiProperty({ example: 0, description: 'Результат' })
    @IsNumber()
    result: number;

    @ApiProperty({ example: 0, description: 'Идентификатор транзакции' })
    @IsOptional()
    @IsNumber()
    txn_id: number;

    @ApiProperty({ example: 'Успешное завершение операции', description: 'Комментарий завершения операции' })
    @IsString()
    comment: string;

    @ApiProperty({ example: 'Иван Иванович И.', description: 'ФИО ученика.' })
    @IsString()
    fio: string;

    @ApiProperty({ example: 'г. Уфа, улица Пушкина, 5', description: 'Адрес' })
    @IsString()
    adress: string;

    @ApiProperty({ example: 985.37, description: 'Баланс лицевого счета' })
    @IsNumber()
    balance: number;

    @ApiProperty({ example: 0.01, description: 'Сумма запроса' })
    @IsNumber()
    sum: number;

    @ApiProperty({ example: 'Пополнение лицевого счета [Буфет]', description: 'Наименование операции' })
    @IsString()
    info: string;

    @ApiProperty({ example: 'at-29', description: 'Идентификатор поставщика услуги' })
    @IsString()
    provider_id: string;

    @ApiProperty({ example: 'ООО Общепит', description: 'Наименование поставщика услуги' })
    @IsString()
    provider_name: string;

    @ApiProperty({ example: '044525787', description: 'БИК поставщика услуги' })
    @IsString()
    provider_bik: string;

    @ApiProperty({ example: '18210703000011000110', description: 'КБК поставщика услуги' })
    @IsString()
    provider_kbk: string;

    @ApiProperty({ example: '40702810200820002006', description: 'Расчетный счет поставщика услуги' })
    @IsString()
    provider_rs: string;

    @ApiProperty({ example: '0274124752', description: 'ИНН поставщика услуги' })
    @IsString()
    provider_inn: string;

    @ApiProperty({ example: '1231687810', description: 'ОКТМО поставщика услуги' })
    @IsString()
    provider_oktmo: string;

    @ApiProperty({ example: 'k12', description: 'ОКТМО поставщика услуги' })
    @IsString()
    school_id: string;

    @ApiProperty({ example: 'МОБУ Средняя школа номер 5', description: 'Наименование образовательного учреждения' })
    @IsString()
    school_name: string;

    @ApiProperty({ example: '5Б', description: 'Наименование класса' })
    @IsString()
    klass: string;

    @ApiProperty({ example: 'arf-12347-fd', description: 'Уникальный номер операции в базе БРСК' })
    @IsString()
    ext_id: string;

    @ApiProperty({ example: '20180502120235', description: 'Дата регистрации операции в системе БРСК' })
    @IsString()
    reg_date: string;
}