# Sistema de Chamados - Campus

Sistema de gerenciamento de chamados de manutenção para campus universitário, com backend em NestJS e frontend em React.

## Problema

O campus enfrenta dificuldades no registro, acompanhamento e gestão de chamados de manutenção. Não há um sistema centralizado para:

- Registrar solicitações de reparo
- Acompanhar o status das solicitações
- Atribuir técnicos responsáveis
- Categorizar e priorizar chamados
- Registrar histórico de comentários por chamado

## Arquitetura

```
┌──────────────────────────────────────────────────┐
│                    Frontend                      │
│           React + TypeScript + Vite              │
│  ┌──────────┐ ┌────────────┐ ┌───────────────┐  │
│  │ Listagem │ │ Abertura   │ │ Detalhes      │  │
│  │ (Filtros)│ │ (Upload)   │ │ (Status+Com.) │  │
│  └────┬─────┘ └─────┬──────┘ └───────┬───────┘  │
│       └──────┬──────┴───────┬────────┘          │
│              │     Axios    │                    │
│              └──────┬───────┘                    │
│              /api (proxy) │                      │
└──────────────────────┼───────────────────────────┘
                       │ HTTP
┌──────────────────────┼───────────────────────────┐
│                  Backend                          │
│               NestJS + Express                    │
│                       │                           │
│  ┌─────────┐ ┌──────────┐ ┌──────────┐          │
│  │Categoria│ │ Chamados │ │  Locais  │          │
│  │  CRUD   │ │  CRUD +  │ │   CRUD   │          │
│  │         │ │Status/Filt│ │          │          │
│  └─────────┘ └──────────┘ └──────────┘          │
│                       │                           │
│              ┌────────┴────────┐                 │
│              │  In-Memory DB   │                 │
│              └─────────────────┘                 │
└──────────────────────────────────────────────────┘
```

## Diagrama DER (Entidade-Relacionamento)

```
┌──────────────┐       ┌──────────────────┐
│   Categoria  │       │     Chamado      │
│──────────────│       │──────────────────│
│ id (PK)      │──┐   │ id (PK)          │
│ nome         │  └───>│ categoriaId (FK) │
│ descricao    │       │ localId (FK)     │
│ criadoEm     │       │ solicitanteId    │
└──────────────┘       │ tecnicoId        │
                       │ titulo           │
┌──────────────┐       │ descricao        │
│    Local     │       │ status           │
│──────────────│──┐   │ prioridade        │
│ id (PK)      │  │   │ criadoEm          │
│ bloco        │  └───>│ atualizadoEm     │
│ sala         │       └────────┬─────────┘
│ campus       │                │ 1:N
│ criadoEm     │       ┌────────┴─────────┐
└──────────────┘       │   Comentario      │
                       │──────────────────│
                       │ id (PK)          │
                       │ chamadoId (FK)   │
                       │ usuarioId        │
                       │ texto            │
                       │ criadoEm         │
                       └──────────────────┘
```

### Transições de Status (Máquina de Estados)

```
ABERTO ──► EM_ANALISE ──► EM_EXECUCAO ──► CONCLUIDO
  │            │               │
  └──► CANCELADO   └──► CANCELADO  └──► CANCELADO
```

## Tecnologias

| Tecnologia | Versão | Finalidade |
|---|---|---|
| **Node.js** | ≥18 | Runtime |
| **NestJS** | 11 | Framework backend |
| **Express** | - | Servidor HTTP |
| **TypeScript** | 5.7 | Linguagem |
| **React** | 19 | Framework frontend |
| **Vite** | 6 | Bundler frontend |
| **React Router** | 7 | Roteamento SPA |
| **Axios** | 1 | HTTP Client |
| **class-validator** | 0.15 | Validação de DTOs |
| **Jest** | 30 | Testes unitários |

## Como Rodar

### Pré-requisitos

- Node.js ≥ 18
- npm ≥ 9

### Backend

```bash
# Instalar dependências
npm install

# Executar em modo desenvolvimento (com watch)
npm run start:dev

# Servidor rodando em http://localhost:3000
```

### Frontend

```bash
# Instalar dependências
cd frontend && npm install

# Executar em modo desenvolvimento
npm run dev

# Servidor rodando em http://localhost:5173
# (requer backend rodando na porta 3000)
```

### Testes

```bash
# Testes unitários (backend)
npm run test

# Testes unitários com cobertura
npm run test:cov

# Testes e2e
npm run test:e2e
```

### Lint

```bash
npm run lint
```

## Scripts Disponíveis

| Comando | Descrição |
|---|---|
| `npm run start:dev` | Inicia backend com hot-reload |
| `npm run build` | Compila o backend |
| `npm run test` | Executa testes unitários |
| `npm run test:cov` | Testes com cobertura |
| `npm run test:e2e` | Testes end-to-end |
| `npm run lint` | Verifica lint |
| `cd frontend && npm run dev` | Inicia frontend |

## Endpoints da API

### Chamados

| Método | Rota | Descrição |
|---|---|---|
| `GET` | `/chamados` | Listar chamados (filtros: status, categoriaId, tecnicoId, pagina, limite) |
| `POST` | `/chamados` | Criar chamado |
| `GET` | `/chamados/:id` | Buscar chamado por ID |
| `PATCH` | `/chamados/:id` | Atualizar chamado |
| `PATCH` | `/chamados/:id/status` | Alterar status (com validação de state machine) |
| `DELETE` | `/chamados/:id` | Remover chamado |
| `POST` | `/chamados/:id/comentarios` | Adicionar comentário |
| `GET` | `/chamados/:id/comentarios` | Listar comentários |

### Categorias

| Método | Rota | Descrição |
|---|---|---|
| `GET` | `/categorias` | Listar categorias |
| `POST` | `/categorias` | Criar categoria |
| `GET` | `/categorias/:id` | Buscar categoria |
| `PATCH` | `/categorias/:id` | Atualizar categoria |
| `DELETE` | `/categorias/:id` | Remover categoria |

### Locais

| Método | Rota | Descrição |
|---|---|---|
| `GET` | `/locais` | Listar locais |
| `POST` | `/locais` | Criar local |
| `GET` | `/locais/:id` | Buscar local |
| `PATCH` | `/locais/:id` | Atualizar local |
| `DELETE` | `/locais/:id` | Remover local |

## Integrantes

- [Felipe] - Desenvolvimento Full Stack