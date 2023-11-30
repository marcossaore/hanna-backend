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

# build
$ npm run build

# production mode
$ npm run start:prod
```

## Sobre o ambiente de desenvolvimento

O ambiente de desenvolvimento usa o docker-compose para gerenciar o app e os serviços de apoio sendo eles: `mysql`, `redis`, `mailhog`, `localstack`

**Localstack:** O único serviço utilizado no Localstack no momento é o `secrets` da aws. No caso, quando é criado a empresa na rota [Criação de empresa](http://localhost:3000/api/app/tenanties) é criado também um usuário para gerenciar este banco, portanto, estas credenciais são armazenadas neste serviço. Porém quando o serviço é encerrado estas mesmas credencias são perdidas. </br>
Para evitar este problema, antes de criar a empresa, faça:

1 - Neste [arquivo](src/processors/tenant/create-tenant.processor.ts)

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