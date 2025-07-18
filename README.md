# NestJS + MongoDB + BullMQ – Prova de Conceito

Este é um projeto de **estudo e familiarização com o NestJS**, utilizando MongoDB e BullMQ.

O objetivo é estudar, testar e aprender sobre NestJS e BullMQ

---

## 🚀 Tecnologias Utilizadas

- [NestJS](https://nestjs.com/) – Framework backend com arquitetura modular
- [MongoDB](https://www.mongodb.com/) – Banco de dados NoSQL
- [Mongoose](https://mongoosejs.com/) – ODM para integração com MongoDB
- [BullMQ](https://docs.bullmq.io/) – Gerenciador de filas com Redis
- [Redis](https://redis.io/) – Armazenamento em memória para filas
- [Docker](https://www.docker.com/) – Containerização da aplicação
- [TypeScript](https://www.typescriptlang.org/) – Superset do JavaScript
- [Jest](https://jestjs.io/) – Framework de testes
- [dotenv](https://github.com/motdotla/dotenv) – Carregamento de variáveis de ambiente

---

## 📦 O que já foi implementado para os estudos

- Estrutura modular
- CRUD completo para usuários
- DTOs com validações (nome, e-mail, senha forte)
- Integração com MongoDB
- Projeto containerizado com Docker (`backend` + `mongodb`)
- Integração com **BullMQ** e **Redis**
- Job usando BullMQ e Redis, simulando envio de email de boas vindas após cadastro de usuário
- Hash de senhas / segurança no geral
- autenticação com **JWT**
- Tratamento global de erros com `ExceptionFilter`
- Aplicação prática de Pipes, Interceptors, Guards e Middlewares

---

## 📌 O que ainda será estudado

- Testes automatizados (unitários e e2e)
- Refatoração para estrutura por domínio/contexto

## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://kamilmysliwiec.com)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](LICENSE).
