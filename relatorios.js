const fs = require('fs');
const path = require('path');

function exportarCSV(estoque) {
  const header = 'Nome,Código,Quantidade,Descrição,Data de Atualização';
  const linhas = estoque.map(item =>
    `${item.nome},${item.codigo},${item.quantidade},"${item.descricao}",${item.data}`
  );
  const csv = [header, ...linhas].join('\n');
  fs.writeFileSync('./relatorio.csv', csv, 'utf-8');
  console.log('Relatório CSV gerado como relatorio.csv');
}

function filtrarPorData(estoque, data) {
  return estoque.filter(item => item.data.startsWith(data));
}

module.exports = {
  exportarCSV,
  filtrarPorData
};