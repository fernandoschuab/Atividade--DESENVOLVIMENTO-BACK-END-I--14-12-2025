const { Usuario, Pedido, ItemPedido } = require('./model/modelosRelacionais.js');
const { Produto } = require('./model/modelosNaoRelacionais.js');

async function testarCancelamento() {
  try {
    // Listar pedidos existentes
    const pedidos = await Pedido.findAll({
      include: [ItemPedido]
    });
    
    console.log('\n📋 PEDIDOS EXISTENTES:');
    console.log('Total:', pedidos.length);
    
    for (const pedido of pedidos) {
      console.log(`\nPedido ID: ${pedido.id}`);
      console.log(`Status: ${pedido.status}`);
      console.log(`Itens: ${pedido.ItemPedidos.length}`);
      
      for (const item of pedido.ItemPedidos) {
        const produto = await Produto.findById(item.produto_mongodb_id);
        console.log(`  - Produto: ${produto ? produto.nome : 'Não encontrado'}`);
        console.log(`    Quantidade no pedido: ${item.quantidade}`);
        console.log(`    Estoque atual: ${produto ? produto.estoque : 'N/A'}`);
      }
    }
    
    process.exit(0);
  } catch (error) {
    console.error('Erro:', error);
    process.exit(1);
  }
}

testarCancelamento();
