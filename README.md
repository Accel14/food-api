# Food API

Это враппер-недосервис для управления школьными лицевыми счетами, меню и чеками питания. Проект построен на **NestJS** (backend) и использует **Swagger** для документации API.

---

1. Установите зависимости:

```bash
npm install
```
2. Настройте .env:
```bash
API_URL=https://your-external-api.com
AGENT = "agent"
USER = "user"
PASS = "pass"
```
3. Запуск dev-сервера:
```bash
npm run start:dev
```
4. Swagger UI доступен по адресу:
```bash
http://localhost:3000/api
```
# Основные эндпоинты
1. Check – проверка баланса
* GET ```/food/check``` (XML request)
* POST ```/food/check``` (JSON request)

2. Pay – пополнение лицевого счета
* GET ```/food/pay```
* POST ```/food/pay```
* Пример запроса:
```
{
  "command": "pay",
  "txn_id": 123456,
  "account": "000000000789123",
  "account_type": "ls",
  "sum": 985.37,
  "agent": "superagent",
  "txn_date": 20230829120000,
  "service_type": "buffet"
}
```
