const { Usuario, Pedido, ItemPedido } = require('./model/modelosRelacionais.js');
const { Produto } = require('./model/modelosNaoRelacionais.js');

async function testeCompleto() {
  try {
    // 1. Buscar um produto (iPhone)
    const produto = await Produto.findOne({ nome: /iPhone/i });
    
    console.log('📱 PRODUTO SELECIONADO:', produto.nome);
    console.log('📊 Estoque INICIAL:', produto.estoque);
    
    // 2. Buscar usuário
    const usuario = await Usuario.findOne();
    
    // 3. Criar pedido com 2 unidades
    const quantidade = 2;
    const pedido = await Pedido.create({
      status: 'CONCLUIDO',
      valor_total: produto.preco * quantidade,
      usuario_id: usuario.id
    });
    
    // 4. Criar item do pedido
    await ItemPedido.create({
      quantidade: quantidade,
      preco_unitario: produto.preco,
      produto_mongodb_id: produto._id.toString(),
      pedido_id: pedido.id
    });
    
    // 5. Reduzir estoque (simulando a compra)
    produto.estoque -= quantidade;
    await produto.save();
    
    console.log('📊 Estoque APÓS COMPRA:', produto.estoque);
    console.log('\n✅ PEDIDO CRIADO:', pedido.id);
    console.log('\n🔥 AGORA TESTE NO NAVEGADOR:');
    console.log('1. Acesse: http://localhost:3000/pedidos');
    console.log('2. Clique em "Cancelar" no pedido ID:', pedido.id);
    console.log('3. Volte para http://localhost:3000 e veja o estoque');
    console.log('\n📈 Estoque esperado após cancelamento:', produto.estoque + quantidade);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Erro:', error);
    process.exit(1);
  }
}

testeCompleto();
