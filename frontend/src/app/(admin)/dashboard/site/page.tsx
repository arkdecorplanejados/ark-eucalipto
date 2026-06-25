'use client';

import { useState, useEffect } from 'react';
import Geral from './components/Geral';
import Slides from './components/Slides';
import Produtos from './components/Produtos';
import Diferenciais from './components/Diferenciais'; 
import FAQAdmin from './components/FAQ'; 

// 🟢 URL DINÂMICA NO TOPO: Detecta automaticamente se deve usar a Render ou o localhost
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export default function CMSPage() {
  // Alterada a aba inicial padrão para 'geral', focando no gerenciamento institucional
  const [abaAtiva, setAbaAtiva] = useState<string>('geral');
  const [dados, setDados] = useState<any>({
    logoUrl: '', whatsapp: '', email: '', endereco: '', descricaoSite: '',
    menu: [], slides: [], diferenciais: [], setores: [],
    parallax: {
      logistica: { titulo: '', subtitulo: '', imagemUrl: '' },
      catalogo: { titulo: '', subtitulo: '', imagemUrl: '' }
    },
    faq: [], produtosVitrine: []
  });
  const [carregando, setCarregando] = useState(true);
  const [salvando, setSalvando] = useState(false);

  // 📡 Sincroniza dados com o pátio central na nuvem
  useEffect(() => {
    fetch(`${API_URL}/api/site/config`)
      .then(res => res.ok ? res.json() : null)
      .then(data => {
        if (data) {
          setDados({
            ...data,
            parallax: data.parallax || {
              logistica: { titulo: '', subtitulo: '', imagemUrl: '' },
              catalogo: { titulo: '', subtitulo: '', imagemUrl: '' }
            },
            produtosVitrine: data.produtosVitrine || []
          });
        }
        setCarregando(false);
      })
      .catch(err => {
        console.error("❌ Erro ao conectar no backend:", err);
        setCarregando(false);
      });
  }, []);

  // 💾 Salva as abas de layout no Firebase remoto
  const handleSalvar = async () => {
    setSalvando(true);
    try {
      const res = await fetch(`${API_URL}/api/site/config/atualizar`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dados)
      });
      if (!res.ok) throw new Error();
      alert('✅ Alterações do site salvas com sucesso!');
    } catch (error) {
      alert('❌ Erro ao salvar alterações.');
    } finally {
      setSalvando(false);
    }
  };

  if (carregando) {
    return (
      <div className="p-8 text-emerald-800 font-black animate-pulse flex items-center gap-2">
        <span>🔋</span> Sincronizando Layout do Site...
      </div>
    );
  }

  // 🧹 Faxina concluída: Removidas as abas financeiro, notas e calendário do CMS
  const abas = [
    { id: 'geral', label: 'Informações Gerais' },
    { id: 'slides', label: 'Slides/Banners (Hero)' },
    { id: 'produtos', label: 'Vitrine do Pátio' },
    { id: 'diferenciais', label: 'Diferenciais' },
    { id: 'faq', label: 'FAQ' } 
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto p-2">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 border-b border-zinc-100 pb-5">
        <div>
          <h1 className="text-2xl font-serif font-black text-zinc-900 uppercase tracking-tight">Gerenciar Design do Site</h1>
          <p className="text-zinc-500 text-xs mt-0.5">Altere textos, banners e informações visuais que aparecem no site público.</p>
        </div>
        <button 
          onClick={handleSalvar}
          disabled={salvando}
          className="w-full sm:w-auto bg-emerald-700 text-white px-6 py-3 rounded-xl font-black text-xs uppercase tracking-wider hover:bg-emerald-800 transition-all shadow-md disabled:opacity-50"
        >
          {salvando ? 'Salvando...' : 'Publicar Mudanças'}
        </button>
      </div>

      {/* Navegação por Abas Modernas de Design */}
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none border-b border-zinc-200">
        {abas.map(aba => (
          <button
            key={aba.id}
            onClick={() => setAbaAtiva(aba.id)}
            className={`px-4 py-2.5 rounded-t-xl text-xs font-black uppercase tracking-wider transition-all border-t border-x -mb-[1px] ${
              abaAtiva === aba.id 
                ? 'bg-white border-zinc-200 border-b-white text-emerald-700 shadow-sm' 
                : 'bg-zinc-50/50 border-transparent text-zinc-400 hover:text-zinc-600'
            }`}
          >
            {aba.label}
          </button>
        ))}
      </div>

      {/* Container Dinâmico Isolado */}
      <div className="bg-white border border-zinc-200 rounded-2xl p-6 md:p-8 shadow-sm">
        {abaAtiva === 'geral' && <Geral dados={dados} setDados={setDados} />}
        {abaAtiva === 'slides' && <Slides dados={dados} setDados={setDados} />}
        {abaAtiva === 'produtos' && <Produtos dados={dados} setDados={setDados} />}
        {abaAtiva === 'diferenciais' && <Diferenciais dados={dados} setDados={setDados} />}
        {abaAtiva === 'faq' && <FAQAdmin dados={dados} setDados={setDados} />}
      </div>
    </div>
  );
}