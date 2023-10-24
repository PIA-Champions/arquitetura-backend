
# Serverless REST API

Essa aplicação foi baseada no exemplo de todo list disponibilizado pelo repositório serverless/examples

## Structure

Há alguns arquivos importantes para entender o funcionamento dessa aplicação.

Diretório survey possui todos os códigos em javascript separados por métodos.

# Before application setup

Essa aplicação ainda não possui uma versão funcional para rodar localmente, sendo necessário publicar na AWS se desejar fazer algum teste.

Pode-se utilizar a conta disponibilizada pelo professor de PIA para essa publicação.

Para isso, você precisa executar os seguintes passos:

1 - Conecte ao Canvas da AWS, e dê start no seu laboratório.
1.1 - Clique AWS Details, clique em show no AWS CLI para pegar as credenciais. Essas credenciais são temporárias e após 4 horas ela irá expirar e esse passo será preciso refazer.
Pegue também o ID da conta, pois vamos precisar em um dos passos abaixo.
1.2 - No terminal, crie a pasta ~/.aws se ela não existir; mkdir ~/.aws
1.3 - Crie dois arquivos. O ~/.aws/config e ~/.aws/credentials com o conteúdo que você copiou no passo 1.1. Porém, adicione mais uma linha:

region=us-east-1

O ~ significa que a pasta com a credencial será criada na home do seu usuário, e não dentro da sua pasta do git. Até então estamos falando de configuraçaõ do ambiente, e não a aplicação.

Instale o serverless dentro do seu ambiente

npm i serverless -g

Para testar, se o serverless funcionou, digite:

serverless --version

## Setup

Entre dentro da pasta serverless/survey-aws

cd serverless/survey-aws



```bash
npm install
```

## Deploy

Para publicar, digite o comando

```bash
serverless deploy --stage prd --param="account=XXXXXXXXXXXX"
```

Você deve receber uma saída parecida com isso

```bash
Serverless: Packaging service…
Serverless: Uploading CloudFormation file to S3…
Serverless: Uploading service .zip file to S3…
Serverless: Updating Stack…
Serverless: Checking Stack update progress…
Serverless: Stack update finished…

Service Information
service: serverless-rest-api-with-dynamodb
stage: prd
region: us-east-1
api keys:
  None
endpoints:
  POST - https://45wf34z5yf.execute-api.us-east-1.amazonaws.com/prd/survey
  GET - https://45wf34z5yf.execute-api.us-east-1.amazonaws.com/prd/survey
  GET - https://45wf34z5yf.execute-api.us-east-1.amazonaws.com/prd/survey/{id}
  PUT - https://45wf34z5yf.execute-api.us-east-1.amazonaws.com/prd/survey/{id}
  DELETE - https://45wf34z5yf.execute-api.us-east-1.amazonaws.com/prd/survey/{id}
functions:
  serverless-rest-api-with-dynamodb-dev-update: arn:aws:lambda:us-east-1:488110005556:function:serverless-rest-api-with-dynamodb-dev-update
  serverless-rest-api-with-dynamodb-dev-get: arn:aws:lambda:us-east-1:488110005556:function:serverless-rest-api-with-dynamodb-dev-get
  serverless-rest-api-with-dynamodb-dev-list: arn:aws:lambda:us-east-1:488110005556:function:serverless-rest-api-with-dynamodb-dev-list
  serverless-rest-api-with-dynamodb-dev-create: arn:aws:lambda:us-east-1:488110005556:function:serverless-rest-api-with-dynamodb-dev-create
  serverless-rest-api-with-dynamodb-dev-delete: arn:aws:lambda:us-east-1:488110005556:function:serverless-rest-api-with-dynamodb-dev-delete
```

## Usage

Isso permite você votar, criar votação, deletar votação, listar todas a votações e uma em especifico


Foi postado dentro da raiz do diretório o json para importar no postman os métodos de forma correta.

