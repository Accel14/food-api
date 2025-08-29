import { Get, Header, Query, Body, Controller, HttpCode, Post, UseGuards } from '@nestjs/common';
import { FoodService } from './food.service';
import { BasicAuthGuard } from '../../guards/basic-auth.guard';
import { XmlConverter } from '../../utils/xml-converter.util';
import { ApiStandardResponses } from '../api-standard-responses.dto';

import {
    ApiBasicAuth,
    ApiOperation,
} from '@nestjs/swagger';

import {
    CheckRequestDto,
    CheckResponseDto,

    PayRequestDto,
    PayResponseDto,

    GetMenuRequestDto,
    GetMenuResponseDto,

    SendCheckRequestDto,
    SendCheckResponseDto,

    GetReportRequestDto,
    GetReportResponseDto,

    GetPaymentsRequestDto,
    GetPaymentsResponseDto,

    GetAccountsRequestDto,
    GetAccountsResponseDto,
} from './dto/commands';


@ApiBasicAuth()
@UseGuards(BasicAuthGuard)
@Controller('food')
export class FoodController {
    private xmlConverter = new XmlConverter();

    constructor(private readonly foodService: FoodService) { }

    @Get('check')
    @ApiOperation({ summary: 'Проверка баланса (GET - XML ответ)' })
    @ApiStandardResponses(CheckResponseDto)
    @Header('Content-Type', 'application/xml')
    @HttpCode(200)
    async checkGetXml(@Query() query: CheckRequestDto): Promise<string> {
        const response = await this.foodService.check(query);
        return this.xmlConverter.convertToXml(response);
    }

    @Post('check')
    @ApiOperation({ summary: 'Проверка баланса' })
    @ApiStandardResponses(CheckResponseDto)
    @Header('Content-Type', 'application/json')
    @HttpCode(200)
    async check(@Body() body: CheckRequestDto): Promise<CheckResponseDto> {
        return this.foodService.check(body);
    }

    @Get('pay')
    @ApiOperation({ summary: 'Pay (GET - XML response)' })
    @ApiStandardResponses(PayResponseDto)
    @Header('Content-Type', 'application/xml')
    @HttpCode(200)
    async payGetXml(@Query() query: PayRequestDto): Promise<string> {
        const response = await this.foodService.pay(query);
        return this.xmlConverter.convertToXml(response);
    }

    @Post('pay')
    @ApiOperation({ summary: 'Пополнение лицевого счета' })
    @ApiStandardResponses(PayResponseDto)
    @Header('Content-Type', 'application/json')
    @HttpCode(200)
    async pay(@Body() body: PayRequestDto): Promise<PayResponseDto> {
        return this.foodService.pay(body);
    }

    @Get('get-menu')
    @ApiOperation({ summary: 'GetMenu (GET - XML response)' })
    @ApiStandardResponses(GetMenuResponseDto)
    @Header('Content-Type', 'application/xml')
    @HttpCode(200)
    async getMenuGetXml(@Query() query: GetMenuRequestDto): Promise<string> {
        const response = await this.foodService.getMenu(query);
        return this.xmlConverter.convertToXml(response);
    }

    @Post('get-menu')
    @ApiOperation({ summary: 'Запрос списка меню для КШП по буфету' })
    @ApiStandardResponses(GetMenuResponseDto)
    @Header('Content-Type', 'application/json')
    @HttpCode(200)
    async getMenu(@Body() body: GetMenuRequestDto): Promise<GetMenuResponseDto> {
        return this.foodService.getMenu(body);
    }

    @Get('send-check')
    @ApiOperation({ summary: 'SendCheck (GET - XML response)' })
    @ApiStandardResponses(SendCheckResponseDto)
    @Header('Content-Type', 'application/xml')
    @HttpCode(200)
    async sendCheckGetXml(@Query() query: SendCheckRequestDto): Promise<string> {
        const response = await this.foodService.sendCheck(query);
        return this.xmlConverter.convertToXml(response);
    }

    @Post('send-check')
    @ApiOperation({ summary: 'Запрос на передачу состава чека питания по буфету с использованием кода продукта' })
    @ApiStandardResponses(SendCheckResponseDto)
    @Header('Content-Type', 'application/json')
    @HttpCode(200)
    async sendCheck(@Body() body: SendCheckRequestDto): Promise<SendCheckResponseDto> {
        return this.foodService.sendCheck(body);
    }

    @Get('get-report')
    @ApiOperation({ summary: 'GetReport (GET - XML response)' })
    @ApiStandardResponses(GetReportResponseDto)
    @Header('Content-Type', 'application/xml')
    @HttpCode(200)
    async getReportkGetXml(@Query() query: GetReportRequestDto): Promise<string> {
        const response = await this.foodService.getReport(query);
        return this.xmlConverter.convertToXml(response);
    }

    @Post('get-report')
    @ApiOperation({ summary: 'Запрос количества питающихся для КШП по датам и категориям питания' })
    @ApiStandardResponses(GetReportResponseDto)
    @Header('Content-Type', 'application/json')
    @HttpCode(200)
    async getReport(@Body() body: GetReportRequestDto): Promise<GetReportResponseDto> {
        return this.foodService.getReport(body);
    }

    @Get('get-payments')
    @ApiOperation({ summary: 'GetReport (GET - XML response)' })
    @ApiStandardResponses(GetPaymentsResponseDto)
    @Header('Content-Type', 'application/xml')
    @HttpCode(200)
    async getPaymentskGetXml(@Query() query: GetPaymentsRequestDto): Promise<string> {
        const response = await this.foodService.getPayments(query);
        return this.xmlConverter.convertToXml(response);
    }

    @Post('get-payments')
    @ApiOperation({ summary: 'Получение списка пополнений баланса лицевых счетов за период' })
    @ApiStandardResponses(GetPaymentsResponseDto)
    @Header('Content-Type', 'application/json')
    @HttpCode(200)
    async getPayments(@Body() body: GetPaymentsRequestDto): Promise<GetPaymentsResponseDto> {
        return this.foodService.getPayments(body);
    }

    @Get('get-accounts')
    @ApiOperation({ summary: 'GetAccounts (GET - XML response)' })
    @ApiStandardResponses(GetAccountsResponseDto)
    @Header('Content-Type', 'application/xml')
    @HttpCode(200)
    async getAccountskGetXml(@Query() query: GetAccountsRequestDto): Promise<string> {
        const response = await this.foodService.getAccounts(query);
        return this.xmlConverter.convertToXml(response);
    }

    @Post('get-accounts')
    @ApiOperation({ summary: 'Получение списка лицевых счетов по конкретной школе' })
    @ApiStandardResponses(GetAccountsResponseDto)
    @Header('Content-Type', 'application/json')
    @HttpCode(200)
    async getAccounts(@Body() body: GetAccountsRequestDto): Promise<GetAccountsResponseDto> {
        return this.foodService.getAccounts(body);
    }
}