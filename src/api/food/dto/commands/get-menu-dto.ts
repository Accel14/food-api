import { Type } from "class-transformer";
import { ApiProperty } from "@nestjs/swagger";
import {
    IsOptional,
    Equals,
    IsNumber,
    IsString,
    IsArray,
    IsIn,
    ValidateNested,
    ValidateIf,
    Min,
    Max
} from "class-validator";

export class GetMenuRequestDto {
    @ApiProperty({ example: 'get_menu', description: 'Наименование команды' })
    @IsString()
    command: 'get_menu';

    @ApiProperty({ required: false, example: 0, description: 'Идентификатор транзакции' })
    @IsOptional()
    @IsNumber()
    @Min(0)
    @Max(99999999999999999999)
    txn_id?: number;

    @ApiProperty({ example: '025', description: 'Идентификатор КШП' })
    @IsString()
    account: string;

    @ApiProperty({ example: 'provider', description: 'Тип акаунта' })
    @Equals('provider')
    account_type: 'provider';

    @ApiProperty({ required: false, example: 0.0, description: 'Сумма' })
    @IsOptional()
    sum?: number;

    @ApiProperty({ example: 'superagent', description: 'идентификатор агента' })
    @IsString()
    agent: string;

    @ApiProperty({ required: false, example: 0, description: 'Дата транзакции' })
    @IsOptional()
    @IsNumber()
    txn_date?: number;

    @ApiProperty({ example: 'buffet', description: 'Тип услуги' })
    @IsString()
    @IsIn(['buffet', 'diningroom'], { message: 'service_type должен быть buffet или diningroom' })
    service_type: 'buffet' | 'diningroom';
}

export class GetMenuResponseDto {
    @ApiProperty({ example: 0, description: 'Результат' })
    @IsNumber()
    result: number;

    @ApiProperty({ example: 'Успешное завершение операции', description: 'Комментарий завершения операции' })
    @IsString()
    comment: string;

    @ApiProperty({
        required: false, example: [
            {
                product_id: "12gf3",
                name: "Пирожки с вишней 75",
                provider_id: "025",
                price: 15.0,
                product_barcode: "2000992569248",
                school_id: "r564",
                school_name: "МАОУ СОШ № 33",
                unit_name: "шт",
                service_type: "buffet"
            },
            {
                product_id: "1g41f3",
                name: "Батончик Курьез 26гр",
                provider_id: "025",
                price: 15.0,
                product_barcode: null,
                school_id: "r564",
                school_name: "МАОУ СОШ № 33",
                unit_name: "шт",
                service_type: "buffet"
            },
        ], description: 'Продукты'
    })
    @ValidateIf(o => o.service_type === 'buffet')
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => ProductDto)
    products?: ProductDto[];

    @ApiProperty({
        required: false, example: [
            {
                menu_id: "d198",
                name: "Льготный обед",
                provider_id: "025",
                price: 50.0,
                holiday_price: 40.0,
                school_id: "r564",
                school_name: "МАОУ СОШ № 33",
                subsidy: 50.0,
                subsidy_title: "Республиканская дотация",
                service_type: "diningroom"
            },
            {
                menu_id: "12gf3",
                name: "Полдник",
                provider_id: "025",
                price: 25.0,
                holiday_price: 10.0,
                school_id: "r564",
                school_name: "МАОУ СОШ № 33",
                subsidy: 0.0,
                subsidy_title: null,
                service_type: "diningroom"
            }
        ]
    })
    @ValidateIf(o => o.service_type === 'diningroom')
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => MenuDto)
    menu?: MenuDto[];
}

class MenuDto {
    @ApiProperty({ example: 'd198', description: 'Результат' })
    @IsString()
    menu_id: string;

    @IsString()
    name: string;

    @IsString()
    provider_id: string;

    @IsNumber({ maxDecimalPlaces: 2 })
    price: number;

    @IsNumber({ maxDecimalPlaces: 2 })
    holiday_price: number;

    @IsString()
    school_id: string;

    @IsString()
    school_name: string;

    @IsNumber({ maxDecimalPlaces: 2 })
    subsidy: number;

    @IsOptional()
    @IsString()
    subsidy_title: string | null;

    @IsIn(['buffet', 'diningroom'])
    service_type: 'buffet' | 'diningroom';
}

class ProductDto {
    @IsString()
    product_id: string;

    @IsString()
    name: string;

    @IsString()
    provider_id: string;

    @IsNumber({ maxDecimalPlaces: 2 })
    price: number;

    @IsOptional()
    product_barcode: string | null;

    @IsString()
    school_id: string;

    @IsString()
    school_name: string;

    @IsString()
    unit_name: string;

    @IsIn(['buffet', 'diningroom'])
    service_type: 'buffet' | 'diningroom';
}

