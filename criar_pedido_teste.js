const { Usuario, Pedido, ItemPedido } = require('./model/modelosRelacionais.js');
const { Produto } = require('./model/modelosNaoRelacionais.js');

async function criarPedidoTeste() {
  try {
    // Buscar um produto
    const produto = await Produto.findOne({ nome: /Samsung/i });
    
    if (!produto) {
      console.log('❌ Produto não encontrado');
      process.exit(1);
    }
    
    console.log('\n📦 PRODUTO SELECIONADO:');
    console.log('Nome:', produto.nome);
    console.log('Estoque ANTES:', produto.estoque);
    
    // Buscar usuário
    const usuario = await Usuario.findOne();
    
    // Criar pedido de teste com 3 unidades
    const quantidade = 3;
    const pedido = await Pedido.create({
      status: 'CONCLUIDO',
      valor_total: produto.preco * quantidade,
      usuario_id: usuario.id
    });
    
    // Criar item do pedido
    await ItemPedido.create({
      quantidade: quantidade,
      preco_unitario: produto.preco,
      produto_mongodb_id: produto._id.toString(),
      pedido_id: pedido.id
    });
    
    // Reduzir estoque
    produto.estoque -= quantidade;
    await produto.save();
    
    console.log('Estoque DEPOIS:', produto.estoque);
    console.log('\n✅ PEDIDO CRIADO:', pedido.id);
    console.log('Status:', pedido.status);
    console.log('Quantidade:', quantidade);
    console.log('\n🔴 Agora você pode cancelar o pedido ID:', pedido.id);
    console.log('URL: http://localhost:3000/pedidos/' + pedido.id + '/CANCELADO');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Erro:', error);
    process.exit(1);
  }
}

criarPedidoTeste();
