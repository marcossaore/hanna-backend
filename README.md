## Descrição

[Hanna]() é uma aplicação que nasce da vontade de facilitar a vida de donos de casa de ração e pet shop, com intuito de ser um gerenciador de produtos e agendamentos de banho e também contribuir na tomada de decisão.

## Instalação

```bash
$ npm install
```

## Rode o docker compose

```bash
$ docker-compose up -d
```

## Rode o script

```bash
$ npm run load-bucket
```

## Rodando o app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# build
$ npm run build

# production mode
$ npm run start:prod
```

## Sobre o ambiente de desenvolvimento

O ambiente de desenvolvimento usa o docker-compose para gerenciar o app e os serviços de apoio sendo eles: `mysql`, `redis`, `mailhog`, `localstack`

**Localstack:** O serviço utilizado no Localstack é apenas o `s3` da aws.
***s3:*** Todos os arquivos serão perdidos ao encerrar o container com `docker-compose down` ou a desligar a máquina.

## Test
```bash
# running all tests
$ npm run test

# running unit tests
$ npm run test:unit
$ npm run test:unit:watch
$ npm run test:unit:debug

# e2e tests
$ npm run test:e2e
$ npm run test:e2e:watch
$ npm run test:e2e:debug

# staged (roda para os arquivos que estão na fileira para serem comitados)
$ npm run test:staged

# run as continuous integration
$ npm run test:ci

# run as continuous integration inside docker
$ npm run test:ci:docker
```

## Utilitários
Rodar migrations e seeders para todas as empresas

```bash
npx nestjs-command tenanties:migraseed
```