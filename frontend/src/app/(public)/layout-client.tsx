'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const NewsletterPopup = dynamic(() => import('@/components/NewsletterPopup'), {
  ssr: false,
});

// 🟢 Dados de fallback para Header e Footer renderizarem imediatamente no SSR
const CONFIG_LAYOUT_FALLBACK = {
  nome: 'Ark Eucalipto',
  whatsapp: '5577992365475',
  email: 'contato@arkeucalipto.com.br',
  endereco: 'Vitória da Conquista - BA',
  redes: {
    instagram: 'https://instagram.com/arkeucalipto',
  },
};

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  const [menuAberto, setMenuAberto] = useState(false);
  const [config, setConfig] = useState<any>(CONFIG_LAYOUT_FALLBACK);

  useEffect(() => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

    fetch(`${apiUrl}/api/site/config`)
      .then((res) => res.json())
      .then((data) => {
        if (data && typeof data === 'object') {
          setConfig((prev: any) => ({ ...prev, ...data }));
        }
      })
      .catch((err) => console.error('Erro no barramento de dados do Layout:', err));
  }, []);

  const whatsappLimpo = config?.whatsapp?.replace(/\D/g, '') || '5577992365475';

  return (
    <div className="min-h-screen bg-stone-50 text-zinc-800 font-sans flex flex-col justify-between selection:bg-emerald-50 selection:text-emerald-800">
      <Header 
        config={config} 
        whatsappLimpo={whatsappLimpo} 
        menuAberto={menuAberto} 
        setMenuAberto={setMenuAberto} 
      />

      <main className="flex-grow">
        {children}
      </main>

      <Footer dados={config} />

      <NewsletterPopup />
    </div>
  );
}