const { DataTypes, Model } = require('sequelize');
const sequelize = require('./serverRelacional.js');

// Modelo Usuario
class Usuario extends Model { }
Usuario.init(
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true, allowNull: false },
    nome: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, allowNull: false, unique: true },
    senha: { type: DataTypes.STRING, allowNull: false },
  },
  {
    sequelize,
    freezeTableName: true,
    createdAt: 'criado_em',
    updatedAt: 'atualizado_em',
  }
);

// Modelo Pedido
class Pedido extends Model { }
Pedido.init(
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true, allowNull: false },
    status: { type: DataTypes.STRING, allowNull: false, defaultValue: 'PENDENTE' },
    valor_total: { type: DataTypes.FLOAT, allowNull: false, defaultValue: 0.0 },
  },
  {
    sequelize,
    freezeTableName: true,
    createdAt: 'criado_em',
    updatedAt: 'atualizado_em',
  }
);

// Modelo ItemPedido
class ItemPedido extends Model { }
ItemPedido.init(
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true, allowNull: false },
    quantidade: { type: DataTypes.INTEGER, allowNull: false },
    preco_unitario: { type: DataTypes.FLOAT, allowNull: false },
    produto_mongodb_id: { type: DataTypes.STRING, allowNull: false },
  },
  {
    sequelize,
    freezeTableName: true,
    createdAt: 'criado_em',
    updatedAt: 'atualizado_em',
  }
);

// Relacionamento 1:N entre Usuario e Pedido
Usuario.hasMany(Pedido, {
  onDelete: 'CASCADE',
  onUpdate: 'RESTRICT',
  foreignKey: {
    name: 'usuario_id',
    allowNull: false,
  },
});
Pedido.belongsTo(Usuario, {
  foreignKey: {
    name: 'usuario_id',
  },
});

// Relacionamento 1:N entre Pedido e ItemPedido
Pedido.hasMany(ItemPedido, {
  onDelete: 'CASCADE',
  onUpdate: 'RESTRICT',
  foreignKey: {
    name: 'pedido_id',
    allowNull: false,
  },
});
ItemPedido.belongsTo(Pedido, {
  foreignKey: {
    name: 'pedido_id',
  },
});

// Sincronização com o banco de dados
sequelize.sync({ alter: true }).then(() => {
  console.log('Modelos relacionais sincronizados com o banco de dados.');
}).catch((error) => {
  console.error('Erro ao sincronizar modelos relacionais com o banco de dados: ', error);
});

module.exports = { Usuario, Pedido, ItemPedido };
