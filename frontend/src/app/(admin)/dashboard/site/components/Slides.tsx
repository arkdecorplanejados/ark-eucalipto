'use client';

import { useState } from 'react';

export default function Slides({ dados, setDados }: { dados: any; setDados: any }) {
  const [subindo, setSubindo] = useState(false);

  const handleUploadSlide = async (e: React.ChangeEvent<HTMLInputElement>, idx: number) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setSubindo(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('http://localhost:3001/api/site/upload', { method: 'POST', body: formData });
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
          className="text-emerald-700 text-xs font-black uppercase tracking-wider"
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
                className="text-rose-500 text-xs font-bold"
              >
                Remover
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <input className="p-2.5 border bg-white rounded-lg text-xs" placeholder="Título" value={slide.titulo || ''} onChange={e => { const ns = [...dados.slides]; ns[idx].titulo = e.target.value; setDados({...dados, slides: ns}); }} />
              <input className="p-2.5 border bg-white rounded-lg text-xs" placeholder="Subtítulo" value={slide.subtitulo || ''} onChange={e => { const ns = [...dados.slides]; ns[idx].subtitulo = e.target.value; setDados({...dados, slides: ns}); }} />
            </div>
            <div className="flex items-center gap-2 bg-white p-1 rounded-lg border">
              <input type="text" className="flex-1 p-1.5 bg-zinc-50 text-zinc-500 rounded text-[11px]" readOnly value={slide.imagem || ''} placeholder="Sem mídia vinculada" />
              <label className="bg-zinc-900 text-white text-[11px] px-3 py-1.5 rounded-md font-bold cursor-pointer whitespace-nowrap">
                {subindo ? '...' : 'Upload Imagem'}
                <input type="file" accept="image/*" className="hidden" onChange={e => handleUploadSlide(e, idx)} />
              </label>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}