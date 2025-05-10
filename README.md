# Aiqfome Backend Test

## 🛠️ Tecnologias e Ferramentas

### Core
- **Node.js v22.11.0**: Versão LTS mais recente com suporte a ESM nativo
- **TypeScript**: Para tipagem estática e melhor DX
- **Express**: Framework web minimalista e flexível
- **Inversify**: IoC container para injeção de dependência
- **Prisma**: ORM moderno com type-safety
- **Zod**: Validação de schemas em runtime

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

4. Inicie o servidor:
```bash
# Desenvolvimento
pnpm dev

# Produção
pnpm build
pnpm start
```

### Docker

#### Desenvolvimento
```bash
# Inicia os containers
docker-compose up

# Para parar
docker-compose down
```

#### Produção
```bash
# Build da imagem
docker build -t aiqfome-bk-tst -f docker/builders/Dockerfile.prod .

# Executa o container
docker run -p 3333:3333 aiqfome-bk-tst
```

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

### Documentação
- [ ] Adicionar OpenAPI/Swagger
- [ ] Documentar decisões arquiteturais
- [ ] Adicionar exemplos de uso
- [ ] Criar documentação de API

## 📝 Decisões Técnicas

### Arquitetura Limpa
- Separação clara entre domínio, aplicação e infraestrutura
- Use Cases como serviços de aplicação
- Injeção de dependência para baixo acoplamento
- Repositories para abstração de dados

### TypeScript + ESM
- Uso de ESM nativo para melhor performance
- Configuração otimizada para Node.js v22
- Aliases para melhor organização de imports

### Prisma
- Type-safety em tempo de compilação
- Migrations automáticas
- Schema validation
- Query builder otimizado

### Vitest
- Compatibilidade com ESM
- Performance superior ao Jest
- Integração com TypeScript

## 📄 Licença

ISC
