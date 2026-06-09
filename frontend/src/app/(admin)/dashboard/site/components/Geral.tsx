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
          
          {/* Campo de Logomarca Customizado com Card de Preview */}
          <div className="p-4 bg-zinc-50 border rounded-xl space-y-3">
            <label className="text-[10px] font-black uppercase text-zinc-400">Logomarca do Site</label>
            
            {dados.logoUrl ? (
              <div className="relative w-full h-32 bg-white border border-zinc-200 rounded-lg overflow-hidden flex items-center justify-center p-4 group shadow-sm">
                <img src={dados.logoUrl} alt="Logomarca" className="max-h-full max-w-full object-contain" />
                <div className="absolute inset-0 bg-zinc-950/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                  <button 
                    type="button"
                    onClick={() => setDados({ ...dados, logoUrl: '' })}
                    className="bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold px-3 py-1.5 rounded-lg shadow-md transition-colors"
                  >
                    Remover Imagem
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <input type="text" className="flex-1 p-2 bg-white border rounded-lg text-xs text-zinc-400" readOnly value={dados.logoUrl || ''} placeholder="Nenhuma logomarca enviada" />
                <label className="bg-zinc-900 hover:bg-zinc-800 text-white text-xs px-4 py-2 rounded-lg font-bold cursor-pointer whitespace-nowrap transition-colors">
                  {subindo ? '...' : 'Upload'}
                  <input type="file" accept="image/*" className="hidden" onChange={e => handleUpload(e, 'logo')} />
                </label>
              </div>
            )}
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
          <div className="p-4 bg-zinc-50 border rounded-xl space-y-3">
            <label className="text-[10px] font-black uppercase text-zinc-400">Fundo Parallax Logística</label>
            
            {dados.parallax?.logistica?.imagemUrl ? (
              <div className="relative w-full h-40 bg-zinc-900 border border-zinc-200 rounded-lg overflow-hidden group shadow-sm">
                <img src={dados.parallax.logistica.imagemUrl} alt="Logística" className="w-full h-full object-cover opacity-85" />
                <div className="absolute inset-0 bg-zinc-950/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                  <button 
                    type="button"
                    onClick={() => setDados({ ...dados, parallax: { ...dados.parallax, logistica: { ...dados.parallax.logistica, imagemUrl: '' } } })}
                    className="bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold px-3 py-1.5 rounded-lg shadow-md transition-colors"
                  >
                    Remover Fundo
                  </button>
                </div>
              </div>
            ) : null}

            <div className="flex justify-between items-center gap-2">
              <input type="text" className="p-2 border bg-white rounded-lg text-xs flex-1" placeholder="Título do Banner" value={dados.parallax?.logistica?.titulo || ''} onChange={e => setDados({...dados, parallax: {...dados.parallax, logistica: {...dados.parallax?.logistica, titulo: e.target.value}}})} />
              {!dados.parallax?.logistica?.imagemUrl && (
                <label className="bg-zinc-900 hover:bg-zinc-800 text-white text-xs px-4 py-2 rounded-lg font-bold cursor-pointer transition-colors">
                  Upload
                  <input type="file" accept="image/*" className="hidden" onChange={e => handleUpload(e, 'logistica')} />
                </label>
              )}
            </div>
          </div>

          {/* Parallax Catálogo */}
          <div className="p-4 bg-zinc-50 border rounded-xl space-y-3">
            <label className="text-[10px] font-black uppercase text-zinc-400">Fundo Parallax Catálogo</label>
            
            {dados.parallax?.catalogo?.imagemUrl ? (
              <div className="relative w-full h-40 bg-zinc-900 border border-zinc-200 rounded-lg overflow-hidden group shadow-sm">
                <img src={dados.parallax.catalogo.imagemUrl} alt="Catálogo" className="w-full h-full object-cover opacity-85" />
                <div className="absolute inset-0 bg-zinc-950/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                  <button 
                    type="button"
                    onClick={() => setDados({ ...dados, parallax: { ...dados.parallax, catalogo: { ...dados.parallax.catalogo, imagemUrl: '' } } })}
                    className="bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold px-3 py-1.5 rounded-lg shadow-md transition-colors"
                  >
                    Remover Fundo
                  </button>
                </div>
              </div>
            ) : null}

            <div className="flex justify-between items-center gap-2">
              <input type="text" className="p-2 border bg-white rounded-lg text-xs flex-1" placeholder="Título do Banner" value={dados.parallax?.catalogo?.titulo || ''} onChange={e => setDados({...dados, parallax: {...dados.parallax, catalogo: {...dados.parallax?.catalogo, titulo: e.target.value}}})} />
              {!dados.parallax?.catalogo?.imagemUrl && (
                <label className="bg-zinc-900 hover:bg-zinc-800 text-white text-xs px-4 py-2 rounded-lg font-bold cursor-pointer transition-colors">
                  Upload
                  <input type="file" accept="image/*" className="hidden" onChange={e => handleUpload(e, 'catalogo')} />
                </label>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}