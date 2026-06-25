import { NextResponse } from 'next/server';

export async function GET() {
  // Esse código responde exatamente o texto que o Google espera ler dentro do arquivo
  const googleVerificationText = 'google-site-verification: google0b93d49dc82f1edb.html';
  
  return new NextResponse(googleVerificationText, {
    status: 200,
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
    },
  });
}