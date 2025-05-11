# Aiqfome Backend Test

## 🛠️ Tecnologias e Ferramentas

### Core
- **Node.js v22.11.0**: Versão LTS mais recente com suporte a ESM nativo
- **TypeScript**: Para tipagem estática e melhor DX
- **Express**: Framework web minimalista e flexível
- **Inversify**: IoC container para injeção de dependência
- **Prisma**: ORM moderno com type-safety
- **Zod**: Validação de schemas em runtime
- **Swagger**: Documentação da API

### Integrações
- **Fake Store API**: API externa de produtos (`https://fakestoreapi.com/products`) utilizada para a funcionalidade de favoritos

### Testes
- **Vitest**: Runner de testes rápido e compatível com ESM
- **Supertest**: Testes de integração HTTP
- **Faker**: Geração de dados fake para testes

### Dev Tools
- **ESLint**: Linting com configuração personalizada (@thasmorato/eslint-config)
- **Prettier**: Formatação de código
- **tsx**: Executor TypeScript para desenvolvimento
- **tsc-alias**: Resolução de aliases no build

## 🚀 Como Rodar

### Local

1. Instale as dependências:
```bash
pnpm install
```

2. Configure as variáveis de ambiente:
```bash
cp .env.example .env
```

3. Execute as migrações:
```bash
pnpm migrate:prod
```

> **Nota**: Ao executar as migrações, um usuário admin padrão será criado com as seguintes credenciais:
> - Email: `admin@aiqfome.com`
> - Senha: `password`
>
> Se o `JWT_SECRET` no seu `.env` for igual ao do `.env.example`, caso troque o secret a senha não funcionará.

4. Inicie o servidor:
```bash
# Desenvolvimento
pnpm dev

# Produção
pnpm build
pnpm start
```

### Variáveis de Ambiente

| Variável | Descrição | Padrão |
|----------|-----------|---------|
| `PORT` | Porta onde o servidor vai rodar | `3333` |
| `DATABASE_URL` | URL de conexão com o banco de dados | - |
| `JWT_SECRET` | Chave secreta para geração do token JWT | - |
| `JWT_EXPIRES_IN` | Tempo de expiração do token JWT | `3600` |

### Docker

#### Desenvolvimento
```bash
# Inicia os containers
docker-compose up

# Para parar
docker-compose down
```

## 📚 Documentação da API

A documentação completa da API está disponível em `/api-docs` quando o servidor estiver rodando.

### Rotas Disponíveis

#### Auth
- `POST /register` - Registra um novo usuário
- `POST /login` - Autentica um usuário
- `PATCH /change-password` - Altera a senha do usuário logado
- `DELETE /profile` - Deleta o usuário logado
- `PATCH /client/{clientId}/change-password` - Altera a senha de um cliente (admin)
- `DELETE /client/{clientId}` - Deleta um cliente (admin)

#### Client
- `GET /profile` - Busca o perfil do usuário logado
- `PUT /profile` - Edita dados do próprio perfil
- `GET /client/{clientId}` - Busca um cliente por ID (admin)
- `PUT /client/{clientId}` - Edita dados de um cliente (admin)
- `POST /product/{productId}/favorite` - Adiciona/remove produto dos favoritos (IDs dos produtos devem ser obtidos da Fake Store API)

> **Nota**: Rotas marcadas com (admin) requerem autenticação como administrador.
>
> **Nota**: Para a funcionalidade de favoritos, os IDs dos produtos devem ser obtidos da [Fake Store API](https://fakestoreapi.com/products). Esta API fornece uma lista de produtos fictícios que podem ser marcados como favoritos.

## 🧪 Testes

```bash
# Unitários
pnpm test

# Watch mode
pnpm test:watch

# Cobertura
pnpm test:cov

# E2E
pnpm test:e2e
```

## 📦 Estrutura do Projeto

```
src/
├── auth/           # Módulo de autenticação
│   ├── application/    # Use Cases e DTOs
│   └── domain/        # Entidades e regras de negócio
├── client/         # Módulo de clientes
│   ├── application/    # Use Cases e DTOs
│   └── domain/        # Entidades e regras de negócio
├── common/         # Código compartilhado
└── infra/          # Infraestrutura
    ├── container/  # IoC container
    ├── db/         # Camada de dados
    ├── env/        # Configurações
    ├── gateways/   # Adaptadores externos
    └── http/       # Camada HTTP
```

## 🎯 Melhorias Possíveis

### Performance
- [ ] Implementar cache para queries frequentes

### Segurança
- [ ] Adicionar helmet
- [ ] Implementar rate limiting por IP
- [ ] Adicionar validação de CORS mais restritiva
- [ ] Implementar autenticação em dois fatores

### Arquitetura
- [ ] Implementar eventos de domínio
- [ ] Implementar circuit breaker para serviços externos
- [ ] Adicionar validação de domínio mais robusta

### DevOps
- [ ] Adicionar healthcheck
- [ ] Implementar logging estruturado
- [ ] Adicionar métricas
- [ ] Configurar monitoramento

### Testes
- [ ] Adicionar testes de carga
- [ ] Implementar testes de contrato
- [ ] Adicionar testes de segurança

## 📝 Decisões Técnicas

### Arquitetura Limpa
- Separação clara entre domínio, aplicação e infraestrutura
- Use Cases como serviços de aplicação
- Injeção de dependência para baixo acoplamento
- Repositories para abstração de dados

### Prisma
- Type-safety em tempo de compilação
- Migrations automáticas
- Schema validation
- Query builder otimizado

### Vitest
- Compatibilidade com ESM
- Performance superior ao Jest
- Integração com TypeScript
