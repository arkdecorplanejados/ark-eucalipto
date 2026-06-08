'use client';

import { useState, useEffect } from 'react';
import { ResponsiveContainer, AreaChart, Area, CartesianGrid, XAxis, YAxis, Tooltip, Legend, BarChart, Bar, Cell } from 'recharts';
import { DollarSign, Wallet, TrendingUp, Plus, Trash2, Calendar } from 'lucide-react';

interface Movimentacao {
  id: string;
  desc: string;
  tipo: 'receita' | 'despesa';
  categoria: string;
  valor: number;
  data: string; // Formato YYYY-MM-DD
}

const aplicarMascaraDinheiro = (valor: string) => {
  const apenasNumeros = valor.replace(/\D/g, '');
  if (!apenasNumeros) return '';
  
  const opcoes = { minimumFractionDigits: 2, maximumFractionDigits: 2 };
  const valorFormatado = (String(Number(apenasNumeros) / 100));
  
  return Number(valorFormatado).toLocaleString('pt-BR', opcoes);
};

const converterStringParaNumero = (valor: string): number => {
  if (!valor) return 0;
  const globalizado = valor.replace(/\./g, '').replace(',', '.');
  return parseFloat(globalizado) || 0;
};

const adicionarMeses = (dataString: string, mesesParaAdicionar: number): string => {
  const data = new Date(dataString + 'T12:00:00');
  data.setMonth(data.getMonth() + mesesParaAdicionar);
  return data.toISOString().split('T')[0];
};

