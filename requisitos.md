# Qual o problema que eu quero resolver?

-- O problema que eu quero resolver é a descentralização dos testes e registros de bugs de formulários em validação.

# Como resolver?

-- Vou criar um formulário no Fluig para registrar e enviar os casos de testes dos formulários para os DEVs responsáveis.

# Requisitos:

-- Formulário no Fluig com as seguintes funcionalidades:
    - Criar projetos de Teste ()
    - Criar teste Run ligados ao Projeto ()
    - Criar test case ligados as Run ()
    - Ter fluxo de aprovação e envio das Run ()
    - Possibilidade de salvar Test Run de forma parcial ()
    - *Desejavél (porém desafiador para implementar) anexar evidência dos testes () 

## Requisitos não Funcionais:
    
    - Ter sistema de vínculo entre: Projetos - Test Run - Test Case - ()
    - A tela inicial deve conter um campo Zoom para escolher o projeto - ():
        - Deve ter uma tabela no banco para os projetos - ()
    - Ao escolher o projeto o usuário escolhe alguma Test Run vinculada ao projeto - ()
        - Criar tabela de Test Run e vincular com a tabela de projetos - ()
    - Ao escolher a test Run os Test Cases são exibidos - ()
        - Criar tabela de Test Case e víncular as Test Run - ()
    - Por Test Run poder escolher o destinatario que irá resolver os bugs - ()
    - Ter fluxo de aprovação e reprovação das Test Run, além de contar com uma aprovação parcial -()


## Funcionalidades:

    - 

# Banco de dados:

tabela DELP_PROJETOTESTE:
ID INT PRIMARY KEY NOT NULL,
NOME_PROJETO VARCHAR (200),
DESCRIÇÃO VARCHA (600),
FORMULARIO_VINCULADO VARCHAR (200),
STATUS INT -- (vou usar sistema de status de 1 a 3) sendo 1 aberto, 2 parcialmente finalizado , 3 finalizado 

tabela DELP_TESTERUN:
ID INT PRIMARY KEY NOT NULL,
ID_PROJETO INT FOREGEKEY com a tabela DELP_PROJETOTESTE,
NUMERO_RUN INT, -- CRIAR SISTEMA DE INCREMENTAR O ID,
STATUS INT -- (vou usar sistema de status de 1 a 3) sendo 1 pendente, 2 parcialmente finalizado , 3 finalizado 
RESPONSAVEL VARCHAR (100) -- aqui vai o login do responsavel vindo direto do Fluig,

tabela DELP_TESTCASE:
ID INT PRIMARY KEY NOT NULL,
ID_PROJETO INT FOREGEKEY com a tabela DELP_PROJETOTESTE CAMPO ID,
ID_RUN INT FOREGEYKEY  com a tabela DELP_TESTRUN CAMPO ID,
NOME_TESTECASE VARCHAR (200),
DESCRICAO_TESTE VARCHAR (600),
NUM_TESTCASE INT,
STATUS INT, -- sendo 1 pendente, 2 parcialmente finalizado , 3 finalizado 
PRIORIDADE VARCHAR (50),
TIPO_TESTE VARCHAR (50),
OBSERVACOES VARCHAR (600),

-- A DEFINIR A PARTE DE EVIDÊNCIA









