const { Pedido, ItemPedido } = require('./model/modelosRelacionais.js');
const { Produto } = require('./model/modelosNaoRelacionais.js');

async function investigar() {
  try {
    // Buscar o pedido 9 (CANCELADO)
    const pedido = await Pedido.findByPk(9, {
      include: [ItemPedido]
    });
    
    console.log('\n🔍 INVESTIGANDO PEDIDO 9:');
    console.log('Status:', pedido.status);
    console.log('Valor total:', pedido.valor_total);
    console.log('Criado em:', pedido.criado_em);
    console.log('Atualizado em:', pedido.atualizado_em);
    
    const item = pedido.ItemPedidos[0];
    console.log('\n📦 ITEM DO PEDIDO:');
    console.log('Quantidade:', item.quantidade);
    console.log('Preço unitário:', item.preco_unitario);
    console.log('Produto MongoDB ID:', item.produto_mongodb_id);
    
    // Buscar o produto
    const notebook = await Produto.findOne({ nome: /Notebook Dell/i });
    console.log('\n💻 NOTEBOOK DELL INSPIRON:');
    console.log('ID MongoDB:', notebook._id.toString());
    console.log('Estoque atual:', notebook.estoque);
    console.log('Preço:', notebook.preco);
    
    // Verificar se os IDs batem
    if (item.produto_mongodb_id === notebook._id.toString()) {
      console.log('\n✅ IDs CONFEREM!');
      console.log('\n❗ PROBLEMA: O pedido foi cancelado ANTES do código de devolução ser implementado!');
      console.log('    Por isso o estoque ficou em 0.');
      console.log('\n💡 SOLUÇÃO: Devolver manualmente ou repovoar o banco de dados.');
    } else {
      console.log('\n⚠️ IDs NÃO CONFEREM!');
      console.log('ID no pedido:', item.produto_mongodb_id);
      console.log('ID do produto:', notebook._id.toString());
    }
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Erro:', error);
    process.exit(1);
  }
}

investigar();
