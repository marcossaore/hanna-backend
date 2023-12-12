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

## Rode os scripts
Sobre o script `load-secrets`, leia antes sobre [neste tópico](#sobre-o-ambiente-de-desenvolvimento).

```bash
$ npm run load-bucket
$ npm run load-secret
```

```bash
$ docker-compose up -d
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

**Localstack:** Os serviços utilizados no Localstack são o `secrets` e `s3` da aws. 
***secrets:*** Quando acionada a rota [Criação de empresa](http://localhost:3000/api/app/tenanties) é criado um banco de dados para a nova empresa e também um usuário para gerenciar esta nova base de dados no mysql, as credenciais são armazenadas neste serviço `(secrets)`. Porém quando o serviço é encerrado (docker-compose stop ou docker-compose down ou ao desligar o computador) estas credencias são perdidas. </br>
o serviço `db` tem o volume mapeado com as bases de dados das empresas criadas ao acionar a rota, mas para acessá-las é necessário saber o usuário e senha de acesso do banco de dados gerado no momento de execução do endpoint. 
Para não perder os dados, antes de criar a empresa, faça os passos descritos abaixo:
***s3:*** O mesmo ocorre para este serviços, todos os arquivos serão perdidos mas não há script para carregar arquivos.

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