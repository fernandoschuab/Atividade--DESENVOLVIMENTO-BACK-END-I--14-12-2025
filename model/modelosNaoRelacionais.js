const mongoose = require('./serverNaoRelacional.js');

const ProdutoSchema = new mongoose.Schema({
  nome: { type: String, required: true },
  preco: { type: Number, required: true },
  estoque: { type: Number, required: true, min: 0 },
  detalhes: { type: mongoose.Schema.Types.Mixed }
}, {
  collection: 'Produto',
  timestamps: {
    createdAt: 'criado_em',
    updatedAt: 'atualizado_em'
  },
});

// Criar índice para pesquisa de texto
ProdutoSchema.index({ nome: 'text' });

const Produto = mongoose.model('Produto', ProdutoSchema);

module.exports = { Produto };
