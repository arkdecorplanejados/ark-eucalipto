import admin from 'firebase-admin';
import { readFileSync } from 'fs';
import { join } from 'path';

if (!admin.apps.length) {
  try {
    // 1. Primeiro tenta ler das Variáveis de Ambiente (Modo Produção - Render)
    if (process.env.FIREBASE_PRIVATE_KEY) {
      admin.initializeApp({
        credential: admin.credential.cert({
          projectId: process.env.FIREBASE_PROJECT_ID,
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
          privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'), // Corrige quebras de linha na chave
        }),
      });
      console.log('🔥 Firebase inicializado com sucesso via Variáveis de Ambiente!');
    } 
    // 2. Se não achar as variáveis, tenta ler o arquivo local (Modo Desenvolvimento - Sua Máquina)
    else {
      // Usa readFileSync para ler o JSON de forma compatível com ES Modules (import/export)
      const serviceAccount = JSON.parse(
        readFileSync(join(process.cwd(), 'firebase-keys.json'), 'utf8')
      );

      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
      });
      console.log('🔥 Firebase inicializado com sucesso via arquivo local .json!');
    }
  } catch (error) {
    console.error('❌ Erro crítico ao inicializar o Firebase:', error);
  }
}

export const db = admin.firestore();