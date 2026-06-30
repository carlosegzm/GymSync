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
│  │  React Router (roles:      │ │        │  │    DTOs    │        │         │
│  │ ADMIN / ALUNO / TREINADOR) │ │        │  └────────────┘  ┌─────▼─────┐   │
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
| **Controller** | `controllers/` | Receber requisições HTTP, delegar ao Service e retornar respostas |
| **Service** | `services/` | Regras de negócio, orquestração e validações |
| **Repository** | `repositories/` | Acesso ao banco de dados via Spring Data JPA |
| **Domain / Entity** | `domain/entities/` | Modelos de domínio mapeados para o banco |
| **DTO** | `dtos/` | Objetos de transferência de dados (Request e Response) |
| **Mapper** | `mappers/` | Conversão bidirecional entre Entity e DTO |
| **Exception** | `exceptions/` | Tratamento global de erros com respostas padronizadas |

## Camadas do Frontend

| Camada | Pasta | Responsabilidade |
|--------|--------|------------------|
| **Pages** | `pages/` | Telas completas da aplicação (Dashboard, Login, Perfil, etc.). |
| **Components** | `components/` | Componentes reutilizáveis da interface (botões, formulários, cards, navbar, etc.). |
| **Hooks** | `hooks/` | Hooks customizados para reutilização de lógica de estado, efeitos e integração com serviços. |
| **i18n** | `i18n/` | Configuração da internacionalização da aplicação. |
| **Locales** | `locales/` | Arquivos de tradução utilizados pelo sistema de internacionalização. |
| **Routing** | `routing/` | Configuração e organização das rotas da aplicação, incluindo controle de acesso quando necessário. |
| **Services** | `services/` | Comunicação com a API backend, centralizando chamadas HTTP e regras de acesso aos endpoints. |
| **Styles** | `styles/` | Estilos globais, temas e configurações visuais compartilhadas pela aplicação. |
| **Utils** | `utils/` | Funções utilitárias e helpers reutilizados em diferentes partes do projeto. |
| **Main** | `main.jsx` | Ponto de entrada da aplicação, responsável por inicializar o React e carregar os provedores globais. |

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
| **Swagger / OpenAPI** | `http://localhost:8080/swagger-ui/index.html` |

O frontend de desenvolvimento estará disponível em:

| Item | Valor |
|---|---|
| **Porta padrão (Vite)** | `5173` |
| **URL do frontend** | `http://localhost:5173` |

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

- **Sistema de roteamento por role:** Rotas protegidas por role (`ADMIN`, `TRAINER`, `CLIENT`), validadas a partir do JWT decodificado — não do localStorage, prevenindo adulteração client-side.
- **Autenticação real:** Login e registro integrados ao backend via JWT, com restauração de sessão (`GET /api/users/validate` + `GET /api/users/me`) ao recarregar a página.
- **Onboarding de ADMIN:** Administradores sem academia vinculada são redirecionados automaticamente para `/gym` até criarem ou serem vinculados a uma.
- **Rotas protegidas:** Componente `ProtectedRoute` com suporte a `allowedRoles`, bloqueando acesso por role além de autenticação.
- **Internacionalização (i18n):** Suporte a Português, Inglês e Espanhol via `i18next`, com detecção automática do idioma do navegador — sem solicitar configuração ao usuário.
- **Layout persistente:** Sidebar de navegação adaptada por role, com avatar, nome e botão de logout.

#### Páginas implementadas

- **Login / Registro** — formulários com validação client-side, medidor de força de senha e feedback de erro.
- **Dashboard** — conteúdo condicional por role: métricas da academia (ADMIN), atalhos de navegação (TRAINER/CLIENT) e download de relatórios em PDF.
- **Aulas Coletivas (`/classes`)** — TRAINER cria e gerencia suas aulas; CLIENT visualiza e reserva vagas, com tratamento de erro de turma cheia.
- **Agenda do Treinador (`/timeslots`)** — geração em lote de horários disponíveis, exclusão de horários livres e visualização de sessões já agendadas.
- **Agendamento de Sessão (`/book-slot`)** — CLIENT seleciona um treinador (dropdown por nome) e reserva um horário livre.
- **Avaliações Físicas (`/assessments`)** — TRAINER registra avaliações de clientes (com busca por nome); CLIENT visualiza seu histórico e baixa relatório em PDF.
- **Assinatura (`/subscription`)** — CLIENT visualiza plano ativo, se inscreve em planos disponíveis e cancela assinatura.
- **Planos de Membros (`/plans`)** — ADMIN cria e lista planos de assinatura da academia.
- **Financeiro (`/finances`)** — ADMIN registra transações (receita/despesa), acompanha saldo em tempo real e baixa relatório financeiro em PDF.
- **Usuários (`/users`)** — ADMIN busca usuários por e-mail, vincula/desvincula treinadores e clientes à academia, e inscreve clientes em planos existentes.
- **Configuração de Academia (`/gym`)** — ADMIN registra uma nova unidade de academia (nome + CNPJ).

