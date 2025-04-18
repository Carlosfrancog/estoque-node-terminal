const fs = require('fs');

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function gerarCodigo() {
  const { carregarEstoque } = require('./estoque');
  const estoque = carregarEstoque();
  let codigo;
  let codigoExistente;

  do {
    codigo = Math.floor(1000 + Math.random() * 9000).toString();
    codigoExistente = estoque.find(item => item.codigo === codigo);
  } while (codigoExistente);

  return codigo;
}

function arquivoExiste(caminho) {
  return fs.existsSync(caminho);
}

module.exports = {
  sleep,
  gerarCodigo,
  arquivoExiste
};