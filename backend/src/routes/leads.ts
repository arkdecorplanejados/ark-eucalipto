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

// 📥 1C. NOVA ROTA ADICIONADA: Salva o e-mail vindo do site usando a rota certa (Acaba com o 404)
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

    // 🛡️ Proteção anti-duplicidade direta pela instância oficial da lib
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

// 2. Rota para Criar um novo Lead (Usada manualmente ou pelo robô de IA de Prospecção)
router.post('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { 
      companyName, 
      segment, 
      contactName, 
      phone, 
      email, 
      location, 
      aiScore, 
      aiJustification 
    } = req.body;

    if (!companyName || !segment) {
       res.status(400).json({ error: 'Nome da empresa e segmento são obrigatórios.' });
       return;
    }

    const newLead = {
      companyName,
      segment, 
      contactName: contactName || null,
      phone: phone || null,
      email: email || null,
      location: location || 'Não informada',
      status: 'NEW', 
      aiScore: aiScore || 0,
      aiJustification: aiJustification || null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const docRef = await db.collection('leads').add(newLead);

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