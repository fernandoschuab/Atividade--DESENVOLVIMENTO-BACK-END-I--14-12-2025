const { Usuario, Pedido, ItemPedido } = require('../model/modelosRelacionais.js');
const { Produto } = require('../model/modelosNaoRelacionais.js');

const index = async (req, res) => {
  try {
    const produtos = await Produto.find()
      .select('nome preco estoque')
      .limit(8);

    res.render('index', {
      produtos: produtos,
      temProdutos: produtos.length > 0
    });
  } catch (error) {
    console.error('Erro ao buscar produtos: ' + error.message);
    res.render('index', { produtos: [], temProdutos: false });
  }
};

const povoamento = async (req, res) => {
  try {
    await Usuario.destroy({ where: {} });
    await Produto.deleteMany({});

    await Usuario.create({ nome: 'João Silva', email: 'joao@email.com', senha: '123456' });
    await Usuario.create({ nome: 'Maria Santos', email: 'maria@email.com', senha: '123456' });
    await Usuario.create({ nome: 'Pedro Oliveira', email: 'pedro@email.com', senha: '123456' });

    await Produto.create({
      nome: 'Notebook Dell Inspiron',
      preco: 3500.00,
      estoque: 15,
      detalhes: {
        processador: 'Intel Core i5',
        memoria: '8GB RAM',
        armazenamento: '512GB SSD',
        tela: '15.6 polegadas'
      }
    });

    await Produto.create({
      nome: 'PC Gamer AMD Ryzen',
      preco: 4500.00,
      estoque: 8,
      detalhes: {
        processador: 'AMD Ryzen 5',
        memoria: '16GB RAM',
        armazenamento: '1TB SSD',
        placaVideo: 'NVIDIA GTX 1660'
      }
    });

    await Produto.create({
      nome: 'iPhone 13 Pro',
      preco: 6500.00,
      estoque: 20,
      detalhes: {
        tela: '6.1 polegadas',
        camera: '12MP tripla',
        bateria: '3095mAh',
        cor: 'Azul Sierra'
      }
    });

    await Produto.create({
      nome: 'Samsung Galaxy S21',
      preco: 3200.00,
      estoque: 25,
      detalhes: {
        tela: '6.2 polegadas',
        camera: '64MP tripla',
        bateria: '4000mAh',
        cor: 'Preto'
      }
    });

    await Produto.create({
      nome: 'Tablet iPad Air',
      preco: 4200.00,
      estoque: 12,
      detalhes: {
        tela: '10.9 polegadas',
        processador: 'Apple M1',
        armazenamento: '256GB',
        cor: 'Cinza Espacial'
      }
    });

    await Produto.create({
      nome: 'Computador iMac 24"',
      preco: 9500.00,
      estoque: 5,
      detalhes: {
        processador: 'Apple M1',
        memoria: '8GB RAM',
        armazenamento: '512GB SSD',
        tela: '24 polegadas Retina'
      }
    });

    await Produto.create({
      nome: 'Smartphone Xiaomi Redmi Note 11',
      preco: 1800.00,
      estoque: 30,
      detalhes: {
        tela: '6.43 polegadas',
        camera: '50MP quádrupla',
        bateria: '5000mAh',
        cor: 'Azul'
      }
    });

    await Produto.create({
      nome: 'Notebook MacBook Pro',
      preco: 12000.00,
      estoque: 7,
      detalhes: {
        processador: 'Apple M2',
        memoria: '16GB RAM',
        armazenamento: '1TB SSD',
        tela: '14 polegadas Retina'
      }
    });

    await Produto.create({
      nome: 'Tablet Samsung Galaxy Tab S8',
      preco: 3800.00,
      estoque: 9,
      detalhes: {
        tela: '11 polegadas',
        processador: 'Snapdragon 8 Gen 1',
        armazenamento: '128GB',
        cor: 'Grafite'
      }
    });

    await Produto.create({
      nome: 'Celular Motorola Edge 30',
      preco: 2500.00,
      estoque: 18,
      detalhes: {
        tela: '6.5 polegadas',
        camera: '50MP tripla',
        bateria: '4020mAh',
        cor: 'Verde'
      }
    });

    res.redirect('/');
  } catch (error) {
    console.error('Erro ao povoar banco de dados: ' + error.message);
    res.status(500).send('Erro ao povoar banco de dados');
  }
};

const detalhes = async (req, res) => {
  try {
    const produto = await Produto.findById(req.params.id);

    if (!produto) {
      return res.status(404).send('Produto não encontrado');
    }

    res.render('detalhes', { produto: produto });
  } catch (error) {
    console.error('Erro ao buscar detalhes do produto: ' + error.message);
    res.status(500).send('Erro ao buscar detalhes do produto');
  }
};

const comprar = async (req, res) => {
  try {
    const produto = await Produto.findById(req.params.id)
      .select('nome preco estoque');

    if (!produto) {
      return res.status(404).send('Produto não encontrado');
    }

    res.render('comprar', { produto: produto });
  } catch (error) {
    console.error('Erro ao carregar tela de compra: ' + error.message);
    res.status(500).send('Erro ao carregar tela de compra');
  }
};

