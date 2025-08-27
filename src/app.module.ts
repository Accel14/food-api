import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config'
import { FoodModule } from './api/food/food.module';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    HttpModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        headers: {
          'Content-Type': 'application/json',
        },
        auth: {
          username: configService.get<string>('USER') ?? '',
          password: configService.get<string>('PASS') ?? '',
        },
      }),
      inject: [ConfigService],
    }),
    FoodModule],

  exports: [],
})
export class AppModule { }
