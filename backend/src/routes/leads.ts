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

// 2. Rota para Criar um novo Lead (Com trava Anti-Duplicidade Blindada para o Robô de IA)
router.post('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    // 🛡️ Mapeamento preventivo caso a IA mude o nome da chave da propriedade no payload
    const rawCompanyName = req.body.companyName || req.body.nome || req.body.title;
    const rawSegment = req.body.segment || req.body.categoria || req.body.segmento;

    if (!rawCompanyName || !rawSegment) {
       res.status(400).json({ error: 'Nome da empresa e segmento são obrigatórios.' });
       return;
    }

    const nomeTratado = rawCompanyName.trim();
    const segmentoTratado = rawSegment.trim().toUpperCase();
    const leadsRef = db.collection('leads');

    // 🔒 TRAVA ANTIDUPLICIDADE BLINDADA: Busca exata pelo nome limpo
    const querySnapshot = await leadsRef.where('companyName', '==', nomeTratado).get();
    
    if (!querySnapshot.empty) {
      // Se já existir qualquer registro com esse mesmo nome, barra o robô imediatamente
      res.status(200).json({ 
        message: `A empresa "${nomeTratado}" já consta no barramento estratégico da Ark. Ignorando duplicata.`,
        id: querySnapshot.docs[0].id,
        ...querySnapshot.docs[0].data()
      });
      return;
    }

    const { 
      contactName, 
      phone, 
      email, 
      location, 
      aiScore, 
      aiJustification 
    } = req.body;

    const newLead = {
      companyName: nomeTratado,
      segment: segmentoTratado, // FAZENDA, INDUSTRIA_CERCA, etc.
      contactName: contactName || null,
      phone: phone || null,
      email: email || null,
      location: location || 'Não informada',
      status: 'NEW', 
      aiScore: aiScore || 0,
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