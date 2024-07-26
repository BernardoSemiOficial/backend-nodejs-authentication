# Backend Authentication - NodeJS

O projeto tem como objetivo realizar autenticação de usuários da plataforma através de access-token e refresh-token.

Existiram as rotas públicas do projeto, acessiveis a todos os usuários e aquelas rotas privadas que depende estar com um access-token para realizar o acesso.

Quando um access-token perder sua validade é necessário realizar uma nova requisição passando o refresh-token que o backend será responsável por validar o refresh-token e gerar novas chaves de access-token e refresh-token para o usuário.

Para fins de teste prático o access-token tem acesso de somente 1 minuto, já o refresh-token tem acesso de 7 dias.

Esse Backend em NodeJS, funciona atualmente com um [Frontend em Angular](https://github.com/BernardoSemiOficial/frontend-authentication). No reposítorio do projeto frontend tem mais informações de como executar o projeto.

# Rotas do projeto

## Rotas de autenticação

Aqui estão as rotas disponíveis para autenticação no projeto:

### Authentication

Endpoint: `/api/auth/login`

Método: `POST`

Parâmetros de entrada:

- `email` (string): O email do usuário.
- `password` (string): A senha do usuário.

Resposta de sucesso:

- Código de status: 200
- Corpo da resposta:
  ```json
  {
    "accessToken": "TOKEN_DE_ACESSO",
    "refreshToken": "TOKEN_DE_ATUALIZAÇÃO"
  }
  ```

Resposta de erro:

- Código de status: 400
- Corpo da resposta:

  ```json
  {
    "message": "Email and password are required"
  }
  ```

- Código de status: 401
- Corpo da resposta:
  ```json
  {
    "message": "Email or password are wrong"
  }
  ```

### Registro

Endpoint: `/api/auth/register`

Método: `POST`

Parâmetros de entrada:

- `email` (string): O email do usuário.
- `name` (string): O nome do usuário.
- `password` (string): A senha do usuário.

Resposta de sucesso:

- Código de status: 201
- Corpo da resposta:
  ```json
  {
    "id": "ID_DO_USUÁRIO",
    "email": "EMAIL_DO_USUÁRIO",
    "name": "NOME_DO_USUÁRIO",
    "password": "SENHA_DO_USUÁRIO"
  }
  ```

### Atualização do Token

Endpoint: `/api/auth/refresh-token`

Método: `POST`

Parâmetros de entrada:

- `refreshToken` (string): O token de atualização.

Resposta de sucesso:

- Código de status: 201
- Corpo da resposta:
  ```json
  {
    "accessToken": "NOVO_TOKEN_DE_ACESSO"
  }
  ```

Resposta de erro:

- Código de status: 404
- Corpo da resposta:
  ```json
  {
    "message": "Cannot generate a new token"
  }
  ```

## Rotas de usuários

Aqui estão as rotas disponíveis para manipulação de usuários no projeto:

### Listar usuários

Endpoint: `/api/users`

Método: `GET`

Parâmetros de entrada: Nenhum.

Resposta de sucesso:

- Código de status: 200
- Corpo da resposta:
  ```json
  [
    {
      "id": "ID_DO_USUÁRIO",
      "email": "EMAIL_DO_USUÁRIO",
      "name": "NOME_DO_USUÁRIO"
    },
    ...
  ]
  ```

Resposta de erro:

- Código de status: 401
- Corpo da resposta:
  ```json
  {
    "message": "Unauthorized"
  }
  ```

# Executando o projeto

1. Instale as dependências do projeto executando o comando `npm install`.

2. Crie um arquivo `.env` na raiz do projeto e defina as variáveis de ambiente necessárias.

3. Execute o comando `npm run dev` para iniciar o servidor.

4. O projeto será executado na porta 3000.

5. Acesse as rotas do projeto através do navegador ou de uma ferramenta como o Postman.

6. Para encerrar o servidor, pressione `Ctrl + C` no terminal.
