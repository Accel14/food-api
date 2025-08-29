import { Type } from "class-transformer";
import { ProductIdentifierValidator } from "../../validators/product-identifier.validator";
import { ApiProperty } from "@nestjs/swagger";
import {
    IsOptional,
    IsNumber,
    IsString,
    IsArray,
    IsIn,
    ValidateNested,
    ValidateIf,
    Validate,
    Min,
    Max
} from "class-validator";

export class SendCheckRequestDto {
    @ApiProperty({ example: 'pay', description: 'Наименование команды' })
    @IsString()
    command: 'send_check';

    @ApiProperty({ example: 123456, description: 'Идентификатор транзакции' })
    @IsOptional()
    @IsNumber()
    @Min(0)
    @Max(99999999999999999999)
    txn_id?: number;

    @ApiProperty({ example: 'F8688E83', description: 'Номер лицевого счета / номер карты школьника / номер mifare' })
    @IsString()
    account: string;

    @ApiProperty({ example: 'mifare', description: 'Тип аккаунта' })
    @IsIn(['ls', 'card', 'mifare'])
    account_type: 'ls' | 'card' | 'mifare';

    @ApiProperty({ example: 0.0, description: 'Сумма' })
    @IsNumber({ maxDecimalPlaces: 2 })
    @Min(0)
    sum: number;

    @ApiProperty({ example: 'superagent', description: 'Идентификатор агента' })
    @IsString()
    agent: string;

    @ApiProperty({ example: 0, description: 'Дата транзакции' })
    @IsOptional()
    @IsNumber()
    @Min(19000101000000)
    @Max(99991231235959)
    txn_date?: number;

    @ApiProperty({ example: 'buffet', description: 'Тип услуги' })
    @IsIn(['buffet', 'diningroom'], { message: 'service_type должен быть buffet или diningroom' })
    service_type: 'buffet' | 'diningroom';

    // Для diningroom
    @ApiProperty({ example: 0.00, description: 'Сумма субсидии' })
    @ValidateIf(o => o.service_type === 'diningroom')
    @IsNumber({ maxDecimalPlaces: 2 })
    subsidy?: number;

    @ApiProperty({ example: '01f23', description: 'MenuId' })
    @ValidateIf(o => o.service_type === 'diningroom')
    @IsOptional()
    @IsString()
    menu_id?: string;

    // Для buffet
    @ApiProperty({ description: 'Продукты' })
    @IsOptional()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => ProductDto)
    @Validate(ProductIdentifierValidator, { each: true })
    products?: ProductDto[];
}

export class SendCheckResponseDto {
    @ApiProperty({ example: 0, description: 'Результат' })
    @IsNumber()
    result: number;

    @ApiProperty({ example: 'Успешное завершение операции', description: 'Комментарий завершения операции' })
    @IsString()
    comment: string;
}

class ProductDto {
    @IsNumber({ maxDecimalPlaces: 2 })
    @Min(0)
    price: number;

    @IsNumber()
    @Min(1)
    count: number;

    @ValidateIf(o => !o.product_code)
    @IsString()
    @IsOptional()
    product_id?: string;

    @ValidateIf(o => !o.product_id)
    @IsString()
    @IsOptional()
    product_code?: string;

    @ValidateIf(o => o.product_code)
    @IsString()
    @IsOptional()
    name?: string;
}