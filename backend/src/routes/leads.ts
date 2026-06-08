import { Router, Request, Response, NextFunction } from 'express';
import { db } from '../lib/firebase.js';

const router = Router();

// 1. Rota para Listar todos os Leads (Será usada no seu painel administrativo)
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

    // Validação básica de padrão dev
    if (!companyName || !segment) {
       res.status(400).json({ error: 'Nome da empresa e segmento são obrigatórios.' });
       return;
    }

    const newLead = {
      companyName,
      segment, // FAZENDA, INDUSTRIA_CERCA, CONSTRUTORA, etc.
      contactName: contactName || null,
      phone: phone || null,
      email: email || null,
      location: location || 'Não informada',
      status: 'NEW', // Padrão inicial
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