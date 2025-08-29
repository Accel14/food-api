import { applyDecorators, Type } from '@nestjs/common';
import { ApiOkResponse, ApiBadRequestResponse, ApiUnauthorizedResponse } from '@nestjs/swagger';

export function ApiStandardResponses(type?: Type<any>) {
    return applyDecorators(
        ApiOkResponse({ description: 'Успешный ответ', type }),
        ApiBadRequestResponse({ description: 'Неверные параметры запроса' }),
        ApiUnauthorizedResponse({ description: 'Ошибка авторизации' }),
    );
}