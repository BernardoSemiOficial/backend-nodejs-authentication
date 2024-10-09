# Backend Authentication - NodeJS

O projeto tem como objetivo realizar autenticação de usuários da plataforma através de access-token e refresh-token.

Existiram as rotas públicas do projeto, acessiveis a todos os usuários e aquelas rotas privadas que depende estar com um access-token para realizar o acesso.

Quando um access-token perder sua validade é necessário realizar uma nova requisição passando o refresh-token que o backend será responsável por validar o refresh-token e gerar novas chaves de access-token e refresh-token para o usuário.

Para fins de teste prático o access-token tem acesso de somente 1 minuto, já o refresh-token tem acesso de 7 dias.

### SSO (Single Sign-On)

Foi implementado o login via SSO do Google e Github. Onde esse tipo de login utiliza as contas existentes nessas plataformas para realizar login nesta aplicação. O provedor (provider) fornece os dados do usuário, caso o login seja bem sucessedido pelo usuário.

#### Github

O provedor do Github precisa que um aplicativo do tipo OAuth seja criado em uma conta [Github OAuth](https://github.com/settings/applications/new). Para criar o aplicativo, precisa de informações de qual url de retorno da sua aplicação, quando o usuário loga no github, e precisar retornar para esta aplicação. Ao finalizar a criação do aplcativo OAuth será gerar as chaves públicas e privadas para consultar as APIs do Github. No retorno é fornecido parâmetro na url (code=DADDAD) que será necessário para ser enviado para o backend e ele realizar a consulta de informações no nome daquele usuário, além disso, essa consulta no backend pode ser gerado um access_token e refresh_token para o usuário que realizou o login. O papel do front-end é criar um url para o usuário ao clicar para logar via Github, no qual, será dito quais os escopos quer acesso, a url de retorno depois do login e o chave pública do aplicativo OAuth criado [Criação da URL](https://docs.github.com/pt/apps/oauth-apps/building-oauth-apps/authorizing-oauth-apps#1-request-a-users-github-identity).

O Github tem disponível uma SDK para interagir com as APIs deles. Mas nesse exemplo, foi utilizado os endpoints brutos dos serviços deles.

#### Google

O provedor do Google precisa, por sua vez, de uma aplicativo no [Google Console](https://console.cloud.google.com/welcome/new) que exista ou seja criado do zero, depois da configuração da [Tela de Permissão OAuth](https://console.cloud.google.com/apis/credentials/consent?project=advance-replica-437321-v5) que terá como configuração informações: o escopos do usuário, email para contato e logo do aplicativo. Essa tela que o usuário verá quando realizar o login.

Além disso, é necessário criar uma credencial para aplicativo **IDs do Cliente OAuth 2.0** e do tipo **Aplicativo Web**. Na tela de criação, é necessário passar as origens JavaScript autorizadas para o seu aplicativos fazerem os redirecionamentos para o usuário realizar o login, além disso, é preciso adicionar as urls de redirecionamentos autorizados que são as url permitidas para serem redirecionadas pelo google. Depois da criação da credencial, vão ser fornecidas as credencias para serem salvas no projeto.

A biblioteca (SDK) utilizada para interagir com as APIs do Google é a [GoogleApis](https://www.npmjs.com/package/googleapis#oauth2-client)

### Front-end

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

2. Crie um arquivo `.env` na raiz do projeto e defina as variáveis de ambiente necessárias. Tem um arquivo `.env.exemple` que servirá de exemplo para criar a variável utilizada para ser a chave, ela pode ser qualquer texto de sua escolha.

3. Execute o comando `npm run dev` para iniciar o servidor.

4. O projeto será executado na porta 3000.

5. Acesse as rotas do projeto através do navegador ou de uma ferramenta como o Postman.

6. Para encerrar o servidor, pressione `Ctrl + C` no terminal.
