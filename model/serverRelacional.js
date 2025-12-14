const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(
  'ecommerce', // nome da base de dados
  'fullstack', // nome do usuário do banco de dados
  'senha_fullstack', // senha do usuário
  {
    host: 'localhost', // endereço do BD
    dialect: 'mysql' // tipo BD
  }
);

sequelize.authenticate().then(() => {
  console.log('Conexão com banco de dados relacional estabelecida com sucesso.');
}).catch((error) => {
  console.error('Erro ao se conectar ao banco de dados relacional: ', error);
});

module.exports = sequelize;
