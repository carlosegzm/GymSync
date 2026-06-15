<div align="center">

# 🏋️ GymSync

**Plataforma completa de gestão de academia — do cadastro de alunos ao controle financeiro.**

[![Java](https://img.shields.io/badge/Java-17-007396?style=flat-square&logo=openjdk&logoColor=white)](https://www.oracle.com/java/)
[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-4.0.6-6DB33F?style=flat-square&logo=springboot&logoColor=white)](https://spring.io/projects/spring-boot)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-latest-4169E1?style=flat-square&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-8-646CFF?style=flat-square&logo=vite&logoColor=white)](https://vite.dev/)
[![Docker](https://img.shields.io/badge/Docker-Compose-2496ED?style=flat-square&logo=docker&logoColor=white)](https://www.docker.com/)
[![License](https://img.shields.io/badge/License-Academic-lightgrey?style=flat-square)](#licença)

</div>

---

## 📋 Índice

- [Descrição do Projeto](#-descrição-do-projeto)
- [Tecnologias Utilizadas](#-tecnologias-utilizadas)
- [Arquitetura do Sistema](#-arquitetura-do-sistema)
- [Guia de Instalação](#-guia-de-instalação)
- [Executando a API](#-executando-a-api)
- [Funcionalidades](#-funcionalidades)
- [Endpoints da API](#-endpoints-da-api)
- [Estrutura do Projeto](#-estrutura-do-projeto)
- [Melhorias Futuras](#-melhorias-futuras)
- [Contribuindo](#-contribuindo)
- [Licença](#-licença)

---

## 📖 Descrição do Projeto

O **GymSync** é um sistema web full-stack voltado para a gestão operacional de academias. A plataforma centraliza o gerenciamento de alunos, treinadores, planos de assinatura, aulas em grupo, avaliações físicas e transações financeiras em um único sistema coeso.

**Objetivos principais:**
- Simplificar o dia a dia operacional de academias de pequeno e médio porte.
- Oferecer ao treinador visibilidade sobre sua agenda e seus alunos.
- Permitir que o aluno acompanhe seu progresso e suas aulas.
- Prover ao gestor um painel financeiro e de métricas da academia.

**Contexto:** Projeto acadêmico/portfólio, desenvolvido para demonstrar a aplicação prática de uma stack moderna Java + React em um domínio de negócio real.

**Público-alvo:** Gestores de academia, treinadores pessoais e alunos.

---

## 🛠️ Tecnologias Utilizadas

### Backend
| Tecnologia | Versão | Função |
|---|---|---|
| Java | 17 | Linguagem principal |
| Spring Boot | 4.0.6 | Framework de aplicação |
| Spring Data JPA | (via Boot) | Persistência e ORM |
| Spring Validation | (via Boot) | Validação de dados de entrada |
| Spring Web MVC | (via Boot) | Camada REST |
| Hibernate | (via JPA) | Mapeamento objeto-relacional |
| Flyway | (via Boot) | Migrations de banco de dados |
| Lombok | latest | Redução de boilerplate |
| PostgreSQL | latest | Banco de dados relacional |
| Docker Compose | latest | Orquestração de containers |
| Maven | (via wrapper) | Gerenciamento de dependências |

### Frontend
| Tecnologia | Versão | Função |
|---|---|---|
| React | 19 | Biblioteca de interface |
| React Router DOM | 7 | Roteamento SPA |
| React Bootstrap | 2 | Componentes de UI |
| Bootstrap | 5.3 | Framework CSS |
| Vite | 8 | Bundler e servidor de desenvolvimento |

---

## 🏗️ Arquitetura do Sistema

O GymSync segue uma arquitetura **cliente-servidor desacoplada**, com backend REST e frontend SPA que se comunicam via HTTP/JSON.

```
┌─────────────────────────────────┐        ┌──────────────────────────────────┐
│        FRONTEND (React/Vite)    │        │      BACKEND (Spring Boot)       │
│                                 │        │                                  │
│  ┌──────────┐  ┌─────────────┐  │  HTTP  │  ┌────────────┐  ┌───────────┐   │
│  │  Pages   │→ │  Services   │──┼──────> │  │ Controller │→ │  Service  │   │
│  └──────────┘  └─────────────┘  │  JSON  │  └────────────┘  └─────┬─────┘   │
│  ┌──────────┐  ┌─────────────┐  │        │  ┌────────────┐        │         │
│  │Components│  │AuthContext  │  │        │  │   Mapper   │  ┌─────▼─────┐   │
│  └──────────┘  └─────────────┘  │        │  └────────────┘  │Repository │   │
│  ┌────────────────────────────┐ │        │  ┌────────────┐  └─────┬─────┘   │
│  │  React Router (rotas por   │ │        │  │    DTOs    │        │         │
│  │  role: ALUNO / TREINADOR)  │ │        │  └────────────┘  ┌─────▼─────┐   │
│  └────────────────────────────┘ │        │                  │  Entities │   │
└─────────────────────────────────┘        │                  └─────┬─────┘   │
                                           └────────────────────────┼─────────┘
                                                                    │
                                                         ┌──────────▼──────────┐
                                                         │ PostgreSQL (Docker) │
                                                         │ + Flyway Migrations │
                                                         └─────────────────────┘
```

### Camadas do Backend

| Camada | Pacote | Responsabilidade |
|---|---|---|
| **Controller** | _(a implementar)_ | Receber requisições HTTP, delegar ao Service e retornar respostas |
| **Service** | `services/` | Regras de negócio, orquestração e validações |
| **Repository** | `repositories/` | Acesso ao banco de dados via Spring Data JPA |
| **Domain / Entity** | `domain/entities/` | Modelos de domínio mapeados para o banco |
| **DTO** | `dtos/` | Objetos de transferência de dados (Request e Response) |
| **Mapper** | `mappers/` | Conversão bidirecional entre Entity e DTO |
| **Exception** | `exceptions/` | Tratamento global de erros com respostas padronizadas |

### Camadas do Frontend

| Camada | Pasta | Responsabilidade |
|---|---|---|
| **Pages** | `pages/` | Telas completas da aplicação (Dashboard, Login, Profile) |
| **Components** | `components/` | Componentes reutilizáveis (NavBar, Button, Forms) |
| **Context** | `context/` | Estado global de autenticação via React Context API |
| **Services** | `services/` | Chamadas à API backend (atualmente em modo mock) |
| **Routing** | `routing/` | Configuração declarativa de rotas por role de usuário |

---

## 🚀 Guia de Instalação

### Pré-requisitos

Certifique-se de ter instalado:

| Ferramenta | Versão Mínima | Download |
|---|---|---|
| Java (JDK) | 17 | [adoptium.net](https://adoptium.net/) |
| Maven | 3.9+ | Via `mvnw` incluso no projeto |
| Docker | 20+ | [docker.com](https://www.docker.com/get-started/) |
| Node.js | 18+ | [nodejs.org](https://nodejs.org/) |
| npm | 9+ | Incluso com Node.js |

### 1. Clonar o repositório

```bash
git clone https://github.com/carlosegzm/GymSync.git
cd GymSync
```

### 2. Configuração do banco de dados

O projeto utiliza Docker Compose para subir o PostgreSQL automaticamente. O arquivo `compose.yaml` na raiz já contém a configuração necessária:

```yaml
# compose.yaml (já configurado)
services:
  postgres:
    image: postgres:latest
    environment:
      POSTGRES_DB: gymsync_db
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
    ports:
      - '5432:5432'
```

Suba o banco com:

```bash
docker compose up -d
```

> **Nota:** O Spring Boot com `spring-boot-docker-compose` pode iniciar o container automaticamente ao rodar a aplicação, dependendo da sua configuração de IDE.

### 3. Configuração da aplicação

As configurações já estão definidas em `src/main/resources/application.yaml`. Se necessário, ajuste as credenciais:

```yaml
spring:
  datasource:
    url: jdbc:postgresql://localhost:5432/gymsync_db
    username: postgres
    password: postgres
```

> As migrations do Flyway (`V1__` e `V2__`) são executadas **automaticamente** na primeira inicialização, criando todas as tabelas necessárias.

### 4. Build e inicialização do backend

```bash
# Na raiz do projeto
./mvnw clean install        # Linux/macOS
mvnw.cmd clean install      # Windows

# Iniciar a aplicação
./mvnw spring-boot:run      # Linux/macOS
mvnw.cmd spring-boot:run    # Windows
```

### 5. Instalação e inicialização do frontend

```bash
# Entrar na pasta do frontend
cd frontend/gymsync

# Instalar dependências
npm install

# Iniciar servidor de desenvolvimento
npm run dev
```

---

## ▶️ Executando a API

Após iniciar o backend, a API estará disponível em:

| Item | Valor |
|---|---|
| **Porta padrão** | `8080` |
| **URL base da API** | `http://localhost:8080` |
| **Swagger / OpenAPI** | _(não configurado — ver [Melhorias Futuras](#-melhorias-futuras))_ |

O frontend de desenvolvimento estará disponível em:

| Item | Valor |
|---|---|
| **Porta padrão (Vite)** | `5173` |
| **URL do frontend** | `http://localhost:5173` |

### Credenciais de teste (frontend mock)

O frontend utiliza atualmente um serviço mock de autenticação. Use as credenciais abaixo para testar:

| Usuário | E-mail | Senha | Role |
|---|---|---|---|
| Aluno | `aluno@gymsync.com` | `123456` | `ALUNO` |
| Treinador | `treinador@gymsync.com` | `123456` | `TREINADOR` |

---

## ✅ Funcionalidades

### Backend (implementado)

- **Gestão de Academias (Gym):** Cadastro de academias com validação de CNPJ único.
- **Gestão de Usuários:** Criação de usuários com roles (`CLIENT` / `TRAINER`), validação de e-mail único e autenticação por credenciais.
- **Planos de Assinatura (Membership Plan):** Criação e listagem de planos por academia, com preço e duração em meses.
- **Assinaturas de Clientes:** Vínculo de cliente a um plano com controle de status (`ACTIVE`, `INACTIVE`, `EXPIRED`).
- **Aulas em Grupo (Group Class):** Criação de aulas com tipo (`YOGA`, `CROSSFIT`, etc.), data/hora e capacidade máxima de 40 alunos.
- **Reserva de Aulas (Class Booking):** Reserva de vagas em aulas com controle de status (`PENDING`, `CONFIRMED`, `MISSED`) e verificação de capacidade.
- **Horários Disponíveis (Available Timeslot):** Geração em lote de horários por treinador, agendamento individual e listagem por treinador.
- **Avaliação Física:** Registro e histórico de avaliações físicas (peso, altura, percentual de gordura) por cliente.
- **Transações Financeiras:** Registro de entradas e saídas com categorias, cálculo de saldo líquido da academia e registro automático de pagamentos.
- **Dashboard de Métricas:** Métricas consolidadas por academia: membros ativos, assinaturas expirando em 30 dias e saldo financeiro líquido.
- **Tratamento Global de Erros:** Respostas de erro padronizadas com timestamp, status HTTP e detalhes de validação de campos.
- **Migrations automáticas:** Schema criado e evoluído via Flyway.

### Frontend (implementado)

- **Sistema de roteamento por role:** Rotas diferentes para `ALUNO` e `TREINADOR`, com estrutura preparada para `ADMIN`.
- **Autenticação (mock):** Fluxo completo de login e registro com AuthContext global.
- **Rotas protegidas:** Componente `ProtectedRoute` que impede acesso a páginas sem autenticação.
- **Layout persistente:** NavBar responsiva com menu de usuário e botão de logout.
- **Páginas base:** Dashboard, Login, Registro e Perfil.
- **Formulários de autenticação** com feedback de erro.

---

## 🔌 Endpoints da API

> **Observação:** Os Controllers REST estão em fase de implementação. Os serviços abaixo já possuem lógica de negócio completa. Os endpoints listados representam a interface esperada da API baseada nos serviços existentes.

### Usuários

| Método | Rota | Descrição |
|---|---|---|
| `POST` | `/users` | Criar novo usuário |
| `POST` | `/users/login` | Autenticar usuário (login) |

### Academias

| Método | Rota | Descrição |
|---|---|---|
| `POST` | `/gyms` | Criar nova academia |

### Planos de Assinatura

| Método | Rota | Descrição |
|---|---|---|
| `POST` | `/membership-plans` | Criar plano de assinatura |
| `GET` | `/membership-plans?gymId={id}` | Listar planos por academia |

### Assinaturas de Clientes

| Método | Rota | Descrição |
|---|---|---|
| `POST` | `/subscriptions` | Inscrever cliente em um plano |
| `DELETE` | `/subscriptions/{id}` | Cancelar assinatura |

### Aulas em Grupo

| Método | Rota | Descrição |
|---|---|---|
| `POST` | `/group-classes` | Criar aula em grupo |
| `GET` | `/group-classes` | Listar todas as aulas |

### Reservas de Aulas

| Método | Rota | Descrição |
|---|---|---|
| `POST` | `/bookings` | Reservar vaga em aula |
| `PATCH` | `/bookings/{id}/attendance` | Atualizar presença (CONFIRMED / MISSED) |
| `DELETE` | `/bookings/{id}?clientId={id}` | Cancelar reserva |

### Horários Disponíveis

| Método | Rota | Descrição |
|---|---|---|
| `POST` | `/timeslots/bulk` | Gerar horários em lote para treinador |
| `GET` | `/timeslots?trainerId={id}` | Listar horários disponíveis por treinador |
| `PATCH` | `/timeslots/{id}/book?clientId={id}` | Agendar horário com treinador |
| `DELETE` | `/timeslots/{id}` | Cancelar horário |

### Avaliações Físicas

| Método | Rota | Descrição |
|---|---|---|
| `POST` | `/physical-assessments` | Registrar avaliação física |
| `GET` | `/physical-assessments?clientId={id}` | Histórico de avaliações do cliente |

### Transações Financeiras

| Método | Rota | Descrição |
|---|---|---|
| `POST` | `/financial-transactions` | Registrar transação financeira |
| `GET` | `/financial-transactions/balance?gymId={id}` | Obter saldo líquido da academia |

### Dashboard

| Método | Rota | Descrição |
|---|---|---|
| `GET` | `/dashboard?gymId={id}` | Métricas consolidadas da academia |

---

## 📁 Estrutura do Projeto

```
GymSync/
├── compose.yaml                          # Docker Compose (PostgreSQL)
├── pom.xml                               # Dependências Maven
├── mvnw / mvnw.cmd                       # Maven Wrapper
│
├── src/
│   └── main/
│       ├── java/com/br/GymSync/
│       │   ├── GymSyncApplication.java   # Entry point
│       │   │
│       │   ├── domain/
│       │   │   ├── entities/             # Entidades JPA
│       │   │   └── enums/                # Enums de domínio
│       │   │
│       │   ├── dtos/                     # Request e Response DTOs
│       │   │   ├── availabletimeslot/
│       │   │   ├── classbooking/
│       │   │   ├── clientsubscription/
│       │   │   ├── financialltransaction/
│       │   │   ├── groupclass/
│       │   │   ├── gym/
│       │   │   ├── membershipplan/
│       │   │   ├── physicalassessment/
│       │   │   └── user/
│       │   │
│       │   ├── exceptions/               # Handler global + exceções customizadas
│       │   ├── mappers/                  # Entity ↔ DTO converters
│       │   ├── repositories/             # Interfaces Spring Data JPA
│       │   └── services/                 # Regras de negócio
│       │
│       └── resources/
│           ├── application.yaml          # Configuração da aplicação
│           └── db/migration/
│               ├── V1__create_initial_schema.sql
│               └── V2__add_gym_management_and_finance.sql
│
└── frontend/
    └── gymsync/
        ├── package.json
        ├── vite.config.js
        └── src/
            ├── main.jsx                  # Entry point React
            ├── components/
            │   ├── commom/               # Button, ProtectedRoute
            │   ├── forms/auth/           # LoginForm, RegisterForm
            │   └── layout/               # AppLayout, NavBar
            ├── context/
            │   └── AuthContext.jsx       # Estado global de autenticação
            ├── pages/
            │   ├── Dashboard.jsx         # Página principal da SPA
            │   ├── auth/                 # Login, Register
            │   └── user/                 # Profile
            ├── routing/
            │   └── routeConfig.js        # Mapa de rotas por role
            ├── services/
            │   └── authService.mock.js   # Mock de autenticação
            └── styles/
                └── global.css
```

---

## 🔮 Melhorias Futuras

- [ ] **Implementar Controllers REST** — expor todos os serviços via endpoints HTTP.
- [ ] **Autenticação e autorização com JWT** — substituir o mock de autenticação do frontend por integração real com o backend, com tokens JWT e refresh tokens.
- [ ] **Controle de acesso por role (RBAC)** — restringir endpoints por perfil (`CLIENT`, `TRAINER`, futuramente `ADMIN`).
- [ ] **Hash de senhas** — implementar BCrypt para armazenamento seguro de credenciais.
- [ ] **Documentação Swagger / OpenAPI** — adicionar `springdoc-openapi` para documentação interativa da API.
- [ ] **Testes unitários e de integração** — cobertura com JUnit 5 e Mockito no backend; Vitest/RTL no frontend.
- [ ] **Paginação e filtros** — suporte a paginação nas listagens e filtros avançados.
- [ ] **Monitoramento e observabilidade** — integrar Spring Actuator + Prometheus + Grafana.
- [ ] **Pipeline CI/CD** — configurar GitHub Actions para build, testes e deploy automatizados.
- [ ] **Páginas de role no frontend** — implementar painéis específicos para `ALUNO` e `TREINADOR` (já mapeados no `routeConfig.js`).
- [ ] **Internacionalização (i18n)** — o frontend já prevê chaves de tradução (`nav.dashboard`, etc.); implementar a solução de i18n.
- [ ] **Upload de foto de perfil** — suporte a foto de perfil do usuário.
- [ ] **Notificações de assinatura expirando** — alertar automaticamente clientes com assinaturas próximas do vencimento.

---

## 🤝 Contribuindo

Contribuições são bem-vindas! Para contribuir com o projeto:

1. **Fork** este repositório.
2. Crie uma **branch** para sua feature ou correção:
   ```bash
   git checkout -b feature/minha-feature
   ```
3. Faça seus **commits** com mensagens claras e descritivas:
   ```bash
   git commit -m "feat: adiciona endpoint de listagem de aulas"
   ```
4. Envie para seu fork:
   ```bash
   git push origin feature/minha-feature
   ```
5. Abra um **Pull Request** explicando com detalhes as mudanças realizadas.

> Para alterações significativas, abra uma **Issue** primeiro para discussão do que deve ser feito

---

## 📄 Licença

Este projeto foi desenvolvido para fins **acadêmicos e de portfólio**. Não possui licença comercial. Fique à vontade para estudar, referenciar e se inspirar no código.

---

<div align="center">

Feito com ☕ e 🏋️ por **carlosegzm** e **viniciuscorbellini**

</div>