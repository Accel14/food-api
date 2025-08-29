import { IsString, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CheckProgressRequestDto {
    @ApiProperty({ description: 'Команда запроса', example: 'check_progress' })
    @IsString()
    command: string;

    @ApiProperty({ description: 'Номер лицевого счета', example: '736935' })
    @IsString()
    account: string;

    @ApiProperty({ description: 'Тип счета (обычно ls)', example: 'ls' })
    @IsString()
    account_type: string;

    @ApiProperty({ description: 'Имя агента', example: 'superagent' })
    @IsString()
    agent: string;

    @ApiProperty({ description: 'Тип сервиса', example: 'diningroom' })
    @IsString()
    service_type: string;
}

export class CheckProgressResponseDto {
    @ApiProperty({ description: 'Внешний номер лицевого счета', example: '736935' })
    @IsString()
    ls: string;

    @ApiProperty({ description: 'Внутренний номер лицевого счета', example: '000000023369352' })
    @IsString()
    internal_ls: string;

    @ApiProperty({ description: 'Номер карты школьника', example: '9643100203319958085' })
    @IsString()
    card: string;

    @ApiProperty({ description: 'Номер чипа карты школьника', example: 'F4AC0A2E' })
    @IsString()
    mifare: string;

    @ApiProperty({ description: 'КПП провайдера', example: '027401001' })
    @IsString()
    provider_kpp: string;

    @ApiProperty({ description: 'Код результата', example: 0 })
    @IsNumber()
    result: number;

    @ApiProperty({ description: 'ID транзакции', example: 0 })
    @IsNumber()
    txn_id: number;

    @ApiProperty({ description: 'Комментарий к операции', example: 'Успешное завершение операции' })
    @IsString()
    comment: string;

    @ApiProperty({ description: 'ФИО пользователя', example: 'Полина Витальевна Ю.' })
    @IsString()
    fio: string;

    @ApiProperty({ description: 'Адрес пользователя', example: '450065, Уфа, ул Кулибина, 38' })
    @IsString()
    adress: string;

    @ApiProperty({ description: 'Баланс лицевого счета', example: 50.0 })
    @IsNumber()
    balance: number;

    @ApiProperty({ description: 'Сумма операции', example: 0.0 })
    @IsNumber()
    sum: number;

    @ApiProperty({ description: 'Информация о пополнении', example: 'Пополнение лицевого счета [Буфет]' })
    @IsString()
    info: string;

    @ApiProperty({ description: 'ID провайдера', example: '33' })
    @IsString()
    provider_id: string;

    @ApiProperty({ description: 'Название провайдера', example: 'МАУ ЦДДП' })
    @IsString()
    provider_name: string;

    @ApiProperty({ description: 'БИК провайдера', example: '018073401' })
    @IsString()
    provider_bik: string;

    @ApiProperty({ description: 'КБК провайдера', example: '77500000000000000131' })
    @IsString()
    provider_kbk: string;

    @ApiProperty({ description: 'Р/С провайдера', example: '03234643807010000100' })
    @IsString()
    provider_rs: string;

    @ApiProperty({ description: 'ИНН провайдера', example: '0274149764' })
    @IsString()
    provider_inn: string;

    @ApiProperty({ description: 'ОКТМО провайдера', example: '80701000' })
    @IsString()
    provider_oktmo: string;

    @ApiProperty({ description: 'ID школы', example: '511' })
    @IsString()
    school_id: string;

    @ApiProperty({ description: 'Название школы', example: 'МАОУ Школа № 85' })
    @IsString()
    school_name: string;

    @ApiProperty({ description: 'Класс ученика', example: '3А' })
    @IsString()
    klass: string;

    @ApiProperty({ description: 'Внешний ID', example: '169588260440658261' })
    @IsString()
    ext_id: string;

    @ApiProperty({ description: 'Дата регистрации', example: '20230928113004' })
    @IsString()
    reg_date: string;
}
