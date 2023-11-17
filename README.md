## Status

<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://coveralls.io/github/nestjs/nest?branch=master" target="_blank"><img src="https://coveralls.io/repos/github/nestjs/nest/badge.svg?branch=master#9" alt="Coverage" /></a>

## Descrição

[Hanna]() é uma aplicação que nasce da vontade de facilitar a vida de donos de casa de ração e pet shop, com intuito de ser um gerenciador de produtos e agendamentos de banho e também contribuir na tomada de decisão.

## Instalação

```bash
$ npm install
```

## Rodando o app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Sobre o ambiente de desenvolvimento

O ambiente de desenvolvimento usa o docker-compose para gerenciar o app e os serviços de apoio sendo eles: `mysql`, `redis`, `mailhog`, `localstack`

**Localstack:** O único serviço utilizado no Localstack no momento é o `secrets` da aws. No caso, quando é criado a empresa na rota [Criação de empresa](http://localhost:3000/api/app/companies) é criado também um usuário para gerenciar este banco, portanto, estas credenciais são armazenadas neste serviço. Porém quando o serviço é encerrado estas mesmas credencias são perdidas. </br>
Para evitar este problema, antes de criar a empresa, faça:

1 - Neste [arquivo](src/_jobs/consumers/create-company.processor.ts)

1.2 - Depois do código:
```
    this.generateDbCredentialsService.generate...
```

1.3 - Cole a linha abaixo.
```
    console.log(
        `docker compose exec -it localstack aws --endpoint-url=http://localhost:4566 secretsmanager create-secret --name ${company.companyIdentifier} --secret-string 
        '{"dbUser": "${credentials.dbUser}", "dbPass": "${credentials.dbPass}"}'`
    );
```

1.4 - Execute o comando para criar a empresa. ***(O projeto deve estar rodando)***

1.5 - Copie o resultado impreso no console e cole neste [arquivo](scripts/load-secrets-to-companies.sh) `Se o arquivo não existir, cria-o!, o texto não pode ficar quebrado, deve ficar em uma linha completa.`

1.6 - Cole o contéudo no arquivo criado.

1.7 Ao reiniciar o projeto, execute o comando:
```
    npm run load-secrets
```

1.8 Remova a linha do console, e faça isso para qualquer empresa que adicionar!

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```