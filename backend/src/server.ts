import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import helmet from 'helmet';
import compression from 'compression';
import admin from 'firebase-admin'; 
import { readFileSync } from 'fs'; 
import { join } from 'path';        

// 1. Carrega as variáveis de ambiente primeiro
dotenv.config();

// ========================================================
// 🔥 INICIALIZAÇÃO DEFINITIVA E IMEDIATA DO FIREBASE ADMIN
// ========================================================
if (!admin.apps.length) {
  try {
    const credentialsPath = process.env.FIREBASE_CREDENTIALS_PATH || './firebase-keys.json';
    
    const serviceAccount = JSON.parse(
      readFileSync(join(process.cwd(), credentialsPath), 'utf8')
    );

    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      projectId: serviceAccount.project_id
    });
    
    console.log(`🔥 Firebase Admin autenticado com SUCESSO! Projeto: ${serviceAccount.project_id}`);
  } catch (error: any) {
    console.error('❌ Erro crítico ao inicializar o Firebase Admin:', error.message);
    console.log('⚠️ Certifique-se de que o arquivo "firebase-keys.json" está na raiz do projeto.');
    process.exit(1);
  }
}
// ========================================================

// 2. SÓ IMPORTA O RESTANTE DO SISTEMA DEPOIS QUE O FIREBASE JÁ ESTÁ RODANDO
import './utils/seedLeads.js';
import leadRoutes from './routes/leads.js';
import siteRoutes from './routes/site.js'; // 🚀 IMPORTADO: Seguindo estritamente o padrão .js do ES Modules

const app = express();
const PORT = process.env.PORT || 3001;

// Middlewares Globais
app.use(helmet()); 
app.use(compression()); 

// 🚀 PADRONIZADO: CORS aberto com asterisco para desenvolvimento local sem travas
app.use(cors({
  origin: '*', 
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// ========================================================
// 🗜️ AJUSTE DE LIMITES: Middleware de JSON com expansão de carga para 10MB
// ========================================================
app.use(express.json({ limit: '10mb' })); 
app.use(express.urlencoded({ limit: '10mb', extended: true })); 
// ========================================================

// Vincula as rotas de gerenciamento
app.use('/api/leads', leadRoutes);
app.use('/api/site', siteRoutes); // 🚀 REGISTRADO: Agora o Express sabe que o endpoint /api/site existe!

// ========================================================
// 🔐 ENDPOINTS DE AUTENTICAÇÃO INTERNOS
// ========================================================

// 🟢 CADASTRO: http://localhost:3001/api/auth/register
app.post('/api/auth/register', async (req: Request, res: Response) => {
  const { nome, email, senha } = req.body;

  try {
    if (!senha || senha.length < 6) {
      return res.status(400).json({ message: 'A senha é obrigatória e deve conter no mínimo 6 caracteres.' });
    }

    const usuarioFirebase = await admin.auth().createUser({
      email,
      password: senha,
      displayName: nome,
    });

    console.log(`✅ Administrador cadastrado com sucesso no Firebase: ${email}`);

    return res.status(201).json({
      message: 'Administrador criado com sucesso!',
      uid: usuarioFirebase.uid,
    });
  } catch (error: any) {
    console.error('❌ Erro ao criar usuário no Firebase:', error.message);
    return res.status(400).json({ message: error.message || 'Erro ao registrar usuário.' });
  }
});

// 🔵 LOGIN: http://localhost:3001/api/auth/login
app.post('/api/auth/login', async (req: Request, res: Response) => {
  const { email, senha } = req.body;

  try {
    const userRecord = await admin.auth().getUserByEmail(email);
    const customToken = await admin.auth().createCustomToken(userRecord.uid);

    console.log(`🔑 Login efetuado pelo administrador: ${email}`);

    return res.status(200).json({
      message: 'Login realizado com sucesso!',
      token: customToken,
      usuario: {
        uid: userRecord.uid,
        nome: userRecord.displayName,
        email: userRecord.email,
      }
    });
  } catch (error: any) {
    console.error('❌ Erro ao fazer login:', error.message);
    return res.status(401).json({ message: 'Credenciais inválidas ou administrador não encontrado.' });
  }
});

// Health Check
app.get('/api/health', (req: Request, res: Response) => {
  res.status(200).json({
    status: 'online',
    timestamp: new Date().toISOString(),
    message: 'Servidor Ark Eucalipto operando com sucesso!'
  });
});

// Middleware Global de Erros
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error('❌ Erro interno do servidor:', err.message);
  res.status(500).json({
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Algo deu errado no servidor.'
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Ark Eucalipto Backend rodando na porta ${PORT}`);
  console.log(`🔗 Endpoint de cadastro pronto em: http://localhost:${PORT}/api/auth/register`);
});