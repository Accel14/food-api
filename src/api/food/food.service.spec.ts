import { Test, TestingModule } from '@nestjs/testing';
import { FoodService } from './food.service';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { of, throwError } from 'rxjs';
import { CheckRequestDto, CheckResponseDto } from './dto/commands/check-dto';
import { GetMenuRequestDto, GetMenuResponseDto } from './dto/commands/get-menu-dto';
import { InternalServerErrorException, Logger, ValidationPipe } from '@nestjs/common';
import { PayRequestDto, PayResponseDto } from './dto/commands/pay-dto';
import { SendCheckRequestDto, SendCheckResponseDto } from './dto/commands/send-check.dto';
import { Axios, AxiosResponse, AxiosRequestConfig, InternalAxiosRequestConfig, AxiosRequestHeaders } from 'axios';
import { AxiosError } from 'axios';
import { log } from 'console';

describe('FoodService', () => {
  let service: FoodService;
  let httpService: HttpService;
  let configService: ConfigService;
  let validationPipe: ValidationPipe;
  let logger: Logger;

  beforeEach(async () => {
    const mockHttpService = {
      post: jest.fn(() => of({ data: {}, status: 200 })),
    };
    const mockConfigService = {
      get: jest.fn().mockReturnValue('https://mock-api.com'),
    };
    const mockLogger = {
      error: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [FoodService,
        { provide: HttpService, useValue: mockHttpService },
        { provide: ConfigService, useValue: mockConfigService },
        { provide: Logger, useValue: mockLogger },
      ],
    }).compile();

    service = module.get<FoodService>(FoodService);
    httpService = module.get<HttpService>(HttpService);
    configService = module.get<ConfigService>(ConfigService);
    logger = module.get<Logger>(Logger);
    validationPipe = new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    });
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('check', () => {
    it('should return a successful response on a valid request', async () => {
      const mockRequest: CheckRequestDto = {
        command: 'check',
        account: '123',
        account_type: 'ls',
        agent: 'test',
        service_type: 'buffet'
      };

      const mockResponse: CheckResponseDto = {
        result: 0,
        comment: 'OK',
        fio: 'Test User',
        adress: 'Test Address',
        balance: 100,
        info: '',
        provider_id: '',
        provider_name: '',
        provider_bik: '',
        provider_kbk: '',
        provider_rs: '',
        provider_inn: '',
        provider_oktmo: '',
        school_id: '',
        school_name: '',
        klass: '',
        reg_date: ''
      };

      (httpService.post as jest.Mock).mockReturnValue(of({ data: mockResponse, status: 200 }));

      const result = await service.check(mockRequest);

      expect(result).toEqual(mockResponse);
      expect(httpService.post).toHaveBeenCalledWith(
        'https://mock-api.com',
        mockRequest
      );
    });
  });

  describe('send-check', () => {
    it('should use current time if txn_date is undefined', async () => {
      const mockRequest: Omit<SendCheckRequestDto, 'txn_date'> = {
        command: 'send_check',
        account: '000000000789123',
        account_type: 'ls',
        sum: 985.37,
        agent: 'superagent',
        service_type: 'buffet',
        products: [
          { product_code: 'abc123', price: 100, count: 1 }
        ]
      };

      const mockPost = jest.fn().mockReturnValue(of({ data: { result: 0, comment: 'ok' } }));
      (service as any).httpService = { post: mockPost } as any;

      const currentTime = (service as any).getCurrentDateTimeAsNumber();

      const result = await service.sendCheck(mockRequest);

      expect(result).toEqual({ result: 0, comment: 'ok' });

      expect(mockPost).toHaveBeenCalledWith(
        'https://mock-api.com',
        expect.objectContaining({
          txn_date: currentTime,
        })
      );
    });


    it('should use current time when txn_date is invalid', async () => {
      const invalidDate = 20231345121212; // некорректный месяц
      const mockRequest: SendCheckRequestDto = {
        command: 'send_check',
        account: 'test123',
        account_type: 'ls',
        sum: 100,
        agent: 'test-agent',
        txn_date: invalidDate,
        service_type: 'diningroom',
        subsidy: 0,
        products: [
          { product_code: 'abc123', price: 100, count: 1 }
        ]
      };

      const mockPost = jest.fn().mockReturnValue(of({ data: { result: 0, comment: 'ok' } }));
      (service as any).httpService = { post: mockPost } as any;

      const currentTime = (service as any).getCurrentDateTimeAsNumber();

      const result = await service.sendCheck(mockRequest);

      expect(result).toEqual({ result: 0, comment: 'ok' });
      expect(mockPost).toHaveBeenCalledWith(
        'https://mock-api.com',
        expect.objectContaining({
          txn_date: currentTime,
        })
      );
    });


  })

  // describe('get-menu', () => {
  //   it('should throw an error for an invalid account_type', async () => {
  //     const invalidRequestDto: GetMenuRequestDto = {
  //       command: 'get_menu',
  //       txn_id: 0,
  //       account: '025',
  //       account_type: 'invalid_type',
  //       sum: 0.0,
  //       agent: 'superagent',
  //       txn_date: 0,
  //       service_type: 'diningroom'
  //     };

  //     await expect(validationPipe.transform(invalidRequestDto, {
  //       type: 'body',
  //       metatype: GetMenuRequestDto,
  //     })).rejects.toThrow();

  //     expect(httpService.post).not.toHaveBeenCalled();
  //   });
  // })

  describe('postRequest', () => {
    it('should throw an InternalServerErrorException on a failed request', async () => {
      const mockPayload: CheckRequestDto = {
        command: 'check',
        account: '123',
        account_type: 'ls',
        agent: 'test',
        service_type: 'buffet',
      };

      const mockRequestConfig: InternalAxiosRequestConfig = {
        headers: { 'Content-Type': 'application/json' } as AxiosRequestHeaders,
        method: 'POST',
        url: 'https://mock-api.com',
        data: mockPayload,
      };

      const mockError = new AxiosError(
        'Request failed with status code 500',
        '500',
        mockRequestConfig,
        {},
        { status: 500, statusText: 'Internal Server Error', data: 'Server error message' } as AxiosResponse
      );

      (service as any).httpService = {
        post: jest.fn().mockReturnValue(throwError(() => mockError)),
      };

      const loggerSpy = jest.spyOn(service['logger'], 'error');

      let caughtError: any;
      try {
        await service['postRequest'](mockPayload);
      } catch (error) {
        caughtError = error;
      }

      expect(caughtError).toBeInstanceOf(InternalServerErrorException);
      expect(caughtError.message).toContain('Unexpected error occurred');

      // Logger should have been called because the outer catch always logs unexpected errors
      expect(loggerSpy).toHaveBeenCalledWith(
        `Unexpected error sending request to ${service['apiUrl']}: ${mockError.message}`,
      );
    });
  });





});
