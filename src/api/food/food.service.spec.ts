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
    }

    const module: TestingModule = await Test.createTestingModule({
      providers: [FoodService,
        {
          provide: HttpService,
          useValue: mockHttpService,
        },
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
        {
          provide: Logger,
          useValue: mockLogger,
        }
      ],
    }).compile();

    service = module.get<FoodService>(FoodService);
    httpService = module.get<HttpService>(HttpService);
    (service as any).logger = {
      error: jest.fn(),
      log: jest.fn(),
      warn: jest.fn(),
      debug: jest.fn(),
    };
    configService = module.get<ConfigService>(ConfigService);
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
    it('should get datetime if txn_date is not passed correctly', async () => {
      const mockRequest: Omit<SendCheckRequestDto, 'txn_date'> = {
        command: 'send_check',
        account: '000000000789123',
        account_type: 'ls',
        sum: 985.37,
        agent: 'superagent',
        service_type: 'buffet',
      };

      const mockResponse: SendCheckResponseDto = {
        result: 0,
        comment: 'Успешное завершение операции',
      };

      (httpService.post as jest.Mock).mockReturnValue(of({ data: mockResponse, status: 200 }));

      await service.sendCheck(mockRequest as SendCheckRequestDto);

      const sentPayload = (httpService.post as jest.Mock).mock.calls[0][1];
      expect(sentPayload).toHaveProperty('txn_date');
      expect(typeof sentPayload.txn_date).toBe('number');
    })
  })

  describe('get-menu', () => {
    it('should throw an error for an invalid account_type', async () => {
      const invalidRequestDto: GetMenuRequestDto = {
        command: 'get_menu',
        txn_id: 0,
        account: '025',
        account_type: 'invalid_type',
        sum: 0.0,
        agent: 'superagent',
        txn_date: 0,
        service_type: 'diningroom'
      };

      await expect(validationPipe.transform(invalidRequestDto, {
        type: 'body',
        metatype: GetMenuRequestDto,
      })).rejects.toThrow();

      expect(httpService.post).not.toHaveBeenCalled();
    });
  })

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
        headers: {
          'Content-Type': 'application/json',
        } as AxiosRequestHeaders,
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

      (httpService.post as jest.Mock).mockReturnValue(
        throwError(() => mockError)
      );

      const logger = (service as any).logger;

      await expect(service.check(mockPayload)).rejects.toThrow(InternalServerErrorException);

      expect(logger.error).toHaveBeenCalledWith(
        expect.stringContaining('HTTP Request Failed'),
        expect.stringContaining('Server error message'),
      );
    })
  })
});
