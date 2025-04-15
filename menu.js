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
        else retornarMenu();
      });
      break;
    case '4':
      exportarCSV(estoque);
      retornarMenu();
      break;
    case '5':
      rl.question('Digite a data (YYYY-MM-DD): ', data => {
        const filtrados = filtrarPorData(estoque, data);
        console.log(filtrados);
        retornarMenu();
      });
      break;
    case '6':
      console.log('Saindo...');
      rl.close();
      break;
    default:
      console.log('Opção inválida.');
      retornarMenu();
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
        retornarMenu();
      });
    });
  });
}

function verificarEstoque() {
  console.log('\n1. Buscar por código');
  console.log('2. Buscar por nome');
  console.log('3. Ver tudo');
  rl.question('Escolha uma opção: ', op => {
    switch (op.trim()) {
      case '1':
        rl.question('Código do item: ', cod => {
          const encontrado = estoque.find(i => i.codigo === cod);
          console.log(encontrado || 'Item não encontrado.');
          retornarMenu();
        });
        break;
      case '2':
        rl.question('Nome do item: ', nome => {
          const encontrados = estoque.filter(i => i.nome.toLowerCase().includes(nome.toLowerCase()));
          console.log(encontrados.length ? encontrados : 'Nenhum item encontrado.');
          retornarMenu();
        });
        break;
      case '3':
        console.log(estoque);
        retornarMenu();
        break;
      default:
        console.log('Opção inválida.');
        verificarEstoque();
        break;
    }

    // var seg = 10

    // console.log(`retornando ao menu em:`);

    // setInterval(() => {
    //     --seg;
    //     console.log(`${seg} segundos...`)
    // }, 1000);

    // setTimeout(()=>{
    //     retornarMenu();
    // }, 10000)

  });
}

function editarEstoque() {
  verificarEstoque();
  rl.question('Digite o código do item que deseja editar: ', cod => {
    const item = estoque.find(i => i.codigo === cod);
    if (!item) {
      console.log('Item não encontrado.');
      return retornarMenu();
    }

    console.log('\n1. Alterar quantidade');
    console.log('2. Alterar descrição');
    rl.question('Escolha uma opção: ', op => {
      switch (op.trim()) {
        case '1':
          rl.question('Nova quantidade: ', qtd => {
            item.quantidade = parseInt(qtd);
            item.data = new Date().toISOString().split('T')[0];
            salvarEstoque(estoque);
            console.log('Quantidade atualizada.');
            retornarMenu();
          });
          break;
        case '2':
          rl.question('Nova descrição: ', desc => {
            item.descricao = desc;
            item.data = new Date().toISOString().split('T')[0];
            salvarEstoque(estoque);
            console.log('Descrição atualizada.');
            retornarMenu();
          });
          break;
        default:
          console.log('Opção inválida.');
          editarEstoque();
          break;
      }
    });
  });
}

function retornarMenu() {
  sleep(2000).then(() => {
    console.clear();
    mostrarMenu();
  });
}

module.exports = { mostrarMenu };