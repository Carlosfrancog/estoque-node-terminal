# Documentação Detalhada - Sistema de Estoque Node.js (Terminal)

Este documento detalha os arquivos e funcionalidades do sistema de controle de estoque desenvolvido em Node.js com execução via terminal.

---

## menu.js

Controla toda a interface com o usuário via terminal.

### Funções principais:

- **mostrarMenu()**
  - Exibe as opções do menu principal para o usuário.
  - Utiliza `readline` para interação via terminal.

- **escolherOpcao(opcao)**
  - Direciona a escolha do usuário para a ação correspondente:
    - Adicionar item
    - Verificar estoque
    - Editar (requer autenticação)
    - Exportar para CSV
    - Gerar relatório por data
    - Sair

- **adicionarItem()**
  - Solicita nome, quantidade e descrição ao usuário.
  - Gera um código único e insere data atual.
  - Salva no arquivo `estoque.json`.

- **verificarEstoque()**
  - Opções:
    - Buscar por código
    - Buscar por nome
    - Listar todos os itens

- **editarEstoque()**
  - Ação restrita (requer autenticação).
  - Permite alterar quantidade ou descrição de um item com base no código.

- **voltarOuMenu(funcaoSubmenu)**
  - Pergunta se o usuário deseja voltar ao menu principal ou repetir a operação anterior.

- **formatarItens(itens)**
  - Retorna uma string formatada com os dados dos itens (Nome, Código, Quantidade, etc.).

---

## main.js

- Ponto de entrada da aplicação.
- Executa `mostrarMenu()` ao iniciar.

---

## estoque.js

Gerencia a persistência do estoque em arquivo JSON.

### Funções:

- **carregarEstoque()**
  - Lê o arquivo `estoque.json`.
  - Cria um arquivo vazio se não existir.

- **salvarEstoque(estoque)**
  - Salva o estoque no formato JSON formatado.

---

## auth.js

Realiza a autenticação simples via terminal.

- **autenticar(rl, callback)**
  - Solicita login e senha.
  - Retorna `true` via callback se for `admin/admin`, senão `false`.

---

## utils.js

Funções auxiliares reutilizáveis.

- **sleep(ms)**
  - Espera assíncrona.

- **gerarCodigo()**
  - Gera um código aleatório de 4 dígitos, único dentro do estoque.

- **arquivoExiste(caminho)**
  - Verifica se o arquivo existe.

---

## relatorio.js

Gera relatórios e exportações.

### Funções:

- **exportarCSV(estoque)**
  - Gera `estoque.csv` com os dados do estoque.

- **isDataValida(data)**
  - Verifica se a data está no formato `YYYY-MM-DD`.

- **normalizarData(input)**
  - Converte data de `DD-MM-YYYY` para `YYYY-MM-DD`, se necessário.

- **filtrarPorData(estoque, data)**
  - Retorna os itens com data que começa com o valor informado.

---

## estoque.json

- Arquivo onde o estoque é armazenado localmente.
- Formato: Array de objetos JSON com:
  ```json
  {
    "nome": "Cabo HDMI",
    "codigo": "1234",
    "quantidade": 5,
    "descricao": "Cabo HDMI 2.0 1.5m",
    "data": "2025-04-17"
  }
  ```

---

## estoque.csv

- Arquivo gerado por `exportarCSV` contendo os itens do estoque no formato tabular:
  ```csv
  Nome,Código,Quantidade,Descrição,Data
  Cabo HDMI,1234,5,"Cabo HDMI 2.0 1.5m",2025-04-17
  ```
------------------------------------------------------------------------------------------------------
