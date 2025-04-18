const readline = require('readline');
const { sleep, gerarCodigo } = require('./utils');
const { carregarEstoque, salvarEstoque } = require('./estoque');
const { autenticar } = require('./auth');
const { exportarCSV, filtrarPorData } = require('./relatorios');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

let estoque = carregarEstoque();

function mostrarMenu() {
  console.log('\n=== MENU ===');
  console.log('1. Adicionar ao estoque');
  console.log('2. Verificar no estoque');
  console.log('3. Editar estoque');
  console.log('4. Exportar CSV');
  console.log('5. Relatório por data');
  console.log('6. Sair');
  rl.question('Escolha uma opção: ', opcao => escolherOpcao(opcao));
}

function escolherOpcao(opcao) {
  switch (opcao.trim()) {
    case '1':
      adicionarItem();
      break;
    case '2':
      verificarEstoque();
      break;
    case '3':
      autenticar(rl, (autenticado) => {
        if (autenticado) editarEstoque();
        else voltarOuMenu(mostrarMenu);
      });
      break;
    case '4':
      exportarCSV(estoque);
      voltarOuMenu(mostrarMenu);
      break;
    case '5':
      rl.question('Digite a data (YYYY-MM-DD): ', data => {
        const filtrados = filtrarPorData(estoque, data);
        if (filtrados.length === 0) console.log('Nenhum item encontrado para essa data.');
        else console.log(formatarItens(filtrados));
        voltarOuMenu(mostrarMenu);
      });
      break;
    case '6':
      console.log('Saindo...');
      rl.close();
      break;
    default:
      console.log('Opção inválida.');
      voltarOuMenu(mostrarMenu);
      break;
  }
}

function adicionarItem() {
  rl.question('Nome do item: ', nome => {
    rl.question('Quantidade: ', quantidade => {
      rl.question('Descrição: ', descricao => {
        const novoItem = {
          nome,
          codigo: gerarCodigo(),
          quantidade: parseInt(quantidade),
          descricao,
          data: new Date().toISOString().split('T')[0]
        };
        estoque.push(novoItem);
        salvarEstoque(estoque);
        console.log('Item adicionado com sucesso!');
        voltarOuMenu(mostrarMenu);
      });
    });
  });
}

function verificarEstoque() {
  console.log('\n1. Buscar por código');
  console.log('2. Buscar por nome');
  console.log('3. Ver tudo');
  console.log('4. Voltar ao menu principal');
  rl.question('Escolha uma opção: ', op => {
    switch (op.trim()) {
      case '1':
        rl.question('Código do item: ', cod => {
          const encontrado = estoque.find(i => i.codigo === cod);
          console.log(encontrado ? formatarItens([encontrado]) : 'Item não encontrado.');
          voltarOuMenu(verificarEstoque);
        });
        break;
      case '2':
        rl.question('Nome do item: ', nome => {
          const encontrados = estoque.filter(i => i.nome.toLowerCase().includes(nome.toLowerCase()));
          console.log(encontrados.length ? formatarItens(encontrados) : 'Nenhum item encontrado.');
          voltarOuMenu(verificarEstoque);
        });
        break;
      case '3':
        console.log(estoque.length ? formatarItens(estoque) : 'Estoque vazio.');
        voltarOuMenu(verificarEstoque);
        break;
      case '4':
        mostrarMenu();
        break;
      default:
        console.log('Opção inválida.');
        verificarEstoque();
        break;
    }
  });
}

function editarEstoque() {
  console.log('\n--- Editar Estoque ---');
  verificarEstoque();
  rl.question('Digite o código do item que deseja editar: ', cod => {
    const item = estoque.find(i => i.codigo === cod);
    if (!item) {
      console.log('Item não encontrado.');
      return voltarOuMenu(editarEstoque);
    }

    console.log('\n1. Alterar quantidade');
    console.log('2. Alterar descrição');
    console.log('3. Voltar ao menu principal');
    rl.question('Escolha uma opção: ', op => {
      switch (op.trim()) {
        case '1':
          rl.question('Nova quantidade: ', qtd => {
            item.quantidade = parseInt(qtd);
            item.data = new Date().toISOString().split('T')[0];
            salvarEstoque(estoque);
            console.log('Quantidade atualizada.');
            voltarOuMenu(editarEstoque);
          });
          break;
        case '2':
          rl.question('Nova descrição: ', desc => {
            item.descricao = desc;
            item.data = new Date().toISOString().split('T')[0];
            salvarEstoque(estoque);
            console.log('Descrição atualizada.');
            voltarOuMenu(editarEstoque);
          });
          break;
        case '3':
          mostrarMenu();
          break;
        default:
          console.log('Opção inválida.');
          editarEstoque();
          break;
      }
    });
  });
}

function voltarOuMenu(funcaoSubmenu) {
  rl.question('\nDeseja voltar ao menu principal? (s/n): ', resposta => {
    if (resposta.trim().toLowerCase() === 's') {
      console.clear();
      mostrarMenu();
    } else {
      console.clear();
      funcaoSubmenu();
    }
  });
}

function formatarItens(itens) {
  return itens.map(item => `\n🔹 Nome: ${item.nome}\n🔹 Código: ${item.codigo}\n🔹 Quantidade: ${item.quantidade}\n🔹 Descrição: ${item.descricao}\n🔹 Data: ${item.data}`).join('\n');
}

module.exports = { mostrarMenu };
