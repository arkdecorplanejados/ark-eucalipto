import { Router, Request, Response, NextFunction } from 'express';
import { db } from '../lib/firebase.js';

const router = Router();

// ==========================================
// 📁 ROTAS PARA CATEGORIAS DE DESPESAS
// ==========================================

// 🟢 1. Cadastrar novo tipo de despesa (Ex: Contabilidade, Advogado, Logística)
router.post('/categories', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name } = req.body;
    if (!name) {
      res.status(400).json({ error: 'O nome da categoria é obrigatório.' });
      return;
    }

    const categoryName = name.trim();
    const categoriesRef = db.collection('expense-categories');

    // Evita cadastrar duplicatas
    const existe = await categoriesRef.where('name', '==', categoryName).get();
    if (!existe.empty) {
      res.status(400).json({ error: `A categoria "${categoryName}" já existe.` });
      return;
    }

    const docRef = await categoriesRef.add({
      name: categoryName,
      createdAt: new Date().toISOString()
    });

    res.status(201).json({ id: docRef.id, name: categoryName });
  } catch (error) {
    next(error);
  }
});

// 🔵 2. Listar todas as categorias (para carregar nos campos Select do front-end)
router.get('/categories', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const snapshot = await db.collection('expense-categories').orderBy('name', 'asc').get();
    const categories = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.status(200).json(categories);
  } catch (error) {
    next(error);
  }
});

// ==========================================
// 💸 ROTAS PARA OS LANÇAMENTOS DE DESPESAS
// ==========================================

// 🟢 3. Lançar uma nova despesa atrelada a uma categoria e a um mês de referência
router.post('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { description, value, categoryId, dueDate, monthRef } = req.body;

    if (!description || !value || !categoryId || !monthRef) {
      res.status(400).json({ error: 'Campos obrigatórios faltando.' });
      return;
    }

    const newExpense = {
      description: description.trim(),
      value: Number(value),
      categoryId,
      dueDate: dueDate || new Date().toISOString(),
      status: 'PENDING', // Padrão inicial
      monthRef,          // Formato esperado: "YYYY-MM" (Ex: "2026-06")
      createdAt: new Date().toISOString()
    };

    const docRef = await db.collection('expenses').add(newExpense);
    res.status(201).json({ id: docRef.id, ...newExpense });
  } catch (error) {
    next(error);
  }
});

// 🔵 4. Buscar despesas filtradas por MÊS específico (Ex: /api/finance?month=2026-06)
router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { month } = req.query;
    if (!month) {
      res.status(400).json({ error: 'O parâmetro mês (month) é obrigatório. Formato: YYYY-MM' });
      return;
    }

    const expensesSnapshot = await db.collection('expenses')
      .where('monthRef', '==', month.toString())
      .get();

    const expenses = expensesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.status(200).json(expenses);
  } catch (error) {
    next(error);
  }
});

export default router;