#### Decisões técnicas

- **Segurança de role:** A role exibida na UI é sempre extraída do JWT (`getRoleFromToken`), nunca do `localStorage` puro, prevenindo bypass de visualização por adulteração manual do storage.
- **Relatórios em PDF:** Hook reutilizável `useReportDownload` para download de Blobs retornados pelo backend (financeiro, avaliações físicas, ocupação de salas).
- **Busca por nome:** Componente `UserSelect` reutilizável substitui inputs de UUID por busca textual com dropdown, usado em Avaliações, Agendamento de Sessão e Usuários.

---

## 🔌 Endpoints da API

Leia e entenda como consumir os endpoints em [./api.md](./api.md)
  
> Obs: O api.md pode estar desatualizado. Para uma documentação mais detalhada e atual, acesse a documentação do Swagger em `http://localhost:8080/swagger-ui/index.html`

## 📁 Estrutura do Projeto

```
GymSync/
├── api.md
├── compose.yaml
├── frontend
│   └── gymsync
│       ├── index.html
│       ├── package.json
│       ├── package-lock.json
│       ├── README.md
│       ├── src
│       │   ├── components
│       │   │   ├── commom
│       │   │   │   ├── button
│       │   │   │   │   ├── Button.jsx
│       │   │   │   │   └── Button.module.css
│       │   │   │   ├── ProtectedRoute.jsx
│       │   │   │   └── userselect
│       │   │   │       ├── UserSelect.jsx
│       │   │   │       └── UserSelect.module.css
│       │   │   ├── dashboard
│       │   │   │   ├── cards
│       │   │   │   │   ├── ActionCard.jsx
│       │   │   │   │   └── MetricCard.jsx
│       │   │   │   └── sections
│       │   │   │       ├── AdminSection.jsx
│       │   │   │       ├── ClientSection.jsx
│       │   │   │       └── TrainerSection.jsx
│       │   │   ├── forms
│       │   │   │   └── auth
│       │   │   │       ├── AuthForms.module.css
│       │   │   │       ├── LoginForm.jsx
│       │   │   │       └── RegisterForm.jsx
│       │   │   ├── layout
│       │   │   │   ├── AppLayout.jsx
│       │   │   │   └── NavBar.jsx
│       │   │   └── subscription
│       │   │       └── cards
│       │   │           ├── ActiveSubscriptionCard.jsx
│       │   │           └── PlanCard.jsx
│       │   ├── hooks
│       │   │   ├── context
│       │   │   │   └── AuthContext.jsx
│       │   │   ├── report
│       │   │   │   └── useReportDownload.js
│       │   │   └── users
│       │   │       └── useGymUsers.js
│       │   ├── i18n
│       │   │   └── i18n.js
│       │   ├── locales
│       │   │   ├── en.json
│       │   │   ├── es.json
│       │   │   └── pt.json
│       │   ├── main.jsx
│       │   ├── pages
│       │   │   ├── assessments
│       │   │   │   ├── Assessments.jsx
│       │   │   │   └── Assessments.module.css
│       │   │   ├── auth
│       │   │   │   ├── AuthPage.module.css
│       │   │   │   ├── Login.jsx
│       │   │   │   └── Register.jsx
│       │   │   ├── bookslot
│       │   │   │   ├── BookSlot.jsx
│       │   │   │   └── BookSlot.module.css
│       │   │   ├── classes
│       │   │   │   ├── Classes.jsx
│       │   │   │   └── Classes.module.css
│       │   │   ├── Dashboard.jsx
│       │   │   ├── Dashboard.module.css
│       │   │   ├── finances
│       │   │   │   ├── Finances.jsx
│       │   │   │   └── Finances.module.css
│       │   │   ├── gym
│       │   │   │   ├── Gym.jsx
│       │   │   │   └── Gym.module.css
│       │   │   ├── plans
│       │   │   │   ├── Plans.jsx
│       │   │   │   └── Plans.module.css
│       │   │   ├── subscription
│       │   │   │   ├── Subscription.jsx
│       │   │   │   └── Subscription.module.css
│       │   │   ├── timeslots
│       │   │   │   ├── Timeslots.jsx
│       │   │   │   └── Timeslots.module.css
│       │   │   └── users-admin
│       │   │       ├── Users.jsx
│       │   │       └── Users.module.css
│       │   ├── routing
│       │   │   └── routeConfig.js
│       │   ├── services
│       │   │   ├── api.js
│       │   │   ├── authService.js
│       │   │   ├── availableTimeSlotService.js
│       │   │   ├── classBookingService.js
│       │   │   ├── clientSubscriptionService.js
│       │   │   ├── dashboardService.js
│       │   │   ├── financialTransactionService.js
│       │   │   ├── groupClassService.js
│       │   │   ├── gymService.js
│       │   │   ├── membershipPlanService.js
│       │   │   ├── physicalAssessmentService.js
│       │   │   └── reportService.js
│       │   ├── styles
│       │   │   └── global.css
│       │   └── utils
│       │       └── jwt.js
│       └── vite.config.js
├── mvnw
├── mvnw.cmd
├── pom.xml
├── README.md
└── src
    ├── main
    │   ├── java
    │   │   └── com
    │   │       └── br
    │   │           └── GymSync
    │   │               ├── config
    │   │               │   ├── AuthenticationService.java
    │   │               │   ├── OpenApiConfig.java
    │   │               │   ├── SecurityConfig.java
    │   │               │   ├── SecurityFilter.java
    │   │               │   └── TokenService.java
    │   │               ├── controllers
    │   │               │   ├── AvailableTimeslotController.java
    │   │               │   ├── ClassBookingController.java
    │   │               │   ├── ClientSubscriptionController.java
    │   │               │   ├── DashboardController.java
    │   │               │   ├── FinancialTransactionController.java
    │   │               │   ├── GroupClassController.java
    │   │               │   ├── GymController.java
    │   │               │   ├── MembershipPlanController.java
    │   │               │   ├── PhysicalAssessmentController.java
    │   │               │   ├── ReportController.java
    │   │               │   └── UserController.java
    │   │               ├── domain
    │   │               │   ├── entities
    │   │               │   │   ├── AvailableTimeslot.java
    │   │               │   │   ├── ClassBooking.java
    │   │               │   │   ├── ClientSubscription.java
    │   │               │   │   ├── FinancialTransaction.java
    │   │               │   │   ├── GroupClass.java
    │   │               │   │   ├── Gym.java
    │   │               │   │   ├── MembershipPlan.java
    │   │               │   │   ├── PhysicalAssessment.java
    │   │               │   │   └── User.java
    │   │               │   └── enums
    │   │               │       ├── BookingStatus.java
    │   │               │       ├── ClassType.java
    │   │               │       ├── Role.java
    │   │               │       ├── SubscriptionStatus.java
    │   │               │       ├── TransactionCategory.java
    │   │               │       └── TransactionType.java
    │   │               ├── dtos
    │   │               │   ├── auth
    │   │               │   │   └── TokenValidationResponse.java
    │   │               │   ├── availabletimeslot
    │   │               │   │   ├── AvailableTimeslotRequestDTO.java
    │   │               │   │   └── AvailableTimeslotResponseDTO.java
    │   │               │   ├── classbooking
    │   │               │   │   ├── ClassBookingRequestDTO.java
    │   │               │   │   └── ClassBookingResponseDTO.java
    │   │               │   ├── clientsubscription
    │   │               │   │   ├── ClientSubscriptionRequestDTO.java
    │   │               │   │   └── ClientSubscriptionResponseDTO.java
    │   │               │   ├── financialltransaction
    │   │               │   │   ├── FinancialTransactionRequestDTO.java
    │   │               │   │   └── FinancialTransactionResponseDTO.java
    │   │               │   ├── groupclass
    │   │               │   │   ├── GroupClassRequestDTO.java
    │   │               │   │   └── GroupClassResponseDTO.java
    │   │               │   ├── gym
    │   │               │   │   ├── GymRequestDTO.java
    │   │               │   │   └── GymResponseDTO.java
    │   │               │   ├── membershipplan
    │   │               │   │   ├── MembershipPlanRequestDTO.java
    │   │               │   │   └── MembershipPlanResponseDTO.java
    │   │               │   ├── physicalassessment
    │   │               │   │   ├── PhysicalAssessmentRequestDTO.java
    │   │               │   │   └── PhysicalAssessmentResponseDTO.java
    │   │               │   └── user
    │   │               │       ├── LoginRequestDTO.java
    │   │               │       ├── UserRequestDTO.java
    │   │               │       └── UserResponseDTO.java
    │   │               ├── exceptions
    │   │               │   ├── custom
    │   │               │   │   ├── ActiveSubscriptionRequiredException.java
    │   │               │   │   ├── ClassClassroomFullException.java
    │   │               │   │   ├── CnpjAlreadyExistsException.java
    │   │               │   │   ├── EmailAlreadyExistsException.java
    │   │               │   │   ├── InvalidCredentialsException.java
    │   │               │   │   ├── InvalidDateRangeException.java
    │   │               │   │   ├── InvalidUserRoleException.java
    │   │               │   │   └── ResourceNotFoundException.java
    │   │               │   ├── ErrorResponse.java
    │   │               │   └── GlobalExceptionHandler.java
    │   │               ├── GymSyncApplication.java
    │   │               ├── mappers
    │   │               │   ├── AvailableTimeslotMapper.java
    │   │               │   ├── ClassBookingMapper.java
    │   │               │   ├── ClientSubscriptionMapper.java
    │   │               │   ├── FinancialTransactionMapper.java
    │   │               │   ├── GroupClassMapper.java
    │   │               │   ├── GymMapper.java
    │   │               │   ├── MembershipPlanMapper.java
    │   │               │   ├── PhysicalAssessmentMapper.java
    │   │               │   └── UserMapper.java
    │   │               ├── repositories
    │   │               │   ├── AvailableTimeslotRepository.java
    │   │               │   ├── ClassBookingRepository.java
    │   │               │   ├── ClientSubscriptionRepository.java
    │   │               │   ├── FinancialTransactionRepository.java
    │   │               │   ├── GroupClassRepository.java
    │   │               │   ├── GymRepository.java
    │   │               │   ├── MembershipPlanRepository.java
    │   │               │   ├── PhysicalAssessmentRepository.java
    │   │               │   └── UserRepository.java
    │   │               └── services
    │   │                   ├── AvailableTimeslotService.java
    │   │                   ├── ClassBookingService.java
    │   │                   ├── ClientSubscriptionService.java
    │   │                   ├── DashboardService.java
    │   │                   ├── FinancialTransactionService.java
    │   │                   ├── GroupClassService.java
    │   │                   ├── GymService.java
    │   │                   ├── MembershipPlanService.java
    │   │                   ├── PhysicalAssessmentService.java
    │   │                   ├── ReportService.java
    │   │                   └── UserService.java
    │   └── resources
    │       ├── application.yaml
    │       └── db
    │           └── migration
    │               ├── V1__create_initial_schema.sql
    │               ├── V2__add_gym_management_and_finance.sql
    │               └── V3__Insert_default_users_for_testing.sql
    └── test
        └── java
            └── com
                └── br
                    └── GymSync
                        └── GymSyncApplicationTests.java
```

