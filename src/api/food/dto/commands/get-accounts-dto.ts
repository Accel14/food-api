import { IsOptional, IsNumber, IsString, IsArray, ValidateNested } from "class-validator";
import { Type } from "class-transformer";
import { ApiProperty } from "@nestjs/swagger";

export class GetAccountsRequestDto {
    @ApiProperty({ example: 'get_accounts', description: 'Наименование команды' })
    @IsString()
    command: 'get_accounts';

    @ApiProperty({ example: '4b76', description: 'Идентификатор КШП' })
    @IsString()
    account: string;

    @ApiProperty({ example: 'provider', description: 'Тип аккаунта' })
    @IsString()
    account_type: 'provider';

    @ApiProperty({ example: 'superagent', description: 'Идентификатор агента' })
    @IsString()
    agent: string;

    @ApiProperty({ example: '45d56', description: 'Идентификатор школы' })
    @IsString()
    school_id: string;
}

export class GetAccountsResponseDto {
    @ApiProperty({ example: 0, description: 'Результат' })
    @IsNumber()
    result: number;

    @ApiProperty({ example: 'Успешное завершение операции', description: 'Комментарий завершения операции' })
    @IsString()
    comment: string;

    @ApiProperty({ description: 'Счета' })
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => AccountDto)
    accounts: AccountDto[];
}

class AccountDto {
    @IsString()
    @IsOptional()
    external?: string;

    @IsString()
    buffet: string;

    @IsString()
    diningroom: string;

    @IsString()
    fio: string;

    @IsString()
    klass: string;

    @IsString()
    @IsOptional()
    chip_number?: string;
}