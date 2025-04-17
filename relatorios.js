const fs = require('fs');
const path = require('path');
const { formatarItens } = require('./utils');

function exportarCSV(estoque) {
  const header = 'Nome,Código,Quantidade,Descrição,Data\n';
  const linhas = estoque.map(item => (
    `"${item.nome}","${item.codigo}","${item.quantidade}","${item.descricao}","${item.data}"`
  ));

  fs.writeFileSync(path.join(__dirname, 'estoque.csv'), header + linhas.join('\n'));
  console.log('Estoque exportado para estoque.csv');
}

function isDataValida(data) {
  return /^\d{4}-\d{2}-\d{2}$/.test(data);
}

function normalizarData(input) {
  if (/^\d{2}-\d{2}-\d{4}$/.test(input)) {
    const [dia, mes, ano] = input.split('-');
    return `${ano}-${mes}-${dia}`;
  }
  return input; // já no formato certo
}

function filtrarPorData(estoque, data) {
  if (!isDataValida(data)) {
    console.log('⚠️  Data inválida. Use o formato YYYY-MM-DD (ex: 2025-04-17).');
    return [];
  }

  return estoque.filter(item => item.data && item.data.startsWith(data));
}

module.exports = {
  exportarCSV,
  filtrarPorData,
  normalizarData
};
