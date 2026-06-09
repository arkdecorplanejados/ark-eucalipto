'use client';

import { useState } from 'react';

export default function Slides({ dados, setDados }: { dados: any; setDados: any }) {
  const [subindo, setSubindo] = useState(false);

  // 🟢 URL DINÂMICA: Detecta se o app está rodando no servidor da Render ou localmente
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

  const handleUploadSlide = async (e: React.ChangeEvent<HTMLInputElement>, idx: number) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setSubindo(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      // 🟢 ROTA ATUALIZADA: Aponta para a API correta na nuvem em produção
      const res = await fetch(`${API_URL}/api/site/upload`, { method: 'POST', body: formData });
      const data = await res.json();
      if (res.ok && data.url) {
        const novosSlides = [...(dados.slides || [])];
        novosSlides[idx].imagem = data.url;
        setDados({ ...dados, slides: novosSlides });
        alert('📷 Foto do slide atualizada!');
      }
    } catch {
      alert('❌ Erro no envio.');
    } finally {
      setSubindo(false);
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex justify-between items-center">
        <h3 className="font-bold text-zinc-800 text-sm uppercase tracking-wider">Carrossel de Banners (Hero)</h3>
        <button 
          type="button"
          onClick={() => setDados({
            ...dados, 
            slides: [...(dados.slides || []), { id: `slide_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`, titulo: 'Novo Banner', subtitulo: '', imagem: '' }]
          })} 
          className="text-emerald-700 hover:text-emerald-800 text-xs font-black uppercase tracking-wider transition-colors"
        >
          + Adicionar Banner
        </button>
      </div>

      <div className="space-y-4">
        {(dados.slides || []).map((slide: any, idx: number) => (
          <div key={slide.id || idx} className="border border-zinc-200 rounded-xl p-5 bg-zinc-50/50 space-y-3">
            <div className="flex justify-between items-center border-b pb-2">
              <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Banner #0{idx+1}</span>
              <button 
                type="button" 
                onClick={() => setDados({ ...dados, slides: dados.slides.filter((_: any, i: number) => i !== idx) })}
                className="text-rose-500 hover:text-rose-600 text-xs font-bold transition-colors"
              >
                Remover Banner
              </button>
            </div>

            {/* 🟢 AREA INTERATIVA: Imagem + Inputs integrados em Grid */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
              
              {/* Card visual da Foto (Ocupa 3 colunas) */}
              <div className="md:col-span-3 h-24 bg-white rounded-xl border border-zinc-200 shadow-sm relative overflow-hidden flex items-center justify-center group">
                {slide.imagem ? (
                  <>
                    <img src={slide.imagem} alt="Slide Preview" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-zinc-950/50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex flex-col gap-1 items-center justify-center">
                      <label className="text-[10px] bg-white hover:bg-zinc-100 text-zinc-900 font-bold px-2 py-1 rounded shadow-md cursor-pointer transition-colors">
                        Alterar
                        <input type="file" accept="image/*" className="hidden" onChange={e => handleUploadSlide(e, idx)} />
                      </label>
                      <button
                        type="button"
                        onClick={() => {
                          const ns = [...dados.slides];
                          ns[idx].imagem = '';
                          setDados({ ...dados, slides: ns });
                        }}
                        className="text-[10px] bg-rose-600 hover:bg-rose-700 text-white font-bold px-2 py-1 rounded shadow-md transition-colors"
                      >
                        Limpar
                      </button>
                    </div>
                  </>
                ) : (
                  <label className="w-full h-full flex flex-col items-center justify-center cursor-pointer bg-zinc-100/50 hover:bg-zinc-200/50 transition-colors text-center p-2">
                    <span className="text-xl">📷</span>
                    <span className="text-[9px] font-black text-zinc-400 uppercase tracking-wider mt-1">
                      {subindo ? 'Subindo...' : 'Upload Imagem'}
                    </span>
                    <input type="file" accept="image/*" className="hidden" onChange={e => handleUploadSlide(e, idx)} />
                  </label>
                )}
              </div>

              {/* Inputs de Conteúdo (Ocupam as 9 colunas restantes) */}
              <div className="md:col-span-9 space-y-2">
                <input 
                  className="w-full p-2.5 border bg-white rounded-lg text-xs font-medium text-zinc-800 placeholder-zinc-400 focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500" 
                  placeholder="Título Principal do Banner" 
                  value={slide.titulo || ''} 
                  onChange={e => { const ns = [...dados.slides]; ns[idx].titulo = e.target.value; setDados({...dados, slides: ns}); }} 
                />
                <input 
                  className="w-full p-2.5 border bg-white rounded-lg text-xs font-medium text-zinc-800 placeholder-zinc-400 focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500" 
                  placeholder="Subtítulo ou Mensagem Curta de Apoio" 
                  value={slide.subtitulo || ''} 
                  onChange={e => { const ns = [...dados.slides]; ns[idx].subtitulo = e.target.value; setDados({...dados, slides: ns}); }} 
                />
              </div>

            </div>
          </div>
        ))}
      </div>
    </div>
  );
}