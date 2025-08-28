import { Test, TestingModule } from '@nestjs/testing';
import { FoodController } from './food.controller';
import { FoodService } from './food.service';
import { CheckRequestDto, CheckResponseDto } from './dto/commands/check-dto';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { GetAccountsRequestDto, GetAccountsResponseDto } from './dto/commands/get-accounts-dto';
import { GetMenuRequestDto, GetMenuResponseDto } from './dto/commands/get-menu-dto';
import { ValidationPipe } from '@nestjs/common';
import { PayRequestDto, PayResponseDto } from './dto/commands/pay-dto';
import { SendCheckRequestDto, SendCheckResponseDto } from './dto/commands/send-check.dto';
import { GetReportRequestDto, GetReportResponseDto } from './dto/commands/get-report.dto';

describe('FoodController', () => {
  let controller: FoodController;
  let service: FoodService;
  let validationPipe: ValidationPipe;

  beforeEach(async () => {
    const mockFoodService = {
      check: jest.fn(),
      pay: jest.fn(),
      getAccounts: jest.fn(),
      getMenu: jest.fn(),
      sendCheck: jest.fn(),
      getReport: jest.fn(),
    };

    const mockConfigService = {
      get: jest.fn().mockReturnValue('mock-api-url'),
    };
    const mockHttpService = {};

    const module: TestingModule = await Test.createTestingModule({
      controllers: [FoodController],
      providers: [
        {
          provide: FoodService,
          useValue: mockFoodService,
        },
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
        {
          provide: HttpService,
          useValue: mockHttpService,
        }
      ],
    }).compile();

    controller = module.get<FoodController>(FoodController);
    service = module.get<FoodService>(FoodService);
    validationPipe = new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    });
  });

  describe('check', () => {
    it('should call the foodService.check method with the correct Dto and return a response', async () => {

      const mockRequestDto: CheckRequestDto = {
        command: 'check',
        account: '123',
        account_type: 'ls',
        agent: 'test',
        service_type: 'buffet'
      };

      const mockResponseDto: CheckResponseDto = {
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

      (service.check as jest.Mock).mockResolvedValue(mockResponseDto);

      const result = await controller.check(mockRequestDto);

      expect(service.check).toHaveBeenCalledWith(mockRequestDto);
      expect(result).toEqual(mockResponseDto);
    });
  });

  describe('pay', () => {
    it('should call the foodService.pay method with the correct Dto and return a response', async () => {
      const mockRequestDto: PayRequestDto = {
        command: 'pay',
        txn_id: 123456,
        account: '000000000789123',
        account_type: 'ls',
        sum: 985.37,
        agent: 'superagent',
        txn_date: 20180502120235,
        service_type: 'buffet',
      };

      const mockResponseDto: PayResponseDto = {
        result: 0,
        txn_id: 123456,
        comment: 'Успешное завершение операции',
        fio: 'Иван Иванович И.',
        adress: 'г. Уфа, улица Пушкина, 5',
        balance: 985.37,
        sum: 985.37,
        info: 'Пополнение лицевого счета [Буфет]',
        provider_id: 'at-29',
        provider_name: 'ООО Общепит',
        provider_bik: '044525787',
        provider_kbk: '18210703000011000110',
        provider_rs: '40702810200820002006',
        provider_inn: '0274124752',
        provider_oktmo: '1231687810',
        school_id: 'k12',
        school_name: 'МОБУ Средняя школа номер 5',
        klass: '5Б',
        ext_id: 'arf-12347-fd',
        reg_date: '20180502120235',
      };

      (service.pay as jest.Mock).mockResolvedValue(mockResponseDto);

      const result = await controller.pay(mockRequestDto);

      expect(service.pay).toHaveBeenCalledWith(mockRequestDto);
      expect(result).toEqual(mockResponseDto);
    });
  });

  describe('get-accounts', () => {
    it('should call the foodService.getAccounts method', async () => {

      const mockRequestDto: GetAccountsRequestDto = {
        command: 'get_accounts',
        account: '2',
        account_type: 'provider',
        agent: 'superagent',
        school_id: '0'
      };

      const mockResponseDto: GetAccountsResponseDto = {
        result: 0,
        comment: 'comment',
        accounts: [{
          external: '0',
          buffet: '0',
          diningroom: '0',
          fio: 'Тестов Тест Тестович',
          klass: "1А",
          chip_number: '0'
        }]
      };

      (service.getAccounts as jest.Mock).mockResolvedValue(mockResponseDto);

      const result = await controller.getAccounts(mockRequestDto);

      expect(service.getAccounts).toHaveBeenCalledWith(mockRequestDto);
      expect(result).toEqual(mockResponseDto);
    })
  });

  describe('get-menu', () => {
    it('should call the foodService.getMenu method for buffet', async () => {

      const mockRequestDto: GetMenuRequestDto = {
        command: 'get_menu',
        txn_id: 0,
        account: '025',
        account_type: 'provide',
        sum: undefined,
        agent: 'superagent',
        txn_date: 0,
        service_type: 'buffet'
      };

      const mockResponseDto: GetMenuResponseDto = {
        result: 0,
        comment: 'comment',
        products: [
          {
            product_id: '12gf3',
            name: 'Пирожки с вишней 75',
            provider_id: '025',
            price: 15.0,
            product_barcode: '2000992569248',
            school_id: 'r564',
            school_name: 'МАОУ СОШ № 33',
            unit_name: 'шт',
            service_type: 'buffet'
          },
          {
            product_id: '1g41f3',
            name: 'Батончик Курьез 26гр',
            provider_id: '025',
            price: 15.0,
            product_barcode: null,
            school_id: 'r564',
            school_name: 'МАОУ СОШ № 33',
            unit_name: 'шт',
            service_type: 'buffet'
          }
        ]
      };

      (service.getMenu as jest.Mock).mockResolvedValue(mockResponseDto);

      const result = await controller.getMenu(mockRequestDto);

      expect(service.getMenu).toHaveBeenCalledWith(mockRequestDto);
      expect(result).toEqual(mockResponseDto);
    });

    it('should call the foodService.getMenu method for diningroom', async () => {
      const mockRequestDto: GetMenuRequestDto = {
        command: 'get_menu',
        txn_id: 0,
        account: '025',
        account_type: 'provide',
        sum: 0.0,
        agent: 'superagent',
        txn_date: 0,
        service_type: 'diningroom'
      };

      const mockResponseDto: GetMenuResponseDto = {
        result: 0,
        comment: 'comment',
        menu: [
          {
            menu_id: 'd198',
            name: 'Льготный обед',
            provider_id: '025',
            price: 50.0,
            holiday_price: 40.0,
            school_id: 'r564',
            school_name: 'МАОУ СОШ № 33',
            subsidy: 50.0,
            subsidy_title: 'Республиканская дотация',
            service_type: 'diningroom'
          },
          {
            menu_id: '12gf3',
            name: 'Полдник',
            provider_id: '025',
            price: 25.0,
            holiday_price: 10.0,
            school_id: 'r564',
            school_name: 'МАОУ СОШ № 33',
            subsidy: 0.0,
            subsidy_title: null,
            service_type: 'diningroom'
          }
        ]
      };

      (service.getMenu as jest.Mock).mockResolvedValue(mockResponseDto);

      const result = await controller.getMenu(mockRequestDto);

      expect(service.getMenu).toHaveBeenCalledWith(mockRequestDto);
      expect(result).toEqual(mockResponseDto);
    });
  });

  describe('send-check', () => {
    it('should call the foodService.sendCheck method with diningroom and return a response', async () => {
      const mockRequestDto: SendCheckRequestDto = {
        command: 'send_check',
        txn_id: 0,
        account: '000000000789123',
        account_type: 'ls',
        sum: 985.37,
        agent: 'superagent',
        txn_date: 20200304125149,
        service_type: 'diningroom',
        subsidy: 0.00,
        menu_id: '01f23',
      };

      const mockResponseDto: SendCheckResponseDto = {
        result: 0,
        comment: 'Успешное завершение операции',
      };

      (service.sendCheck as jest.Mock).mockResolvedValue(mockResponseDto);

      const result = await controller.sendCheck(mockRequestDto);

      expect(service.sendCheck).toHaveBeenCalledWith(mockRequestDto);
      expect(result).toEqual(mockResponseDto);
    });
  });

  describe('get-report', () => {
    it('should call the foodService.getReport method with diningroom and return a response', async () => {
      const mockRequestDto: GetReportRequestDto = {
        command: 'get_report',
        account: '025',
        account_type: 'provider',
        agent: 'superagent',
        service_type: 'diningroom',
        begin_date: 20200324,
        end_date: 20200325,
      };

      const mockResponseDto: GetReportResponseDto = {
        result: 0,
        comment: 'Успешное завершение операции',
        report: [
          {
            menu_id: 'd198',
            number: 150,
            date: 20200324,
            accounts: [
              {
                account: '102471',
              },
            ],
          },
        ],
      };

      (service.getReport as jest.Mock).mockResolvedValue(mockResponseDto);

      const result = await controller.getReport(mockRequestDto);

      expect(service.getReport).toHaveBeenCalledWith(mockRequestDto);
      expect(result).toEqual(mockResponseDto);
    })
  });
});