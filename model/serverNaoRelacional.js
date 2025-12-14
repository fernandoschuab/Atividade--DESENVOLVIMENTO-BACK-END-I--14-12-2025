const mongoose = require('mongoose');

// string de conexão com o banco de dados MongoDB
mongoose.connect('mongodb://localhost:27017/ecommerce')
  .then(() => {
    console.log('Conexão com banco de dados não relacional estabelecida com sucesso.');
  }).catch((error) => {
    console.error('Erro ao se conectar ao banco de dados não relacional: ', error);
  });

module.exports = mongoose;
