<p align="center">Eae, Dev! 👊🏾</p>
<p align="center">Seja bem vindo(a) ✨🚀</p>

<h1 align="center">pass.in</h1>
<h3 align="center">NLW Unite - Trilha Node.js - Rocketseat</h3>

<p align="center">
    <a href="#-sobre">Sobre</a>&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
    <a href="#-tecnologias">Tecnologias</a>&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
    <a href="#-materiais">Materiais</a>&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
    <a href="#-licença">Licença</a>&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
    <a href="#-acesse-o-rocketseat-one">Acesse o Rocketseat One</a>&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
    <a href="#-requisitos-funcionais">Requisitos funcionais</a>&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
    <a href="#-regras-de-negócio">Regras de negócio</a>&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
    <a href="#-requisitos-não-funcionais">Requisitos não-funcionais</a>&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
    <a href="#-diagrama-erd">Diagrama ERD</a>&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
    <a href="#-estrutura-do-banco-sql">Estrutura do banco (SQL)</a>
</p>

<h3>📌 Sobre</h3> 
O pass.in é uma aplicação de <b>gestão de participantes em eventos presenciais</b>. <br/>
A ferramenta permite que o organizador cadastre um evento e abra uma página pública de inscrição. <br/>
Os participantes inscritos podem emitir uma credencial para check-in no dia do evento. <br/>
O sistema fará um scan da credencial do participante para permitir a entrada no evento. <br/>

<h3>📌 Tecnologias</h3> 

- Node.js
- Typescript
- Fastify
- Prisma
- Zod

<h3>📌 Materiais</h3> 

Você pode acessar os materiais do projeto através [DESSE LINK](https://efficient-sloth-d85.notion.site/Node-js-a51a784e58e8482daa4c188b1659f5df)

<h3>📌 Licença</h3>

Esse projeto está sob a licença MIT.

<h3>📌 Acesse o Rocketseat One</h3>

[Rocketseat One](https://app.rocketseat.com.br/cart/rocketseat-one?referral=willian-moreno&utm_source=platform&utm_medium=organic&utm_campaign=venda&utm_term=mgm&utm_content=indication-lp_one)

<h2>Requisitos</h2>

<h3>📌 Requisitos funcionais</h3>

- [ ] O organizador deve poder cadastrar um novo evento;
- [ ] O organizador deve poder visualizar dados de um evento;
- [ ] O organizador deve poser visualizar a lista de participantes; 
- [ ] O participante deve poder se inscrever em um evento;
- [ ] O participante deve poder visualizar seu crachá de inscrição;
- [ ] O participante deve poder realizar check-in no evento;

<h3>📌 Regras de negócio</h3>

- [ ] O participante só pode se inscrever em um evento uma única vez;
- [ ] O participante só pode se inscrever em eventos com vagas disponíveis;
- [ ] O participante só pode realizar check-in em um evento uma única vez;

<h3>📌 Requisitos não-funcionais</h3>

- [ ] O check-in no evento será realizado através de um QRCode;

<h2>Documentação da API (Swagger)</h2>

Para documentação da API, acesse o link: https://nlw-unite-nodejs.onrender.com/docs

<h2>Banco de dados</h2>

Nessa aplicação vamos utilizar banco de dados relacional (SQL). Para ambiente de desenvolvimento seguiremos com o SQLite pela facilidade do ambiente.

<h3>📌 Diagrama ERD</h3>

<img src=".github/erd.svg" width="600" alt="Diagrama ERD do banco de dados" />

<h3>📌 Estrutura do banco (SQL)</h3>

```sql
-- CreateTable
CREATE TABLE "events" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "details" TEXT,
    "slug" TEXT NOT NULL,
    "maximum_attendees" INTEGER
);

-- CreateTable
CREATE TABLE "attendees" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "event_id" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "attendees_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "events" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "check_ins" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "attendeeId" INTEGER NOT NULL,
    CONSTRAINT "check_ins_attendeeId_fkey" FOREIGN KEY ("attendeeId") REFERENCES "attendees" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "events_slug_key" ON "events"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "attendees_event_id_email_key" ON "attendees"("event_id", "email");

-- CreateIndex
CREATE UNIQUE INDEX "check_ins_attendeeId_key" ON "check_ins"("attendeeId");
```