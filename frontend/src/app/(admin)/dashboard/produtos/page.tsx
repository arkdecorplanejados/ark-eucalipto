'use client';

import { useState, useEffect } from 'react';

export default function ProdutosPage() {
  const [configGlobal, setConfigGlobal] = useState<any>(null);
  const [carregando, setCarregando] = useState(true);
  const [salvando, setSalvando] = useState(false);
  const [novo, setNovo] = useState({ nome: '', categoria: 'innatura', preco: 'Sob Consulta', visivel: true });

  // 🟢 URL DINÂMICA: Lê o servidor de produção (Render) ou o localhost
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

  // 📡 Carrega as configurações e produtos do pátio central
  useEffect(() => {
    fetch(`${API_URL}/api/site/config`)
      .then(res => res.ok ? res.json() : null)
      .then(data => {
        if (data) setConfigGlobal(data);
        setCarregando(false);
      })
      .catch(err => {
        console.error("❌ Erro ao buscar produtos:", err);
        setCarregando(false);
      });
  }, [API_URL]);

  // 💾 Salva o estado atualizado direto no banco de dados
  const persistirNoBanco = async (dadosAtualizados: any) => {
    setSalvando(true);
    try {
      const res = await fetch(`${API_URL}/api/site/config/atualizar`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dadosAtualizados)
      });
      if (!res.ok) throw new Error();
    } catch {
      alert('❌ Erro ao sincronizar alteração com o pátio central.');
    } finally {
      setSalvando(false);
    }
  };

  const handleAdd = async () => {
    if (!novo.nome.trim()) return alert('Digite o nome do material');
    
    const id = `prod_${Date.now()}`;
    const novosProdutos = [...(configGlobal?.produtosVitrine || []), { id, ...novo }];
    const payloadAtualizado = { ...configGlobal, produtosVitrine: novosProdutos };
    
    setConfigGlobal(payloadAtualizado);
    setNovo({ nome: '', categoria: 'innatura', preco: 'Sob Consulta', visivel: true });
    
    await persistirNoBanco(payloadAtualizado);
  };

  const handleAlternarVisibilidade = async (idx: number) => {
    const np = [...configGlobal.produtosVitrine];
    np[idx].visivel = !np[idx].visivel;
    
    const payloadAtualizado = { ...configGlobal, produtosVitrine: np };
    setConfigGlobal(payloadAtualizado);
    
    await persistirNoBanco(payloadAtualizado);
  };

  const handleRemover = async (idx: number) => {
    if (!confirm('Tem certeza que deseja remover este material do estoque?')) return;
    
    const np = configGlobal.produtosVitrine.filter((_: any, i: number) => i !== idx);
    const payloadAtualizado = { ...configGlobal, produtosVitrine: np };
    
    setConfigGlobal(payloadAtualizado);
    
    await persistirNoBanco(payloadAtualizado);
  };

  if (carregando) {
    return <div className="p-10 text-emerald-800 font-bold animate-pulse">Sincronizando estoque do pátio...</div>;
  }

  return (
    <div className="space-y-6 max-w-6xl mx-auto p-4 animate-fadeIn">
      
      {/* Cabeçalho */}
      <div className="flex justify-between items-center border-b pb-4">
        <div>
          <h1 className="text-2xl font-serif font-black text-zinc-900 uppercase tracking-tight">Estoque da Vitrine</h1>
          <p className="text-zinc-500 text-xs">Gerencie os materiais disponíveis para faturamento direto no site público.</p>
        </div>
        {salvando && (
          <span className="text-xs bg-amber-100 text-amber-800 px-3 py-1 rounded-full font-bold animate-pulse">
            Sincronizando pátio...
          </span>
        )}
      </div>

      {/* Cadastro Rápido */}
      <div className="bg-zinc-50 border rounded-xl p-5 space-y-3">
        <h4 className="text-xs font-black uppercase text-zinc-700 tracking-wide">Entrada de Material no Pátio</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <input className="p-2.5 bg-white border rounded-lg text-xs" placeholder="Nome (Ex: Mourão de Eucalipto 2,20m)" value={novo.nome} onChange={e => setNovo({...novo, nome: e.target.value})} />
          <select className="p-2.5 bg-white border rounded-lg text-xs font-medium text-zinc-700" value={novo.categoria} onChange={e => setNovo({...novo, categoria: e.target.value})}>
            <option value="innatura">🪵 In Natura</option>
            <option value="rural">🌲 Linha Rural</option>
            <option value="lenha">🔥 Biomassa / Lenha</option>
          </select>
          <input className="p-2.5 bg-white border rounded-lg text-xs" placeholder="Preço" value={novo.preco} onChange={e => setNovo({...novo, preco: e.target.value})} />
        </div>
        <div className="flex justify-end">
          <button type="button" onClick={handleAdd} className="bg-emerald-700 text-white px-5 py-2.5 rounded-lg text-xs font-black uppercase tracking-wider hover:bg-emerald-800 transition-colors shadow-sm">
            Inserir no Estoque
          </button>
        </div>
      </div>

      {/* Listagem */}
      <div className="space-y-2">
        <h4 className="text-xs font-black uppercase text-zinc-400 tracking-wider">Materiais no Pátio Central</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {(configGlobal?.produtosVitrine || []).map((prod: any, idx: number) => (
            <div key={prod.id || idx} className="flex items-center justify-between p-3.5 border rounded-xl bg-white hover:border-zinc-300 transition-all shadow-sm">
              <div>
                <p className="font-bold text-zinc-800 text-xs">{prod.nome}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-[9px] font-black uppercase px-1.5 py-0.5 bg-zinc-100 text-zinc-500 rounded border">
                    {prod.categoria === 'innatura' && 'In Natura'}
                    {prod.categoria === 'rural' && 'Linha Rural'}
                    {prod.categoria === 'lenha' && 'Biomassa'}
                  </span>
                  <p className="text-[10px] text-emerald-700 font-bold">{prod.preco || 'Sob Consulta'}</p>
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                <button 
                  type="button" 
                  onClick={() => handleAlternarVisibilidade(idx)}
                  className={`px-2.5 py-1 rounded text-[11px] font-bold shadow-sm transition-all ${prod.visivel ? 'bg-zinc-900 text-white' : 'bg-zinc-200 text-zinc-500'}`}
                >
                  {prod.visivel ? 'Visível' : 'Oculto'}
                </button>
                <button 
                  type="button" 
                  onClick={() => handleRemover(idx)} 
                  className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg transition-colors font-bold text-xs"
                >
                  ✕
                </button>
              </div>
            </div>
          ))}
        </div>

        {(configGlobal?.produtosVitrine || []).length === 0 && (
          <div className="text-center py-12 text-zinc-400 text-xs bg-zinc-50 border border-dashed rounded-xl font-medium">
            Nenhum material cadastrado na vitrine.
          </div>
        )}
      </div>

    </div>
  );
}