import { Injectable, InternalServerErrorException, BadRequestException, Logger, UnauthorizedException, ForbiddenException, NotFoundException, ConflictException, HttpException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { AxiosError, HttpStatusCode } from 'axios';
import { catchError, firstValueFrom } from 'rxjs';
import { parse, isValid, format } from 'date-fns';

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

@Injectable()
export class FoodService {
    private readonly apiUrl: string;

    constructor(
        private readonly configService: ConfigService,
        private readonly httpService: HttpService,
        private readonly logger: Logger,
    ) {
        const apiUrl = this.configService.get<string>('API_URL');
        if (!apiUrl) {
            throw new Error('API_URL is not defined');
        }
        this.apiUrl = apiUrl;
    }

    async check(request: CheckRequestDto): Promise<CheckResponseDto> {
        return this.postRequest<CheckResponseDto>(request);
    }

    async pay(request: PayRequestDto): Promise<PayResponseDto> {
        return this.postRequest<PayResponseDto>(this.withTxnDate(request));
    }

    async getMenu(request: GetMenuRequestDto): Promise<GetMenuResponseDto> {
        return this.postRequest<GetMenuResponseDto>(request);
    }

    async sendCheck(request: SendCheckRequestDto): Promise<SendCheckResponseDto> {
        const hasProductId = request.products?.some(p => p.product_id);
        const hasProductCode = request.products?.some(p => p.product_code);

        // Если есть product_id - требуется синхронизация
        if (hasProductId && request.service_type === 'buffet') {
            const menu = await this.getMenu({
                command: 'get_menu',
                account: request.account,
                account_type: 'provider',
                service_type: 'buffet',
                agent: request.agent
            });

            // Проверяем что все product_id существуют в меню
            const enrichedProducts = request.products?.map(product => {
                const menuProduct = menu.products?.find(p => p.product_id === product.product_id);
                if (!menuProduct) {
                    throw new BadRequestException(`Product ${product.product_id} not found`);
                }
                return {
                    product_id: product.product_id,
                    price: menuProduct.price, // Цена из меню
                    count: product.count
                };
            });

            return this.postRequest<SendCheckResponseDto>({
                ...this.withTxnDate(request),
                products: enrichedProducts
            });
        }

        if (hasProductCode) {
            return this.postRequest<SendCheckResponseDto>(this.withTxnDate(request));
        }

        throw new BadRequestException('Products must have either product_id or product_code');
    }

    async getReport(request: GetReportRequestDto): Promise<GetReportResponseDto> {
        return this.postRequest<GetReportResponseDto>(request);
    }

    async getPayments(request: GetPaymentsRequestDto): Promise<GetPaymentsResponseDto> {
        return this.postRequest<GetPaymentsResponseDto>(request);
    }

    async getAccounts(request: GetAccountsRequestDto): Promise<GetAccountsResponseDto> {
        return this.postRequest<GetAccountsResponseDto>(request);
    }

    private async postRequest<T>(payload: Record<string, any>): Promise<T> {
        try {
            const { data } = await firstValueFrom(
                this.httpService.post<T>(this.apiUrl, payload).pipe(
                    catchError((error: AxiosError) => {
                        const status = error.response?.status;
                        const responseData = error.response?.data as any;
                        const message = responseData?.message || error.message;

                        switch (status) {
                            case HttpStatusCode.BadRequest:
                                throw new BadRequestException(message);
                            case HttpStatusCode.Unauthorized:
                                throw new UnauthorizedException(message);
                            case HttpStatusCode.Forbidden:
                                throw new ForbiddenException(message);
                            case HttpStatusCode.NotFound:
                                throw new NotFoundException(message);
                            case HttpStatusCode.Conflict:
                                throw new ConflictException(message);
                            default:
                                throw new InternalServerErrorException(`HTTP Error: ${message}`);
                        }
                    }),
                ),
            );

            return data;
        } catch (error) {
            if (!(error instanceof HttpException)) {
                this.logger.error(
                    `Unexpected error sending request to ${this.apiUrl}: ${error.message}`,
                );
                throw new InternalServerErrorException('Unexpected error occurred');
            }
            throw error;
        }
    }

    private withTxnDate<T extends { txn_date?: number }>(request: T): T & { txn_date: number } {
        let txnDate = request.txn_date;

        // Если дата некорректна или отсутствует - используется текущее время
        if (txnDate === undefined || txnDate === null || !this.isValidDateNumber(txnDate)) {
            txnDate = this.getCurrentDateTimeAsNumber();
        }

        return {
            ...request,
            txn_date: txnDate,
        };
    }

    private isValidDateNumber(dateNumber: number): boolean {
        const dateStr = dateNumber.toString();
        if (dateStr.length !== 14) return false;

        try {
            const date = parse(dateStr, 'yyyyMMddHHmmss', new Date());
            return isValid(date);
        } catch {
            return false;
        }
    }

    private getCurrentDateTimeAsNumber(): number {
        return parseInt(format(new Date(), 'yyyyMMddHHmmss'), 10);
    }
}
