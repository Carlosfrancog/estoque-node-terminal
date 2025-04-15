const fs = require('fs');
const path = './estoque.json';
const { arquivoExiste } = require('./utils');

function carregarEstoque() {
  if (!arquivoExiste(path)) fs.writeFileSync(path, '[]', 'utf-8');
  return JSON.parse(fs.readFileSync(path, 'utf-8'));
}

function salvarEstoque(estoque) {
  fs.writeFileSync(path, JSON.stringify(estoque, null, 2), 'utf-8');
}

module.exports = {
  carregarEstoque,
  salvarEstoque
};