---

## 🔮 Melhorias Futuras

- [x] **Implementar Controllers REST** — expor todos os serviços via endpoints HTTP.
- [x] **Autenticação e autorização com JWT** — substituir o mock de autenticação do frontend por integração real com o backend, com tokens JWT e refresh tokens.
- [x] **Controle de acesso por role (RBAC)** — restringir endpoints por perfil (`CLIENT`, `TRAINER`, futuramente `ADMIN`).
- [x] **Hash de senhas** — implementar BCrypt para armazenamento seguro de credenciais.
- [x] **Documentação Swagger / OpenAPI** — adicionar `springdoc-openapi` para documentação interativa da API.
- [ ] **Testes unitários e de integração** — cobertura com JUnit 5 e Mockito no backend; Vitest/RTL no frontend.
- [ ] **Paginação e filtros** — suporte a paginação nas listagens e filtros avançados.
- [ ] **Monitoramento e observabilidade** — integrar Spring Actuator + Prometheus + Grafana.
- [ ] **Pipeline CI/CD** — configurar GitHub Actions para build, testes e deploy automatizados.
- [x] **Páginas de role no frontend** — implementar painéis específicos para `ALUNO` e `TREINADOR` (já mapeados no `routeConfig.js`).
- [x] **Internacionalização (i18n)** — o frontend já prevê chaves de tradução (`nav.dashboard`, etc.); implementar a solução de i18n.
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