'use client';

import { useState, useEffect } from 'react';
import { Calendar, Layers, PlusCircle, DollarSign, Wallet } from 'lucide-react';

interface Categoria {
  id: string;
  name: string;
}

interface Despesa {
  id: string;
  description: string;
  value: number;
  categoryId: string;
  dueDate: string;
  status: string;
  monthRef: string;
}

export default function FinanceiroPage() {
  // 📆 Filtro do Mês Vigente (Padrão: Junho de 2026)
  const [mesFiltro, setMesFiltro] = useState<string>('2026-06');

  // Estados dos dados que vêm da API
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [despesas, setDespesas] = useState<Despesa[]>([]);
  
  // Estados para abertura de Modais e novos cadastros
  const [modalCategoria, setModalCategoria] = useState(false);
  const [modalDespesa, setModalDespesa] = useState(false);
  
  const [novaCategoria, setNovaCategoria] = useState('');
  const [formDespesa, setFormDespesa] = useState({
    description: '',
    value: '',
    categoryId: '',
    dueDate: '',
    monthRef: '2026-06'
  });

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

  // Carrega categorias e despesas automaticamente ao mudar de mês
  useEffect(() => {
    buscarCategorias();
    buscarDespesas();
  }, [mesFiltro]);

  const buscarCategorias = async () => {
    try {
      const res = await fetch(`${apiUrl}/api/finance/categories`);
      if (res.ok) setCategorias(await res.json());
    } catch (err) { console.error("Erro ao buscar categorias:", err); }
  };

  const buscarDespesas = async () => {
    try {
      const res = await fetch(`${apiUrl}/api/finance?month=${mesFiltro}`);
      if (res.ok) setDespesas(await res.json());
    } catch (err) { console.error("Erro ao buscar despesas:", err); }
  };

  const handleCriarCategoria = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!novaCategoria.trim()) return;

    try {
      const res = await fetch(`${apiUrl}/api/finance/categories`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: novaCategoria }),
      });

      if (res.ok) {
        setNovaCategoria('');
        setModalCategoria(false);
        buscarCategorias();
      } else {
        const err = await res.json();
        alert(err.error || "Erro ao salvar categoria");
      }
    } catch (err) { console.error(err); }
  };

  const handleCriarDespesa = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch(`${apiUrl}/api/finance`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formDespesa),
      });

      if (res.ok) {
        setFormDespesa({ description: '', value: '', categoryId: '', dueDate: '', monthRef: mesFiltro });
        setModalDespesa(false);
        buscarDespesas();
      }
    } catch (err) { console.error(err); }
  };

  // Cálculo Dinâmico do Total do Mês Filtrado
  const totalDespesasMes = despesas.reduce((acc, current) => acc + current.value, 0);

  const formatarMesExtenso = (mesAno: string) => {
    const meses: Record<string, string> = {
      '2026-05': 'Maio / 2026', '2026-06': 'Junho / 2026', '2026-07': 'Julho / 2026', '2026-08': 'Agosto / 2026'
    };
    return meses[mesAno] || mesAno;
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      
      {/* CABEÇALHO */}
      <div>
        <h1 className="text-3xl font-serif font-bold text-zinc-900 tracking-tight">
          Fluxo de Caixa Operacional
        </h1>
        <p className="text-sm text-zinc-500 mt-1">
          Gerencie os custos e despesas fixas ou variáveis do pátio da Ark Eucalipto.
        </p>
      </div>

      {/* CONTROLADORES DE FILTRO DE MÊS E BOTÕES */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-4 rounded-2xl border border-zinc-200 shadow-sm">
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-zinc-400" />
          <label className="text-xs font-bold text-zinc-600 uppercase tracking-wider">Mês de Referência:</label>
          <select
            value={mesFiltro}
            onChange={(e) => setMesFiltro(e.target.value)}
            className="bg-zinc-50 border border-zinc-200 rounded-lg px-3 py-1.5 text-xs font-semibold text-zinc-800 focus:outline-none focus:border-zinc-500"
          >
            <option value="2026-05">Maio / 2026</option>
            <option value="2026-06">Junho / 2026</option>
            <option value="2026-07">Julho / 2026</option>
            <option value="2026-08">Agosto / 2026</option>
          </select>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setModalCategoria(true)}
            className="bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-bold px-4 py-2 rounded-xl transition-all flex items-center gap-1.5"
          >
            <Layers className="w-3.5 h-3.5" /> + Tipo Despesa
          </button>
          <button
            onClick={() => setModalDespesa(true)}
            className="bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-bold px-4 py-2 rounded-xl transition-all flex items-center gap-1.5"
          >
            <PlusCircle className="w-3.5 h-3.5" /> Lançar Gasto
          </button>
        </div>
      </div>

      {/* CARDS MÉTRICOS */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-white border border-zinc-200 rounded-2xl p-6 shadow-sm">
          <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Custos do Mês ({formatarMesExtenso(mesFiltro)})</p>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-3xl font-serif font-bold text-zinc-900 text-emerald-800">
              {totalDespesasMes.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
            </span>
          </div>
        </div>
        <div className="bg-white border border-zinc-200 rounded-2xl p-6 shadow-sm">
          <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Tipos de Contas Ativas</p>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-3xl font-serif font-bold text-zinc-900">{categorias.length}</span>
            <span className="text-xs font-medium text-zinc-400 ml-1">categorias</span>
          </div>
        </div>
        <div className="bg-white border border-zinc-200 rounded-2xl p-6 shadow-sm">
          <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Volume de Lançamentos</p>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-3xl font-serif font-bold text-zinc-900">{despesas.length}</span>
            <span className="text-xs font-medium text-zinc-400 ml-1">comprovantes</span>
          </div>
        </div>
      </div>

      {/* TABELA REAL DE CUSTOS POR MÊS */}
      <div className="bg-white border border-zinc-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="p-6 border-b border-zinc-100">
          <h3 className="text-lg font-serif font-bold text-zinc-900">Demonstrativo Detalhado de Despesas</h3>
          <p className="text-xs text-zinc-400 mt-0.5">Listagem oficial de saídas para o período selecionado.</p>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-zinc-50 text-zinc-400 text-[10px] font-bold uppercase tracking-wider border-b border-zinc-100">
                <th className="py-3.5 px-6">Descrição da Conta</th>
                <th className="py-3.5 px-6">Categoria</th>
                <th className="py-3.5 px-6">Vencimento</th>
                <th className="py-3.5 px-6 text-right">Valor Operacional</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 text-sm">
              {despesas.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-8 text-center text-zinc-400 text-xs font-medium">
                    Nenhuma despesa ou custo lançado para este mês até o momento.
                  </td>
                </tr>
              ) : (
                despesas.map((item) => {
                  const nomeCat = categorias.find(c => c.id === item.categoryId)?.name || "Geral / Pátio";
                  return (
                    <tr key={item.id} className="hover:bg-zinc-50/50 transition-colors">
                      <td className="py-4 px-6 font-medium text-zinc-900">{item.description}</td>
                      <td className="py-4 px-6 text-zinc-500">
                        <span className="bg-zinc-100 text-zinc-700 text-[11px] px-2 py-0.5 rounded font-mono font-medium">
                          {nomeCat}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-zinc-400 font-mono text-xs">
                        {new Date(item.dueDate).toLocaleDateString('pt-BR')}
                      </td>
                      <td className="py-4 px-6 text-right font-bold font-mono text-zinc-950">
                        {item.value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL 1: CATEGORIAS */}
      {modalCategoria && (
        <div className="fixed inset-0 bg-zinc-950/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white border border-zinc-200 w-full max-w-md rounded-2xl p-6 shadow-2xl space-y-4">
            <div>
              <h3 className="text-xl font-serif font-bold text-zinc-950">Novo Tipo de Despesa</h3>
              <p className="text-xs text-zinc-400 mt-0.5">Adicione grupos específicos como Contabilidade, Advocacia ou Combustível.</p>
            </div>
            <form onSubmit={handleCriarCategoria} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase text-zinc-500 tracking-wider">Nome do Tipo de Gasto</label>
                <input
                  type="text" required placeholder="Ex: Contabilidade" value={novaCategoria}
                  onChange={(e) => setNovaCategoria(e.target.value)}
                  className="w-full bg-white border border-zinc-200 rounded-xl px-4 py-2.5 text-xs text-zinc-900 placeholder-zinc-400 focus:outline-none focus:border-zinc-950 font-medium"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setModalCategoria(false)} className="px-4 py-2 text-xs font-bold text-zinc-500 hover:text-zinc-950">Cancelar</button>
                <button type="submit" className="bg-zinc-950 text-white text-xs font-bold px-4 py-2 rounded-xl hover:bg-zinc-800">Salvar Tipo</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: LANÇAMENTO DE GASTOS */}
      {modalDespesa && (
        <div className="fixed inset-0 bg-zinc-950/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white border border-zinc-200 w-full max-w-md rounded-2xl p-6 shadow-2xl space-y-4">
            <div>
              <h3 className="text-xl font-serif font-bold text-zinc-950">Lançar Nova Despesa</h3>
              <p className="text-xs text-zinc-400 mt-0.5">Preencha o valor e amarre a despesa ao mês operacional de destino.</p>
            </div>
            <form onSubmit={handleCriarDespesa} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase text-zinc-500 tracking-wider">Descrição do Gasto</label>
                <input
                  type="text" required placeholder="Ex: Honorários Contábeis Junho" value={formDespesa.description}
                  onChange={(e) => setFormDespesa({...formDespesa, description: e.target.value})}
                  className="w-full bg-white border border-zinc-200 rounded-xl px-4 py-2.5 text-xs text-zinc-900 focus:outline-none focus:border-zinc-950 font-medium"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-zinc-500 tracking-wider">Valor (R$)</label>
                  <input
                    type="number" step="0.01" required placeholder="1200.00" value={formDespesa.value}
                    onChange={(e) => setFormDespesa({...formDespesa, value: e.target.value})}
                    className="w-full bg-white border border-zinc-200 rounded-xl px-4 py-2.5 text-xs text-zinc-900 focus:outline-none focus:border-zinc-950 font-medium font-mono"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-zinc-500 tracking-wider">Mês Competência</label>
                  <select
                    value={formDespesa.monthRef}
                    onChange={(e) => setFormDespesa({...formDespesa, monthRef: e.target.value})}
                    className="w-full bg-white border border-zinc-200 rounded-xl px-3 py-2.5 text-xs text-zinc-900 focus:outline-none focus:border-zinc-950 font-medium"
                  >
                    <option value="2026-05">Maio / 2026</option>
                    <option value="2026-06">Junho / 2026</option>
                    <option value="2026-07">Julho / 2026</option>
                    <option value="2026-08">Agosto / 2026</option>
                  </select>
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase text-zinc-500 tracking-wider">Tipo / Categoria</label>
                <select
                  required value={formDespesa.categoryId}
                  onChange={(e) => setFormDespesa({...formDespesa, categoryId: e.target.value})}
                  className="w-full bg-white border border-zinc-200 rounded-xl px-3 py-2.5 text-xs text-zinc-900 focus:outline-none focus:border-zinc-950 font-medium"
                >
                  <option value="">Selecione um tipo de gasto...</option>
                  {categorias.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase text-zinc-500 tracking-wider">Data de Vencimento</label>
                <input
                  type="date" required value={formDespesa.dueDate}
                  onChange={(e) => setFormDespesa({...formDespesa, dueDate: e.target.value})}
                  className="w-full bg-white border border-zinc-200 rounded-xl px-4 py-2.5 text-xs text-zinc-900 focus:outline-none focus:border-zinc-950 font-medium font-mono"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setModalDespesa(false)} className="px-4 py-2 text-xs font-bold text-zinc-500 hover:text-zinc-950">Cancelar</button>
                <button type="submit" className="bg-emerald-700 text-white text-xs font-bold px-4 py-2 rounded-xl hover:bg-emerald-600">Salvar Conta</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}