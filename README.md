# Assignment Project

## Description

This project is based on [Nest](https://github.com/nestjs/nest) framework TypeScript repository. (Required Node version 14.18.1)

## Installation

```bash
$ npm install
```

## Before Running the app

```bash
$ docker-compose up -d
$ npm run build
```

## Create New Database Migration

```
npm run build
npm run typeorm migration:run
```

### Connection:

- Host name/address: postgres
- port: 5432
- maintenance database: assessments-db
- username: postgres
- password: postgres

## Running the app

```bash
# development
$ npm run start

# watch mode (preferred)
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test
```

ApiKey: aGVsbG8gd29ybGQ= (only for this assignment, in fact, it will be secured)\
Swagger Docs: [swagger documentation](http://localhost:8000/api)
