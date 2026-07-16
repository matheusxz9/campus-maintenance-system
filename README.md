# Sistema de Chamados - Campus

Sistema de gerenciamento de chamados de manutenção para campus universitário, com backend em NestJS e frontend em React.

## Problema

O campus enfrenta dificuldades no registro, acompanhamento e gestão de chamados de manutenção. Não há um sistema centralizado para:

- Registrar solicitações de reparo
- Acompanhar o status das solicitações
- Atribuir técnicos responsáveis
- Categorizar e priorizar chamados
- Registrar histórico de comentários e anexos por chamado

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
┌──────────────┐       │ id (PK)          │
│    Anexo     │       │ chamadoId (FK)   │
│──────────────│       │ usuarioId        │
│ id (PK)      │       │ texto            │
│ chamadoId(FK)│       │ criadoEm         │
│ nomeOriginal │       └──────────────────┘
│ caminho      │
│ tamanho      │
│ tipo         │
│ criadoEm     │
└──────────────┘
```

### Transições de Status (Máquina de Estados)

```
                    ┌──────────────────────────┐
                    │         ABERTO            │
                    └────┬──────┬───────────────┘
                         │      │
                    EM_ANALISE  CANCELADO
                         │      │
                    EM_EXECUCAO │
                         │      │
                    CONCLUIDO   │
                         │      │
                    (volta ao ABERTO para reabertura)
```

Transições permitidas:
- `ABERTO` → `EM_ANALISE` | `CANCELADO`
- `EM_ANALISE` → `EM_EXECUCAO` (exige `tecnicoId`) | `CANCELADO`
- `EM_EXECUCAO` → `CONCLUIDO` | `CANCELADO`
- `CONCLUIDO` → `ABERTO` (reabrir)
- `CANCELADO` → `ABERTO` (reabrir)

## Tecnologias

| Tecnologia | Versão | Finalidade |
|---|---|---|
| **Node.js** | ≥18 | Runtime |
| **NestJS** | 11 | Framework backend |
| **Express** | - | Servidor HTTP |
| **TypeScript** | 5.7 | Linguagem |
| **React** | 19 | Framework frontend |
| **Vite** | 8 | Bundler frontend |
| **React Router** | 7 | Roteamento SPA |
| **Axios** | 1 | HTTP Client |
| **class-validator** | 0.15 | Validação de DTOs |
| **Jest** | 30 | Testes unitários |
| **Multer** | 2 | Upload de arquivos |

## Como Rodar

### Pré-requisitos

- Node.js ≥ 18
- npm ≥ 9

### Desenvolvimento

```bash
# Instalar dependências (backend + frontend automaticamente)
npm install

# Rodar backend + frontend simultaneamente
npm run dev

# Ou separadamente:
# Terminal 1 - Backend (http://localhost:3000)
npm run start:dev

# Terminal 2 - Frontend (http://localhost:5173)
npm --prefix frontend run dev
```

O frontend em dev faz proxy de `/api` para `localhost:3000` via Vite.

### Testes

```bash
# Testes unitários (backend)
npm test

# Testes com cobertura
npm run test:cov
```

## Deploy

### Backend — Render

URL: `https://campus-maintenance-api-nzjg.onrender.com`

| Config | Valor |
|--------|-------|
| Runtime | Node |
| Build | `npm ci && npm run build` |
| Start | `npm run start:prod` |
| Health | `/health` |

### Frontend — Vercel

URL: `https://campus-maintenance-system-taupe.vercel.app`

| Config | Valor |
|--------|-------|
| Framework | Vite |
| Build | `cd frontend && npm install && npm run build` |
| Output | `frontend/dist` |
| Env | `VITE_API_URL` = URL do Render (ou usa `/api` via proxy) |

O `vercel.json` na raiz do projeto faz o proxy de `/api` e `/uploads` para o Render, e gerencia o fallback de rotas SPA.

## Endpoints da API

### Chamados

| Método | Rota | Descrição |
|---|---|---|
| `GET` | `/chamados` | Listar (filtros: status, categoriaId, tecnicoId, pagina, limite) |
| `POST` | `/chamados` | Criar chamado |
| `GET` | `/chamados/:id` | Buscar por ID |
| `PATCH` | `/chamados/:id` | Atualizar dados |
| `PATCH` | `/chamados/:id/status` | Alterar status (state machine) |
| `DELETE` | `/chamados/:id` | Remover |
| `POST` | `/chamados/:id/comentarios` | Adicionar comentário |
| `GET` | `/chamados/:id/comentarios` | Listar comentários |
| `POST` | `/chamados/:id/anexos` | Upload de anexo (multipart) |
| `GET` | `/chamados/:id/anexos` | Listar anexos |

### Categorias

| Método | Rota | Descrição |
|---|---|---|
| `GET` | `/categorias` | Listar |
| `POST` | `/categorias` | Criar |
| `GET` | `/categorias/:id` | Buscar |
| `PATCH` | `/categorias/:id` | Atualizar |
| `DELETE` | `/categorias/:id` | Remover |

### Locais

| Método | Rota | Descrição |
|---|---|---|
| `GET` | `/locais` | Listar |
| `POST` | `/locais` | Criar |
| `GET` | `/locais/:id` | Buscar |
| `PATCH` | `/locais/:id` | Atualizar |
| `DELETE` | `/locais/:id` | Remover |

### Outros

| Método | Rota | Descrição |
|---|---|---|
| `GET` | `/health` | Health check do backend |

## Scripts

| Comando | Descrição |
|---|---|
| `npm run start:dev` | Backend com hot-reload |
| `npm run build` | Compilar backend |
| `npm run dev` | Backend + frontend simultâneo |
| `npm test` | Testes unitários |
| `npm run lint` | Verificar lint |
| `npm --prefix frontend run dev` | Frontend isolado |

## Integrantes

- Matheus William
- Felipe Octavio
- Luis Felipe
- Pedro Eduardo
