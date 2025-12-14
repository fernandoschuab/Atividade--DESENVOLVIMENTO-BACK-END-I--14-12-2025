const { Produto } = require('./model/modelosNaoRelacionais.js');

async function corrigirEstoque() {
  try {
    const notebook = await Produto.findOne({ nome: /Notebook Dell/i });
    
    console.log('\n🔧 CORRIGINDO ESTOQUE DO NOTEBOOK DELL:');
    console.log('Estoque ANTES:', notebook.estoque);
    
    // Devolver as 15 unidades do pedido cancelado
    notebook.estoque = 15;
    await notebook.save();
    
    console.log('Estoque DEPOIS:', notebook.estoque);
    console.log('\n✅ Estoque corrigido com sucesso!');
    
    // Verificar todos os produtos
    console.log('\n📋 ESTOQUE DE TODOS OS PRODUTOS:');
    const produtos = await Produto.find().select('nome estoque');
    
    for (const prod of produtos) {
      const status = prod.estoque > 0 ? '✅' : '⚠️';
      console.log(`${status} ${prod.nome}: ${prod.estoque} unidades`);
    }
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Erro:', error);
    process.exit(1);
  }
}

corrigirEstoque();
