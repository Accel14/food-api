import { Logger, Module } from '@nestjs/common';
import { FoodController } from './food.controller';
import { FoodService } from './food.service';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { ConfigService } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerGuard } from '@nestjs/throttler';

@Module({
    imports: [
        ConfigModule,
        HttpModule.registerAsync({
            imports: [ConfigModule],
            useFactory: (configService: ConfigService) => ({
                auth: {
                    username: configService.get<string>('USER') ?? '',
                    password: configService.get<string>('PASS') ?? '',
                },
            }),
            inject: [ConfigService],
        }),
    ],
    controllers: [FoodController],
    providers: [FoodService, Logger, {
        provide: APP_GUARD,
        useClass: ThrottlerGuard
    }],
    exports: [FoodService],
})
export class FoodModule { }
