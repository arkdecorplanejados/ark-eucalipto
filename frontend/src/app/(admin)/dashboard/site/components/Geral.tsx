'use client';

import { useState } from 'react';

export default function Geral({ dados, setDados }: { dados: any; setDados: any }) {
  const [subindo, setSubindo] = useState(false);

  // 🟢 URL DINÂMICA: Detecta automaticamente se deve usar o servidor da Render ou o localhost
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>, campo: string) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setSubindo(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      // 🟢 ROTA ATUALIZADA: Agora aponta para a nuvem em produção
      const res = await fetch(`${API_URL}/api/site/upload`, { method: 'POST', body: formData });
      const data = await res.json();
      if (res.ok && data.url) {
        if (campo === 'logo') setDados({ ...dados, logoUrl: data.url });
        if (campo === 'logistica') setDados({ ...dados, parallax: { ...dados.parallax, logistica: { ...dados.parallax?.logistica, imagemUrl: data.url } } });
        if (campo === 'catalogo') setDados({ ...dados, parallax: { ...dados.parallax, catalogo: { ...dados.parallax?.catalogo, imagemUrl: data.url } } });
        alert('📷 Mídia atualizada com sucesso!');
      }
    } catch {
      alert('❌ Erro ao enviar mídia.');
    } finally {
      setSubindo(false);
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <h3 className="font-bold text-zinc-800 text-sm uppercase tracking-wider">Identidade e Atendimento</h3>
          <div className="p-4 bg-zinc-50 border rounded-xl space-y-2">
            <label className="text-[10px] font-black uppercase text-zinc-400">Logomarca do Site</label>
            <div className="flex items-center gap-2">
              <input type="text" className="flex-1 p-2 bg-white border rounded-lg text-xs" readOnly value={dados.logoUrl} placeholder="Sem logo" />
              <label className="bg-zinc-900 text-white text-xs px-3 py-2 rounded-lg font-bold cursor-pointer whitespace-nowrap">
                {subindo ? '...' : 'Upload'}
                <input type="file" accept="image/*" className="hidden" onChange={e => handleUpload(e, 'logo')} />
              </label>
            </div>
          </div>
          <input className="w-full p-3 bg-zinc-50 border rounded-xl text-sm" placeholder="WhatsApp Comercial" value={dados.whatsapp || ''} onChange={e => setDados({...dados, whatsapp: e.target.value})} />
          <input className="w-full p-3 bg-zinc-50 border rounded-xl text-sm" placeholder="Email Comercial" value={dados.email || ''} onChange={e => setDados({...dados, email: e.target.value})} />
        </div>

        <div className="space-y-4">
          <h3 className="font-bold text-zinc-800 text-sm uppercase tracking-wider">Textos de Rodapé e Pátio</h3>
          <input className="w-full p-3 bg-zinc-50 border rounded-xl text-sm" placeholder="Resumo Institucional" value={dados.descricaoSite || ''} onChange={e => setDados({...dados, descricaoSite: e.target.value})} />
          <textarea rows={4} className="w-full p-3 bg-zinc-50 border rounded-xl text-sm resize-none" placeholder="Endereço Completo do Pátio" value={dados.endereco || ''} onChange={e => setDados({...dados, endereco: e.target.value})} />
        </div>
      </div>

      {/* Seção das Imagens Parallax Independentes */}
      <div className="border-t pt-6 space-y-4">
        <h3 className="font-bold text-zinc-800 text-sm uppercase tracking-wider">Banners Parallax Fixos</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Parallax Logística */}
          <div className="p-4 bg-zinc-50 border rounded-xl space-y-2">
            <label className="text-[10px] font-black uppercase text-zinc-400">Fundo Parallax Logística</label>
            <input type="text" className="w-full p-2 bg-white border rounded-lg text-xs" readOnly value={dados.parallax?.logistica?.imagemUrl || ''} placeholder="Sem fundo" />
            <div className="flex justify-between items-center pt-1">
              <input type="text" className="p-2 border bg-white rounded-lg text-xs w-[70%]" placeholder="Título" value={dados.parallax?.logistica?.titulo || ''} onChange={e => setDados({...dados, parallax: {...dados.parallax, logistica: {...dados.parallax?.logistica, titulo: e.target.value}}})} />
              <label className="bg-zinc-900 text-white text-xs px-3 py-2 rounded-lg font-bold cursor-pointer">
                Upload
                <input type="file" accept="image/*" className="hidden" onChange={e => handleUpload(e, 'logistica')} />
              </label>
            </div>
          </div>
          {/* Parallax Catálogo */}
          <div className="p-4 bg-zinc-50 border rounded-xl space-y-2">
            <label className="text-[10px] font-black uppercase text-zinc-400">Fundo Parallax Catálogo</label>
            <input type="text" className="w-full p-2 bg-white border rounded-lg text-xs" readOnly value={dados.parallax?.catalogo?.imagemUrl || ''} placeholder="Sem fundo" />
            <div className="flex justify-between items-center pt-1">
              <input type="text" className="p-2 border bg-white rounded-lg text-xs w-[70%]" placeholder="Título" value={dados.parallax?.catalogo?.titulo || ''} onChange={e => setDados({...dados, parallax: {...dados.parallax, catalogo: {...dados.parallax?.catalogo, titulo: e.target.value}}})} />
              <label className="bg-zinc-900 text-white text-xs px-3 py-2 rounded-lg font-bold cursor-pointer">
                Upload
                <input type="file" accept="image/*" className="hidden" onChange={e => handleUpload(e, 'catalogo')} />
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}