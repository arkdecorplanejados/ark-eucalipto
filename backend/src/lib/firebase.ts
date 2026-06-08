import admin from 'firebase-admin';
import dotenv from 'dotenv';
import { readFileSync } from 'fs';
import { join } from 'path';

dotenv.config();

// Garante a inicialização correta independente de quem importar este arquivo primeiro
if (!admin.apps.length) {
  try {
    const credentialsPath = process.env.FIREBASE_CREDENTIALS_PATH || './firebase-keys.json';
    
    const serviceAccount = JSON.parse(
      readFileSync(join(process.cwd(), credentialsPath), 'utf8')
    );

    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      projectId: serviceAccount.project_id,
      storageBucket: `${serviceAccount.project_id}.appspot.com`
    });

    console.log(`🔥 Firebase Admin inicializado com SUCESSO via lib/firebase! Projeto: ${serviceAccount.project_id}`);
  } catch (error: any) {
    console.error('❌ Erro crítico ao inicializar o Firebase em lib/firebase:', error.message);
    process.exit(1);
  }
}

// Exportações seguras das instâncias após a garantia de inicialização acima
export const db = admin.firestore();
export const auth = admin.auth();