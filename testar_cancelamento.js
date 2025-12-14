const { Pedido, ItemPedido } = require('./model/modelosRelacionais.js');
const { Produto } = require('./model/modelosNaoRelacionais.js');

async function testarCancelamento() {
  try {
    const pedidoId = 10;
    const novoStatus = 'CANCELADO';
    
    // Buscar o pedido
    const pedido = await Pedido.findByPk(pedidoId, {
      include: [ItemPedido]
    });
    
    if (!pedido) {
      console.log('❌ Pedido não encontrado');
      process.exit(1);
    }
    
    console.log('\n🔴 INICIANDO CANCELAMENTO DO PEDIDO:', pedidoId);
    console.log('Status atual:', pedido.status);
    console.log('📦 Itens do pedido:', pedido.ItemPedidos.length);
    
    // Se o novo status for CANCELADO, devolver produtos ao estoque
    if (novoStatus === 'CANCELADO') {
      for (const item of pedido.ItemPedidos) {
        console.log('\n📦 Processando item:', {
          id: item.id,
          produto_mongodb_id: item.produto_mongodb_id,
          quantidade: item.quantidade
        });
        
        const produto = await Produto.findById(item.produto_mongodb_id);
        
        if (produto) {
          const estoqueAntes = produto.estoque;
          produto.estoque += item.quantidade;
          await produto.save();
          
          console.log('✅ Produto atualizado:', {
            nome: produto.nome,
            estoqueAntes: estoqueAntes,
            estoqueDepois: produto.estoque,
            quantidadeDevolvida: item.quantidade
          });
        } else {
          console.log('⚠️ Produto não encontrado no MongoDB:', item.produto_mongodb_id);
        }
      }
      
      console.log('\n✅ Devolução de estoque concluída!');
    }
    
    // Atualizar status
    await Pedido.update(
      { status: novoStatus },
      { where: { id: pedidoId } }
    );
    
    console.log('✅ Status do pedido atualizado para:', novoStatus);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Erro:', error);
    process.exit(1);
  }
}

testarCancelamento();
