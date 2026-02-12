# Guia de Banco de Dados Futuro (Fluig / SQL Server)

Este documento descreve como o modelo de dados do Controle de Plano de Testes pode ser persistido futuramente em SQL Server e exposto via Fluig Dataset/Constraints.

## Estrutura proposta de tabelas

### test_plans
Armazena o plano de testes principal (pode representar releases, versões ou iniciativas).

**Campos principais**:
- `id` (PK)
- `name`
- `description`
- `created_at`
- `updated_at`

### test_cases
Armazena os casos de teste associados ao plano.

**Campos principais**:
- `id` (PK)
- `test_plan_id` (FK → test_plans.id)
- `title`
- `description`
- `type`
- `status`
- `priority`
- `responsible`
- `created_at`
- `updated_at`
- `notes`

### test_case_comments
Histórico de comentários por caso de teste.

**Campos principais**:
- `id` (PK)
- `test_case_id` (FK → test_cases.id)
- `comment`
- `author`
- `created_at`

### test_case_execution_history
Histórico de execuções por caso, permitindo rastrear mudanças de status.

**Campos principais**:
- `id` (PK)
- `test_case_id` (FK → test_cases.id)
- `status`
- `executed_by`
- `executed_at`
- `notes`

### evidences
Armazena evidências (imagens/vídeos) associadas ao caso de teste.

**Campos principais**:
- `id` (PK)
- `test_case_id` (FK → test_cases.id)
- `type` (image/video)
- `storage_url` (link ou caminho do arquivo)
- `description`
- `created_at`

### tickets
Vincula incidentes ou demandas externas ao caso de teste.

**Campos principais**:
- `id` (PK)
- `test_case_id` (FK → test_cases.id)
- `external_key`
- `title`
- `status`
- `created_at`
- `updated_at`

### ticket_comments
Comentários relacionados aos tickets.

**Campos principais**:
- `id` (PK)
- `ticket_id` (FK → tickets.id)
- `comment`
- `author`
- `created_at`

### ticket_status_history
Histórico de status dos tickets.

**Campos principais**:
- `id` (PK)
- `ticket_id` (FK → tickets.id)
- `status`
- `changed_by`
- `changed_at`

## Relacionamentos principais

- `test_plans` 1:N `test_cases`
- `test_cases` 1:N `test_case_comments`
- `test_cases` 1:N `test_case_execution_history`
- `test_cases` 1:N `evidences`
- `test_cases` 1:N `tickets`
- `tickets` 1:N `ticket_comments`
- `tickets` 1:N `ticket_status_history`

## Por que separar comentários, histórico e evidências?

- **Comentários**: permitem registrar discussões e validações sem alterar o caso principal.
- **Histórico de execução**: mantém rastreabilidade completa de mudanças de status ao longo do tempo.
- **Evidências**: guardam arquivos e metadados, podendo ser armazenadas em repositórios externos.

Essa separação melhora performance, facilita auditoria e garante escalabilidade.

## Integração com SQL Server e Fluig Datasets/Constraints

- Em SQL Server, todas as tabelas podem ser normalizadas conforme o modelo acima.
- No Fluig, um **Dataset customizado** pode expor `test_cases` e relacionamentos por meio de **constraints**.
- Exemplo de constraints:
  - Filtrar casos por `test_plan_id`
  - Buscar evidências por `test_case_id`
  - Consultar histórico de execução por período

A camada de repositório no front-end deverá substituir o uso de `localStorage` por chamadas a `DatasetFactory.getDataset()` usando essas constraints, mantendo o restante da aplicação inalterado.

## Diagrama textual

```
test_plans
 └── test_cases
      ├── test_case_comments
      ├── test_case_execution_history
      ├── evidences
      └── tickets
           ├── ticket_comments
           └── ticket_status_history
```
