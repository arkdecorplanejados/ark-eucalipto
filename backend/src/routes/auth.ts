import { Router, Request, Response } from 'express';
import admin from 'firebase-admin';

console.log('✅ auth.ts carregou');

const router = Router();

// Rota de teste
router.get('/teste', (req: Request, res: Response) => {
  res.status(200).json({
    ok: true,
    mensagem: 'Rota auth funcionando'
  });
});

// 🟢 CADASTRO
// POST http://localhost:3001/api/auth/register
router.post('/register', async (req: Request, res: Response) => {
  try {
    const { nome, email, senha } = req.body;

    if (!nome || !email || !senha) {
      return res.status(400).json({
        message: 'Preencha nome, email e senha'
      });
    }

    const usuarioFirebase = await admin.auth().createUser({
      email,
      password: senha,
      displayName: nome
    });

    return res.status(201).json({
      message: 'Administrador criado com sucesso!',
      usuario: {
        uid: usuarioFirebase.uid,
        nome,
        email
      }
    });

  } catch (error: any) {
    console.error('❌ Erro ao criar usuário:', error);

    return res.status(400).json({
      message: error.message || 'Erro ao registrar usuário'
    });
  }
});

// 🔵 LOGIN
// POST http://localhost:3001/api/auth/login
router.post('/login', async (req: Request, res: Response) => {
  try {

    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        message: 'Email obrigatório'
      });
    }

    const userRecord =
      await admin.auth().getUserByEmail(email);

    const customToken =
      await admin.auth().createCustomToken(
        userRecord.uid
      );

    return res.status(200).json({
      message: 'Login realizado',
      token: customToken,
      usuario: {
        uid: userRecord.uid,
        nome: userRecord.displayName,
        email: userRecord.email
      }
    });

  } catch (error: any) {

    console.error(
      '❌ Erro login:',
      error.message
    );

    return res.status(401).json({
      message:
      'Usuário não encontrado'
    });

  }
});

export default router;