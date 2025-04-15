const readline = require('readline');

function autenticar(rl, callback) {
  rl.question('Login: ', (login) => {
    rl.question('Senha: ', (senha) => {
      if (login === 'admin' && senha === 'admin') {
        console.log('Acesso permitido.');
        callback(true);
      } else {
        console.log('Credenciais inválidas.');
        callback(false);
      }
    });
  });
}

module.exports = { autenticar };