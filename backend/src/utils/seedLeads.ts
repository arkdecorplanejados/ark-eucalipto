import { db } from '../lib/firebase.js';

async function cadastrarLeadsTeste() {
  console.log('⏳ Inserindo leads de teste no Firebase...');

  const leadsTeste = [
    {
      companyName: 'Fazenda Vale do Eucalipto',
      segment: 'FAZENDA',
      contactName: 'Ronaldo Silveira',
      phone: '(77) 99999-1111',
      email: 'contato@valedoeucalipto.com.br',
      location: 'Vitória da Conquista - BA',
      status: 'NEW',
      aiScore: 92,
      aiJustification: 'Grande produtor rural com demanda ativa por estacas de eucalipto tratado.',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      companyName: 'Indústria de Cercas Conquista',
      segment: 'INDUSTRIA_CERCA',
      contactName: 'Carlos Eduardo',
      phone: '(77) 98888-2222',
      email: 'compras@cercasconquista.com.br',
      location: 'Vitória da Conquista - BA',
      status: 'NEW',
      aiScore: 88,
      aiJustification: 'Fábrica de mourões necessitando de fornecimento constante de madeira.',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  ];

  try {
    // Usando a instância do Firestore para injetar os dados
    for (const lead of leadsTeste) {
      const docRef = await db.collection('leads').add(lead);
      console.log(`✅ Lead inserido com sucesso! ID: ${docRef.id} (${lead.companyName})`);
    }
    console.log('\n🚀 Todos os leads de teste foram injetados no Firebase!');
  } catch (error) {
    console.error('❌ Erro ao inserir leads:', error);
  }
}

cadastrarLeadsTeste();