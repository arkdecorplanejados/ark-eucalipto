import { Router, Request, Response, NextFunction } from 'express';
import { db } from '../lib/firebase.js';
import admin from 'firebase-admin'; // ⚙️ Importado para gerar o serverTimestamp oficial

const router = Router();

// 1. Rota para Listar todos os Leads de Prospecção (Usada no painel admin)
router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const leadsSnapshot = await db.collection('leads').orderBy('createdAt', 'desc').get();
    
    const leads = leadsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    res.status(200).json(leads);
  } catch (error) {
    next(error);
  }
});

// 🔵 1B. Rota para Listar os e-mails da Newsletter (Usada na aba do Admin)
// GET http://localhost:3001/api/leads/newsletter
router.get('/newsletter', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const newsletterSnapshot = await db.collection('newsletter').orderBy('dataInscricao', 'desc').get();
    
    const emailsCapturados = newsletterSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    res.status(200).json(emailsCapturados);
  } catch (error) {
    next(error);
  }
});

// 📥 1C. Rota de Salvamento da Newsletter vinda do site
// POST http://localhost:3001/api/leads/newsletter
router.post('/newsletter', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email } = req.body;

    if (!email) {
       res.status(400).json({ error: 'O campo e-mail é obrigatório.' });
       return;
    }

    const emailTratado = email.trim().toLowerCase();
    const newsletterRef = db.collection('newsletter');

    // 🛡️ Proteção anti-duplicidade de e-mail
    const querySnapshot = await newsletterRef.where('email', '==', emailTratado).get();
    if (!querySnapshot.empty) {
       res.status(200).json({ message: 'Este e-mail já está cadastrado no informativo da Ark.' });
       return;
    }

    // 💾 Salva com segurança na mesma coleção que o Admin lê
    await newsletterRef.add({
      email: emailTratado,
      dataInscricao: admin.firestore.FieldValue.serverTimestamp()
    });

    res.status(201).json({ message: 'Inscrição realizada com sucesso!' });
  } catch (error) {
    next(error);
  }
});

// 2. Rota para Criar um novo Lead (Com trava Anti-Duplicidade Blindada e Mapeamento Unificado)
router.post('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    // 🛡️ Mapeamento preventivo inteligente que suporta tanto o Robô (Payload em Inglês) quanto o Formulário (Payload em Português)
    const rawCompanyName = req.body.companyName || req.body.empresa || req.body.nome || req.body.title;
    const rawSegment = req.body.segment || req.body.categoria || req.body.segmento;

    if (!rawCompanyName || !rawSegment) {
       res.status(400).json({ error: 'Nome da empresa/cliente e segmento são obrigatórios.' });
       return;
    }

    const nomeTratado = rawCompanyName.trim();
    const segmentoTratado = rawSegment.trim().toUpperCase();
    const leadsRef = db.collection('leads');

    // 🔒 TRAVA ANTIDUPLICIDADE BLINDADA: Busca exata pelo nome limpo para evitar cópias no Firebase
    const querySnapshot = await leadsRef.where('companyName', '==', nomeTratado).get();
    
    if (!querySnapshot.empty) {
      // Se já existir qualquer registro com esse mesmo nome, barra a inserção imediatamente
      res.status(200).json({ 
        message: `A empresa "${nomeTratado}" já consta no barramento estratégico da Ark. Ignorando duplicata.`,
        id: querySnapshot.docs[0].id,
        ...querySnapshot.docs[0].data()
      });
      return;
    }

    // Extração flexível dos campos restantes do corpo da requisição
    const contactName = req.body.contactName || req.body.nome || null;
    const phone = req.body.phone || req.body.telefone || null;
    const email = req.body.email || null;
    const location = req.body.location || req.body.origem || 'Não informada';
    const aiScore = req.body.aiScore || 0;
    const aiJustification = req.body.aiJustification || req.body.mensagem || null;

    const newLead = {
      companyName: nomeTratado,
      segment: segmentoTratado, // EX: TRATADO, RURAL, FAZENDA, INDUSTRIA_CERCA
      contactName: contactName ? contactName.trim() : null,
      phone: phone || null,
      email: email ? email.trim().toLowerCase() : null,
      location: location,
      status: 'NEW', 
      aiScore: aiScore,
      aiJustification: aiJustification || null,
      createdAt: admin.firestore.FieldValue.serverTimestamp(), // ⚙️ ServerTimestamp nativo e seguro
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    };

    const docRef = await leadsRef.add(newLead);

    res.status(201).json({
      id: docRef.id,
      message: 'Lead de Eucalipto cadastrado com sucesso!',
      ...newLead
    });
  } catch (error) {
    next(error);
  }
});

export default router;