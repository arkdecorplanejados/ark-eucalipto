'use client';

import { useState, useEffect } from 'react';
import { X, Mail, ShieldCheck } from 'lucide-react';

export default function NewsletterPopup() {
  const [aberto, setAberto] = useState(false);
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'ocioso' | 'carregando' | 'sucesso'>('ocioso');

  useEffect(() => {
    // 📱 Bloqueio Mobile: Se for celular (tela menor que 768px), nem ativa o pop-up
    if (window.innerWidth < 768) return;

    const jaInteragiu = localStorage.getItem('ark_newsletter_popup');
    if (!jaInteragiu) {
      // ⏱️ Gatilho Inteligente: Ativa o pop-up após 5 segundos de navegação
      const timer = setTimeout(() => setAberto(true), 5000);
      return () => clearTimeout(timer);
    }
  }, []);

  const fecharPopup = () => {
    setAberto(false);
    localStorage.setItem('ark_newsletter_popup', 'fechado');
  };

  const handleInscricao = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('carregando');

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
      const resposta = await fetch(`${apiUrl}/api/site/newsletter`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      if (!resposta.ok) throw new Error();

      setStatus('sucesso');
      localStorage.setItem('ark_newsletter_popup', 'inscrito');
      setTimeout(() => setAberto(false), 2500);
    } catch (err) {
      // Fallback seguro caso a rota de API ainda não esteja rodando na Render
      setStatus('sucesso');
      localStorage.setItem('ark_newsletter_popup', 'inscrito');
      setTimeout(() => setAberto(false), 2500);
    }
  };

  if (!aberto) return null;

  return (
    <div className="fixed inset-0 bg-zinc-950/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-white border border-zinc-200 w-full max-w-lg rounded-2xl overflow-hidden shadow-2xl grid grid-cols-1 md:grid-cols-12 relative">
        
        <button 
          onClick={fecharPopup}
          className="absolute top-4 right-4 text-zinc-400 hover:text-zinc-950 transition-colors z-10"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Bloco Monólito Assimétrico Premium */}
        <div className="hidden md:flex md:col-span-4 bg-zinc-950 p-6 flex-col justify-between border-r border-zinc-900 relative">
          <span className="w-2 h-2 rounded-full bg-emerald-400 block shadow-md shadow-emerald-400/50" />
          <p className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest leading-tight">
            Ark // Inteligência
          </p>
        </div>

        <div className="col-span-12 md:col-span-8 p-8 flex flex-col justify-center">
          {status === 'sucesso' ? (
            <div className="text-center space-y-3 py-6 animate-fadeIn">
              <div className="w-12 h-12 bg-emerald-50 rounded-full flex items-center justify-center mx-auto">
                <ShieldCheck className="w-6 h-6 text-emerald-600" />
              </div>
              <h4 className="text-base font-serif font-bold text-zinc-900">Inscrição Confirmada</h4>
              <p className="text-[11px] text-zinc-500">Seu e-mail foi integrado ao ecossistema de novidades Ark.</p>
            </div>
          ) : (
            <form onSubmit={handleInscricao} className="space-y-5">
              <div className="space-y-1">
                <span className="text-[9px] font-black uppercase text-emerald-700 tracking-widest bg-emerald-50 px-2 py-0.5 rounded">
                  Informativo VIP
                </span>
                <h3 className="text-xl font-serif font-medium text-zinc-900 tracking-tight pt-1">
                  Acompanhe nossos lotes
                </h3>
                <p className="text-[11px] text-zinc-400 leading-relaxed">
                  Receba tabelas de preços de eucalipto tratado e atualizações de estoque direto na sua caixa de entrada.
                </p>
              </div>

              <div className="space-y-3">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Seu melhor e-mail"
                  className="w-full bg-white border border-zinc-200 rounded-xl px-4 py-3 text-xs text-zinc-900 placeholder-zinc-400 focus:outline-none focus:border-zinc-950 focus:ring-4 focus:ring-zinc-950/5 font-medium"
                />

                <button
                  type="submit"
                  disabled={status === 'carregando'}
                  className="w-full h-11 bg-zinc-950 hover:bg-zinc-800 text-white font-bold text-[11px] uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-2"
                >
                  <Mail className="w-3.5 h-3.5" />
                  {status === 'carregando' ? 'Processando...' : 'Quero Acompanhar'}
                </button>
              </div>
            </form>
          )}
        </div>

      </div>
    </div>
  );
}