'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import Header from '@/components/Header';
import Footer from '@/components/Footer'; // Importação única e oficial do seu rodapé unificado

// 🟢 CORRIGIDO: Voltamos com o '@/' correto que seu projeto reconhece e precisa
const NewsletterPopup = dynamic(() => import('@/components/NewsletterPopup'), {
  ssr: false,
});

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  const [menuAberto, setMenuAberto] = useState(false);
  const [config, setConfig] = useState<any>(null);

  useEffect(() => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
    
    fetch(`${apiUrl}/api/site/config`)
      .then((res) => res.json())
      .then((data) => setConfig(data))
      .catch((err) => console.error('Erro no barramento de dados do Layout:', err));
  }, []);

  const whatsappLimpo = config?.whatsapp?.replace(/\D/g, '') || '73982365475';

  return (
    <div className="min-h-screen bg-stone-50 text-zinc-800 font-sans flex flex-col justify-between selection:bg-emerald-50 selection:text-emerald-800">
      
      {/* 🚀 O Header renderiza direto na inicialização do app */}
      <Header 
        config={config} 
        whatsappLimpo={whatsappLimpo} 
        menuAberto={menuAberto} 
        setMenuAberto={setMenuAberto} 
      />

      {/* Miolo dinâmico das páginas */}
      <main className="flex-grow">
        {children}
      </main>

      {/* 🚀 O Footer unificado que já carrega o bloco da newsletter embutido */}
      <Footer dados={config} />

      {/* 🟢 POP-UP INTELIGENTE (Carregado de forma leve em segundo plano) */}
      <NewsletterPopup />
      
    </div>
  );
}