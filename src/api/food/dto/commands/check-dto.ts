import { ApiProperty } from "@nestjs/swagger";
import { IsOptional, IsNumber, IsString, IsIn } from "class-validator";

export class CheckRequestDto {
    @ApiProperty({ example: 'check', description: 'Наименование команды' })
    @IsString()
    command: 'check';

    @ApiProperty({ required: false, example: 0, description: 'Идентификатор транзакции' })
    @IsOptional()
    txn_id?: number;

    @ApiProperty({ example: 'F8688E83', description: 'Номер лицевого счета / номер карты школьника / номер mifare' })
    @IsString()
    account: string;

    @ApiProperty({ example: 'mifare', description: 'Тип аккаунта' })
    @IsIn(['ls', 'card', 'mifare'], { message: 'account_type должен быть ls, card или mifare' })
    account_type: 'ls' | 'card' | 'mifare';

    @ApiProperty({ required: false, example: 0.0, description: 'Сумма' })
    @IsOptional()
    @IsNumber({ maxDecimalPlaces: 2 })
    sum?: number;

    @ApiProperty({ example: 'superagent', description: 'Идентификатор агента' })
    @IsString()
    agent: string;

    @ApiProperty({ required: false, example: 0, description: 'Дата транзакции' })
    @IsOptional()
    @IsNumber()
    txn_date?: number;

    @ApiProperty({ example: 'buffet', description: 'Тип услуги' })
    @IsIn(['buffet', 'diningroom'], { message: 'service_type должен быть buffet или diningroom' })
    service_type: 'buffet' | 'diningroom';
}

export class CheckResponseDto {
    @ApiProperty({ example: 0, description: 'Результат' })
    @IsNumber()
    result: number;

    @ApiProperty({ example: 0, description: 'Идентификатор транзакции' })
    @IsOptional()
    @IsNumber()
    txn_id?: number;

    @ApiProperty({ example: 'Успешное завершение операции', description: 'Комментарий завершения операции' })
    @IsString()
    comment: string;

    @ApiProperty({ example: 'Иван Иванович И.', description: 'ФИО ученика' })
    @IsString()
    fio: string;

    @ApiProperty({ example: 'г. Уфа, улица Пушкина, 5', description: 'Адрес' })
    @IsString()
    adress: string;

    @ApiProperty({ example: 0.0, description: 'Баланс лицевого счета' })
    @IsNumber({ maxDecimalPlaces: 2 })
    balance: number;

    @ApiProperty({ example: 0.0, description: 'Сумма запроса' })
    @IsOptional()
    @IsNumber({ maxDecimalPlaces: 2 })
    sum?: number;

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

    @ApiProperty({ example: 'k12', description: 'Идентификатор образовательного учреждения' })
    @IsString()
    school_id: string;

    @ApiProperty({ example: 'МОБУ Средняя школа номер 5', description: 'Наименование образовательного учреждения' })
    @IsString()
    school_name: string;

    @ApiProperty({ example: '5Б', description: 'Наименование класса' })
    @IsString()
    klass: string;

    @ApiProperty({ example: '', description: 'Уникальный номер операции в базе БРСК. (необязательное поле для check)' })
    @IsOptional()
    @IsString()
    ext_id?: string;

    @ApiProperty({ example: '20180502120235', description: 'Дата регистрации операции в системе БРСК' })
    @IsString()
    reg_date: string;
}