const finalizarCompra = async (req, res) => {
  try {
    const produto = await Produto.findById(req.params.id);
    const quantidade = parseInt(req.body.quantidade);

    if (!produto) {
      return res.status(404).send('Produto não encontrado');
    }

    if (quantidade > produto.estoque) {
      return res.status(400).send('Quantidade solicitada maior que o estoque disponível');
    }

    const usuario = await Usuario.findOne();

    if (!usuario) {
      return res.status(404).send('Nenhum usuário encontrado');
    }

    const valorTotal = produto.preco * quantidade;
    const pedido = await Pedido.create({
      status: 'CONCLUIDO',
      valor_total: valorTotal,
      usuario_id: usuario.id
    });

    await ItemPedido.create({
      quantidade: quantidade,
      preco_unitario: produto.preco,
      produto_mongodb_id: produto._id.toString(),
      pedido_id: pedido.id
    });

    produto.estoque -= quantidade;
    await produto.save();

    res.render('confirmacao', {
      usuario: usuario,
      produto: produto,
      quantidade: quantidade,
      valorTotal: valorTotal
    });
  } catch (error) {
    console.error('Erro ao finalizar compra: ' + error.message);
    res.status(500).send('Erro ao finalizar compra');
  }
};

const dashboard = async (req, res) => {
  try {
    const totalProdutos = await Produto.countDocuments();
    const baixoEstoque = await Produto.countDocuments({ estoque: { $lt: 10 } });

    const computadores = await Produto.countDocuments({
      nome: { $regex: /computador|pc|notebook/i }
    });

    const dispositivosMoveis = await Produto.countDocuments({
      nome: { $regex: /celular|iphone|tablet|smartphone/i }
    });

    const preco0a100 = await Produto.countDocuments({ preco: { $gte: 0, $lte: 100 } });
    const preco101a1000 = await Produto.countDocuments({ preco: { $gte: 101, $lte: 1000 } });
    const preco1001a5000 = await Produto.countDocuments({ preco: { $gte: 1001, $lte: 5000 } });
    const precoAcima5000 = await Produto.countDocuments({ preco: { $gt: 5000 } });

    res.render('dashboard', {
      totalProdutos,
      baixoEstoque,
      computadores,
      dispositivosMoveis,
      preco0a100,
      preco101a1000,
      preco1001a5000,
      precoAcima5000
    });
  } catch (error) {
    console.error('Erro ao carregar dashboard: ' + error.message);
    res.status(500).send('Erro ao carregar dashboard');
  }
};

const gerenciarPedidos = async (req, res) => {
  try {
    const pedidos = await Pedido.findAll({
      where: {
        status: ['CONCLUIDO', 'CANCELADO', 'SUSPENSO']
      },
      include: [
        {
          model: Usuario,
          attributes: ['nome']
        },
        {
          model: ItemPedido,
          attributes: ['id', 'quantidade']
        }
      ],
      order: [['criado_em', 'DESC']]
    });

    const pedidosFormatados = pedidos.map(pedidoInstance => {
      const pedido = pedidoInstance.get({ plain: true });

      const itens = Array.isArray(pedido.ItemPedidos) ? pedido.ItemPedidos : [];

      const totalUnidades = itens.reduce((sum, item) => sum + item.quantidade, 0);

      return {
        id: pedido.id,
        diaCriacao: new Date(pedido.criado_em).toLocaleDateString('pt-BR'),
        nomeUsuario: pedido.Usuario ? pedido.Usuario.nome : 'N/A',
        diaAtualizacao: new Date(pedido.atualizado_em).toLocaleDateString('pt-BR'),
        valorTotal: pedido.valor_total.toFixed(2),
        numProdutos: totalUnidades,
        status: pedido.status
      };
    });

    res.render('gerenciarPedidos', { pedidos: pedidosFormatados });
  } catch (error) {
    console.error('Erro ao carregar gerenciamento de pedidos: ' + error.message);
    res.status(500).send('Erro ao carregar gerenciamento de pedidos');
  }
};

const atualizarStatus = async (req, res) => {
  try {
    const pedidoId = req.params.id;
    const novoStatus = req.params.status.toUpperCase();

    const pedido = await Pedido.findByPk(pedidoId, {
      include: [{
        model: ItemPedido,
        attributes: ['id', 'quantidade', 'produto_mongodb_id']
      }]
    });

    if (!pedido) {
      return res.status(404).send('Pedido não encontrado');
    }

    if (pedido.status === 'CANCELADO') {
      return res.status(400).send('Não é possível alterar o status de um pedido cancelado');
    }

    if (novoStatus === 'CANCELADO') {
      if (pedido.ItemPedidos && pedido.ItemPedidos.length > 0) {
        for (let i = 0; i < pedido.ItemPedidos.length; i++) {
          const item = pedido.ItemPedidos[i];

          try {
            const produto = await Produto.findById(item.produto_mongodb_id);

            if (produto) {
              produto.estoque += item.quantidade;
              await produto.save();
            } else {
              console.error('Erro: Produto não encontrado no MongoDB para ID ' + item.produto_mongodb_id);
            }
          } catch (errorItem) {
            console.error('Erro ao processar item: ' + errorItem.message);
          }
        }
      }
    }

    await Pedido.update(
      { status: novoStatus },
      { where: { id: pedidoId } }
    );

    res.redirect('/pedidos');
  } catch (error) {
    console.error('Erro ao atualizar status do pedido: ' + error.message);
    res.status(500).send('Erro ao atualizar status do pedido: ' + error.message);
  }
};

module.exports = {
  index,
  povoamento,
  detalhes,
  comprar,
  finalizarCompra,
  dashboard,
  gerenciarPedidos,
  atualizarStatus
};
