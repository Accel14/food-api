import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { timingSafeEqual } from 'crypto';

@Injectable()
export class BasicAuthGuard implements CanActivate {
    constructor(private configService: ConfigService) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const authHeader = request.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Basic ')) {
            throw new UnauthorizedException();
        }

        const base64 = authHeader.split(' ')[1];

        if (!base64) {
            throw new UnauthorizedException();
        }

        const decoded = Buffer.from(base64, 'base64').toString('utf-8');
        const [user, pass] = decoded.split(':');

        if (!user || !pass) {
            throw new UnauthorizedException();
        }

        const expectedUser = this.configService.get<string>('USER');
        const expectedPass = this.configService.get<string>('PASS');

        if (user !== expectedUser || pass !== expectedPass) {
            throw new UnauthorizedException();
        }

        return true;
    }
}