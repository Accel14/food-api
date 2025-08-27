import { Body, Controller, Post } from '@nestjs/common';
import { CheckRequestDTO, CheckResponseDTO } from './dto/commands/check-dto';
import { PayRequestDTO, PayResponseDTO } from './dto/commands/pay-dto';
import { GetAccountsRequestDTO, GetAccountsResponseDTO } from './dto/commands/get-accounts-dto';
import { FoodService } from './food.service';
import { GetMenuRequestDTO, GetMenuResponseDTO } from './dto/commands/get-menu-dto';
import { SendCheckRequestDTO, SendCheckResponseDTO } from './dto/commands/send-check.dto';
import { GetReportRequestDTO, GetReportResponseDTO } from './dto/commands/get-report.dto';

@Controller('food')
export class FoodController {
    constructor(private readonly foodService: FoodService) { }

    @Post('check')
    async check(@Body() body: CheckRequestDTO): Promise<CheckResponseDTO> {
        return this.foodService.check(body);
    }

    @Post('pay')
    async pay(@Body() body: PayRequestDTO): Promise<PayResponseDTO> {
        return this.foodService.pay(body);
    }

    @Post('get-accounts')
    async getAccounts(@Body() body: GetAccountsRequestDTO): Promise<GetAccountsResponseDTO> {
        return this.foodService.getAccounts(body);
    }

    @Post('get-menu')
    async getMenu(@Body() body: GetMenuRequestDTO): Promise<GetMenuResponseDTO> {
        return this.foodService.getMenu(body);
    }

    @Post('send-check')
    async sendCheck(@Body() body: SendCheckRequestDTO): Promise<SendCheckResponseDTO> {
        return this.foodService.sendCheck(body);
    }

    @Post('get-report')
    async getReport(@Body() body: GetReportRequestDTO): Promise<GetReportResponseDTO> {
        return this.foodService.getReport(body);
    }
}