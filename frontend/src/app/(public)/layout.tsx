'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

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

  // Removi a trava do "if (carregando)" para que a estrutura visual nunca seja bloqueada
  const whatsappLimpo = config?.whatsapp?.replace(/\D/g, '') || '73982365475';

  return (
    <div className="min-h-screen bg-stone-50 text-zinc-800 font-sans flex flex-col justify-between">
      
      {/* 🚀 O Header agora renderiza direto na inicialização do app */}
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

      {/* 🚀 O Footer também fica visível desde o primeiro milissegundo */}
      <Footer dados={config} />
      
    </div>
  );
}