export default function Financeiro() {
  const hojeString = '2026-06-05'; // Alinhado com a data dos prints estruturais
  const [extrato, setExtrato] = useState<Movimentacao[]>([]);

  // 🔄 CARREGAMENTO BLINDADO: Sem dados fictícios e travado contra resets automáticos
useEffect(() => {
  const dadosLocais = localStorage.getItem('ark_eucalipto_financeiro');
  
  if (dadosLocais !== null) {
    // Se o banco local já existir (mesmo que você tenha deletado tudo e ele esteja vazio []), ele mantém o que você deixou
    setExtrato(JSON.parse(dadosLocais));
  } else {
    // Se for o primeiríssimo acesso da história do navegador, ele inicia zerado para você mesmo alimentar
    setExtrato([]);
    localStorage.setItem('ark_eucalipto_financeiro', JSON.stringify([]));
  }
}, []); // 👈 Mantido vazio, garantindo a execução única no ciclo de vida

  const [novo, setNovo] = useState({ desc: '', tipo: 'despesa' as 'receita' | 'despesa', categoria: 'Alimentação Diária', valor: '', data: hojeString, parcelas: '1' });
  const [filtroTipo, setFiltroTipo] = useState<'todos' | 'receita' | 'despesa' | 'hoje'>('todos');
  const [buscaData, setBuscaData] = useState<string>('');

  const categoriasDespesas = ['Alimentação Diária', 'Diárias / Mão de Obra', 'Combustível', 'Manejo / Extração', 'Logística', 'Manutenção', 'Administrativo'];
  const categoriasReceitas = ['Venda Direta', 'Biomassa / Lenha', 'Contratos Rurais'];

  const handleAdd = () => {
    if (!novo.desc.trim() || !novo.valor) return alert('Por favor, preencha a descrição e o valor.');
    
    const valorTotalNum = converterStringParaNumero(novo.valor);
    if (valorTotalNum <= 0) return alert('Por favor, digite um valor maior que zero.');

    const qtdParcelas = parseInt(novo.parcelas) || 1;
    const valorDaParcela = valorTotalNum / qtdParcelas;
    const novosLancamentos: Movimentacao[] = [];

    for (let i = 0; i < qtdParcelas; i++) {
      const dataCalculada = adicionarMeses(novo.data || hojeString, i);
      const sufixoParcela = qtdParcelas > 1 ? ` (${i + 1}/${qtdParcelas})` : '';

      novosLancamentos.push({
        id: `financeiro_${Date.now()}_${i}`,
        desc: `${novo.desc}${sufixoParcela}`,
        tipo: novo.tipo,
        categoria: novo.categoria,
        valor: parseFloat(valorDaParcela.toFixed(2)),
        data: dataCalculada
      });
    }

    const listaAtualizada = [...novosLancamentos, ...extrato];
    setExtrato(listaAtualizada);
    localStorage.setItem('ark_eucalipto_financeiro', JSON.stringify(listaAtualizada));
    
    setNovo({ desc: '', tipo: novo.tipo, categoria: novo.categoria, valor: '', data: novo.data, parcelas: '1' });
  };

  const handleRemover = (id: string) => {
    if (confirm('Deseja excluir este registro permanentemente?')) {
      const novaLista = extrato.filter(item => item.id !== id);
      setExtrato(novaLista);
      localStorage.setItem('ark_eucalipto_financeiro', JSON.stringify(novaLista));
    }
  };

  const mesAtualFiltro = (novo.data || hojeString).slice(0, 7);

  const totalReceitas = extrato.filter(t => t.tipo === 'receita' && t.data.startsWith(mesAtualFiltro)).reduce((acc, cur) => acc + cur.valor, 0);
  const totalDespesas = extrato.filter(t => t.tipo === 'despesa' && t.data.startsWith(mesAtualFiltro)).reduce((acc, cur) => acc + cur.valor, 0);
  const saldoLiquido = totalReceitas - totalDespesas;

  const despesasHoje = extrato
    .filter(t => t.tipo === 'despesa' && t.data === hojeString)
    .reduce((acc, cur) => acc + cur.valor, 0);

  const dadosCategoriasDespesas = categoriasDespesas.map(cat => {
    const total = extrato
      .filter(t => t.tipo === 'despesa' && t.categoria === cat && t.data.startsWith(mesAtualFiltro))
      .reduce((acc, cur) => acc + cur.valor, 0);
    return { name: cat, valor: total };
  }).filter(item => item.valor > 0);

  const chartEvolucaoData = [
    { name: 'Mar', receitas: 35000, despesas: 14000 },
    { name: 'Abr', receitas: 42000, despesas: 15500 },
    { name: 'Mai', receitas: 45000, despesas: 16000 },
    { name: 'Jun', receitas: totalReceitas, despesas: totalDespesas }
  ];

  const transacoesFiltradas = extrato.filter(t => {
    if (buscaData) return t.data === buscaData;
    if (filtroTipo === 'hoje') return t.data === hojeString;
    return filtroTipo === 'todos' || t.tipo === filtroTipo;
  }).sort((a, b) => b.data.localeCompare(a.data));

  return (
    <div className="space-y-6 text-zinc-800">
      
      {/* 📊 METRIC CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-zinc-900 text-white p-5 rounded-2xl border border-zinc-800 shadow-sm">
          <div className="flex justify-between items-center text-zinc-400">
            <span className="text-[10px] font-black uppercase tracking-wider">Entradas Ativas (Mês)</span>
            <DollarSign className="w-4 h-4 text-emerald-400" />
          </div>
          <h3 className="text-xl font-serif font-black mt-2 text-emerald-400">
            R$ {totalReceitas.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </h3>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-zinc-200 shadow-sm">
          <div className="flex justify-between items-center text-zinc-400">
            <span className="text-[10px] font-black uppercase tracking-wider">Custos do Mês Selecionado</span>
            <Wallet className="w-4 h-4 text-rose-500" />
          </div>
          <h3 className="text-xl font-serif font-black mt-2 text-rose-500">
            R$ {totalDespesas.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </h3>
        </div>

        <div className="bg-amber-50/60 border border-amber-200 p-5 rounded-2xl shadow-sm">
          <div className="flex justify-between items-center text-amber-800">
            <span className="text-[10px] font-black uppercase tracking-wider">Despesas Diárias (Hoje)</span>
            <Calendar className="w-4 h-4 text-amber-600" />
          </div>
          <h3 className="text-xl font-serif font-black mt-2 text-amber-700">
            R$ {despesasHoje.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </h3>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-zinc-200 shadow-sm">
          <div className="flex justify-between items-center text-zinc-400">
            <span className="text-[10px] font-black uppercase tracking-wider">Balanço do Período</span>
            <TrendingUp className="w-4 h-4 text-emerald-700" />
          </div>
          <h3 className={`text-xl font-serif font-black mt-2 ${saldoLiquido >= 0 ? 'text-emerald-700' : 'text-rose-600'}`}>
            R$ {saldoLiquido.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </h3>
        </div>
      </div>

      {/* 📉 GRÁFICOS */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        <div className="lg:col-span-7 bg-white border rounded-2xl p-4 shadow-sm space-y-2">
          <h4 className="text-xs font-black uppercase text-zinc-700">Previsibilidade Mensal</h4>
          <div className="h-52 w-full text-[10px] font-bold">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartEvolucaoData} margin={{ top: 10, right: 5, left: -25, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                <XAxis dataKey="name" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" />
                <Tooltip formatter={(val) => `R$ ${Number(val).toLocaleString('pt-BR')}`} />
                <Legend verticalAlign="top" height={32}/>
                <Area name="Receitas" dataKey="receitas" stroke="#059669" fill="#059669" fillOpacity={0.03} strokeWidth={2} />
                <Area name="Custos" dataKey="despesas" stroke="#f43f5e" fill="#f43f5e" fillOpacity={0.03} strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="lg:col-span-5 bg-white border rounded-2xl p-4 shadow-sm space-y-2">
          <h4 className="text-xs font-black uppercase text-zinc-700">Custos Alocados no Mês</h4>
          <div className="h-52 w-full text-[10px] font-bold">
            {dadosCategoriasDespesas.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={dadosCategoriasDespesas} margin={{ top: 10, right: 5, left: -25, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                  <XAxis dataKey="name" stroke="#9ca3af" />
                  <YAxis stroke="#9ca3af" />
                  <Tooltip formatter={(val) => `R$ ${Number(val).toLocaleString('pt-BR')}`} />
                  <Bar dataKey="valor" radius={[4, 4, 0, 0]} maxBarSize={32}>
                    {dadosCategoriasDespesas.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.name.includes('Diária') || entry.name.includes('Alimentação') ? '#b45309' : '#f43f5e'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-zinc-400 font-medium text-xs">
                Sem custos para o período selecionado.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ➕ FORMULÁRIO */}
      <div className="bg-zinc-50 border rounded-2xl p-5 space-y-4">
        <h4 className="text-xs font-black uppercase text-zinc-700 tracking-wide flex items-center gap-1.5">
          <span>⚙️</span> INSERIR MOVIMENTAÇÃO AVANÇADA (À VISTA OU PARCELADO)
        </h4>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-12 gap-3">
          <div className="md:col-span-2 space-y-1">
            <label className="text-[9px] font-black uppercase text-zinc-400">Data de Vencimento / Recebimento</label>
            <input 
              type="date" 
              value={novo.data} 
              onChange={e => setNovo({...novo, data: e.target.value})} 
              className="w-full p-2 bg-white border rounded-xl text-xs font-bold text-zinc-700 focus:outline-none"
            />
          </div>

          <div className="md:col-span-2 space-y-1">
            <label className="text-[9px] font-black uppercase text-zinc-400">Tipo de Fluxo</label>
            <select 
              value={novo.tipo} 
              onChange={e => {
                const tipoSel = e.target.value as 'receita' | 'despesa';
                setNovo({
                  ...novo, 
                  tipo: tipoSel, 
                  categoria: tipoSel === 'despesa' ? 'Alimentação Diária' : 'Venda Direta',
                  valor: ''
                });
              }}
              className="w-full p-2.5 bg-white border rounded-xl text-xs font-bold text-zinc-700"
            >
              <option value="despesa">➖ Saída (Previsão Custo)</option>
              <option value="receita">➕ Entrada (A Receber)</option>
            </select>
          </div>

          <div className="md:col-span-3 space-y-1">
            <label className="text-[9px] font-black uppercase text-zinc-400">Descrição / Histórico</label>
            <input 
              type="text" 
              placeholder="Ex: Parcela do cliente X ou Compra de insumos" 
              value={novo.desc} 
              onChange={e => setNovo({...novo, desc: e.target.value})} 
              className="w-full p-2.5 bg-white border rounded-xl text-xs"
            />
          </div>

          <div className="md:col-span-2 space-y-1">
            <label className="text-[9px] font-black uppercase text-zinc-400">Categoria</label>
            {/* 🔍 Procure por este bloco perto da linha 278 e mude apenas o nome da variável: */}
            <select 
              value={novo.categoria} 
              onChange={e => setNovo({...novo, categoria: e.target.value})}
              className="w-full p-2.5 bg-white border rounded-xl text-xs text-zinc-700 font-medium"
            >
              {novo.tipo === 'despesa' 
                ? categoriasDespesas.map(c => <option key={c} value={c}>{c}</option>)
                : categoriasReceitas.map(c => <option key={c} value={c}>{c}</option>) // 🟢 CORRIGIDO AQUI
              }
            </select>
          </div>

          <div className="md:col-span-1 space-y-1">
            <label className="text-[9px] font-black uppercase text-zinc-400">Parcelas</label>
            <select
              value={novo.parcelas}
              onChange={e => setNovo({...novo, parcelas: e.target.value})}
              className="w-full p-2.5 bg-white border rounded-xl text-xs font-black text-zinc-700 focus:outline-none"
            >
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(n => (
                <option key={n} value={n}>{n}x</option>
              ))}
            </select>
          </div>

          <div className="md:col-span-2 space-y-1">
            <label className="text-[9px] font-black uppercase text-zinc-400">Valor Total (R$)</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-zinc-400">R$</span>
              <input 
                type="text" 
                placeholder="0,00" 
                value={novo.valor} 
                onChange={e => setNovo({...novo, valor: aplicarMascaraDinheiro(e.target.value)})} 
                className="w-full p-2.5 pl-9 bg-white border rounded-xl text-xs font-mono font-bold text-zinc-800"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-1">
          <button 
            type="button" 
            onClick={handleAdd}
            className="w-full sm:w-auto bg-zinc-900 text-white px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider hover:bg-emerald-800 transition-colors flex items-center justify-center gap-2 shadow-sm"
          >
            <Plus className="w-4 h-4" /> Registrar Planejamento
          </button>
        </div>
      </div>

      {/* 📋 LISTAGEM */}
      <div className="space-y-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b pb-2">
          <h4 className="text-xs font-black uppercase text-zinc-400 tracking-wider">Histórico Cronológico e Projeções</h4>
          
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-1.5 bg-zinc-100 p-1 rounded-lg border text-xs">
              <span className="text-[10px] font-black uppercase text-zinc-500 pl-1">Filtrar por Dia:</span>
              <input 
                type="date" 
                value={buscaData} 
                onChange={e => {
                  setBuscaData(e.target.value);
                  if(e.target.value) setFiltroTipo('todos');
                }}
                className="p-1 bg-white border rounded text-[11px] font-bold text-zinc-700 outline-none"
              />
              {buscaData && <button onClick={() => setBuscaData('')} className="text-rose-500 font-bold px-1">✕</button>}
            </div>

            <div className="flex items-center gap-1 bg-zinc-100 p-1 rounded-lg border border-zinc-200">
              <button disabled={!!buscaData} onClick={() => setFiltroTipo('todos')} className={`px-2 py-1 rounded text-[10px] font-black uppercase transition-all ${filtroTipo === 'todos' && !buscaData ? 'bg-white shadow-sm text-zinc-800' : 'text-zinc-400 disabled:opacity-40'}`}>Todos</button>
              <button disabled={!!buscaData} onClick={() => setFiltroTipo('hoje')} className={`px-2 py-1 rounded text-[10px] font-black uppercase transition-all ${filtroTipo === 'hoje' && !buscaData ? 'bg-amber-600 text-white shadow-sm' : 'text-zinc-500 disabled:opacity-40'}`}>Hoje</button>
              <button disabled={!!buscaData} onClick={() => setFiltroTipo('receita')} className={`px-2 py-1 rounded text-[10px] font-black uppercase transition-all ${filtroTipo === 'receita' && !buscaData ? 'bg-white shadow-sm text-emerald-700' : 'text-zinc-400 disabled:opacity-40'}`}>A Receber</button>
              <button disabled={!!buscaData} onClick={() => setFiltroTipo('despesa')} className={`px-2 py-1 rounded text-[10px] font-black uppercase transition-all ${filtroTipo === 'despesa' && !buscaData ? 'bg-white shadow-sm text-rose-600' : 'text-zinc-400 disabled:opacity-40'}`}>Previsão Custos</button>
            </div>
          </div>
        </div>

        <div className="border border-zinc-200 rounded-2xl overflow-hidden bg-white divide-y divide-zinc-100 shadow-sm">
          {transacoesFiltradas.map((t) => {
            const dataVencimento = new Date(t.data + 'T12:00:00');
            const isFuturo = dataVencimento > new Date();

            return (
              <div key={t.id} className="flex justify-between items-center p-4 hover:bg-zinc-50/50 transition-colors group">
                <div className="space-y-1 max-w-[70%]">
                  <p className="text-xs font-bold text-zinc-800 tracking-tight leading-tight">{t.desc}</p>
                  <div className="flex flex-wrap gap-2 items-center">
                    <span className={`text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded border ${
                      t.data === hojeString ? 'bg-amber-50 text-amber-700 border-amber-200' :
                      t.tipo === 'receita' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-rose-50 text-rose-600 border-rose-100'
                    }`}>
                      {t.categoria}
                    </span>
                    {isFuturo && (
                      <span className="text-[8px] font-black uppercase bg-zinc-100 text-zinc-500 border border-zinc-300 px-1.5 py-0.5 rounded tracking-wide">
                        ⏳ Lançamento Futuro
                      </span>
                    )}
                    <span className="text-[10px] text-zinc-400 font-semibold font-mono">
                      {t.data.split('-').reverse().join('/')}
                    </span>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <span className={`text-xs font-black font-mono tracking-tight ${t.tipo === 'receita' ? 'text-emerald-600' : 'text-rose-500'}`}>
                    {t.tipo === 'receita' ? '+' : '-'} R$ {t.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </span>
                  <button 
                    type="button" 
                    onClick={() => handleRemover(t.id)}
                    className="p-1.5 text-zinc-300 hover:text-rose-500 hover:bg-rose-50 border border-transparent hover:border-rose-100 rounded-lg transition-all"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}

          {transacoesFiltradas.length === 0 && (
            <div className="text-center py-12 text-zinc-400 text-xs font-medium bg-zinc-50/50">
              Nenhum lançamento localizado.
            </div>
          )}
        </div>
      </div>

    </div>
  );
}