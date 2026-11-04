'use client';

import { useState, useEffect, useMemo } from 'react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export default function DashboardPage() {
  const [focoGrafico, setFocoGrafico] = useState<number | null>(null);
  const [periodo, setPeriodo] = useState<'7d' | '30d'>('7d');
  const [visaoGrafico, setVisaoGrafico] = useState<'leads' | 'financeiro'>('leads');

  const [leads, setLeads] = useState<any[]>([]);
  const [transacoes, setTransacoes] = useState<any[]>([]);
  const [carregando, setCarregando] = useState(true);

  // 📡 Busca simultaneamente Leads e Movimentações Financeiras
  useEffect(() => {
    async function carregarDados() {
      try {
        const [resLeads, resFin] = await Promise.all([
          fetch(`${API_URL}/api/leads`).catch(() => null),
          fetch(`${API_URL}/api/financeiro`).catch(() => null),
        ]);

        if (resLeads && resLeads.ok) {
          const dataLeads = await resLeads.json();
          setLeads(Array.isArray(dataLeads) ? dataLeads : dataLeads?.leads || dataLeads?.data || []);
        }

        if (resFin && resFin.ok) {
          const dataFin = await resFin.json();
          setTransacoes(
            Array.isArray(dataFin)
              ? dataFin
              : dataFin?.transacoes || dataFin?.lancamentos || dataFin?.movimentacoes || dataFin?.data || []
          );
        } else {
          // Fallback: verifica se o financeiro está salvo dentro de /api/site/config
          const resConfig = await fetch(`${API_URL}/api/site/config`).catch(() => null);
          if (resConfig && resConfig.ok) {
            const dataConfig = await resConfig.json();
            const finConfig = dataConfig?.financeiro || dataConfig?.transacoes || dataConfig?.lancamentos || [];
            if (Array.isArray(finConfig)) setTransacoes(finConfig);
          }
        }
      } catch (err) {
        console.error('❌ Erro ao sincronizar dados do Dashboard:', err);
      } finally {
        setCarregando(false);
      }
    }

    carregarDados();
  }, []);

  // 📅 Extrator universal de data (Firestore Timestamp, ISO ou String BR)
  const extrairData = (item: any): Date => {
    const raw = item?.criadoEm || item?.createdAt || item?.data || item?.vencimento || item?.timestamp;
    if (!raw) return new Date();
    if (typeof raw === 'object' && raw._seconds) return new Date(raw._seconds * 1000);
    if (typeof raw === 'object' && raw.seconds) return new Date(raw.seconds * 1000);
    if (typeof raw === 'string' && raw.includes('/')) {
      const [dia, mes, ano] = raw.split('/');
      const parsedBr = new Date(`${ano}-${mes}-${dia}T12:00:00`);
      if (!isNaN(parsedBr.getTime())) return parsedBr;
    }
    const parsed = new Date(raw);
    return isNaN(parsed.getTime()) ? new Date() : parsed;
  };

  // 💰 Conversor seguro de valores monetários (Number ou String "R$ 1.500,00")
  const extrairValor = (item: any): number => {
    const raw = item?.valor ?? item?.total ?? item?.preco ?? item?.quantia ?? 0;
    if (typeof raw === 'number') return raw;
    if (typeof raw === 'string') {
      const limpo = raw.replace(/[R$\s.]/g, '').replace(',', '.');
      const num = parseFloat(limpo);
      return isNaN(num) ? 0 : num;
    }
    return 0;
  };

  const formatarMoeda = (valor: number) =>
    valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

  // 🔍 Filtra Leads e Transações pelo período selecionado (7 dias ou Mês Atual)
  const { leadsFiltrados, transacoesFiltradas } = useMemo(() => {
    const agora = new Date();
    const limite = new Date();
    if (periodo === '7d') {
      limite.setDate(agora.getDate() - 7);
    } else {
      limite.setDate(1);
      limite.setHours(0, 0, 0, 0);
    }

    return {
      leadsFiltrados: leads.filter((l) => extrairData(l) >= limite),
      transacoesFiltradas: transacoes.filter((t) => extrairData(t) >= limite),
    };
  }, [leads, transacoes, periodo]);

  // 📊 Métricas Comerciais (Leads)
  const metricasLeads = useMemo(() => {
    const total = leadsFiltrados.length;
    const emAtendimento = leadsFiltrados.filter((l) => {
      const s = (l.status || '').toLowerCase();
      return s && s !== 'novo' && s !== 'pendente' && s !== 'aguardando';
    }).length;

    const concluidos = leadsFiltrados.filter((l) => {
      const s = (l.status || '').toLowerCase();
      return s.includes('conclu') || s.includes('fechado') || s.includes('convertido') || s.includes('venda');
    }).length;

    const respondidos = emAtendimento > 0 ? emAtendimento : total;
    const taxaResposta = total > 0 ? Math.round((respondidos / total) * 100) : 100;

    return { total, taxaResposta, concluidos, dentroDoPrazo: respondidos };
  }, [leadsFiltrados]);

  // 💵 Métricas Financeiras (Receitas, Despesas e Saldo)
  const metricasFinanceiras = useMemo(() => {
    let entradas = 0;
    let saidas = 0;

    transacoesFiltradas.forEach((t) => {
      const valor = extrairValor(t);
      const tipo = (t.tipo || t.natureza || t.categoria || 'entrada').toLowerCase();
      if (tipo.includes('saida') || tipo.includes('saída') || tipo.includes('despesa') || tipo.includes('custo') || tipo.includes('pagar')) {
        saidas += Math.abs(valor);
      } else {
        entradas += Math.abs(valor);
      }
    });

    const saldo = entradas - saidas;
    const margem = entradas > 0 ? Math.max(0, Math.round((saldo / entradas) * 100)) : 0;

    return { entradas, saidas, saldo, margem };
  }, [transacoesFiltradas]);

  // 📈 Dados Dinâmicos do Gráfico de Barras (Alterna entre Leads e Financeiro)
  const dadosGrafico = useMemo(() => {
    const nomesDias = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
    const ordemExibicao = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'];

    const mapa: Record<string, { quantidade: number; detalhe: string }> = {
      Seg: { quantidade: 0, detalhe: 'Sem registros' },
      Ter: { quantidade: 0, detalhe: 'Sem registros' },
      Qua: { quantidade: 0, detalhe: 'Sem registros' },
      Qui: { quantidade: 0, detalhe: 'Sem registros' },
      Sex: { quantidade: 0, detalhe: 'Sem registros' },
      Sáb: { quantidade: 0, detalhe: 'Sem registros' },
      Dom: { quantidade: 0, detalhe: 'Sem registros' },
    };

    if (visaoGrafico === 'leads') {
      leadsFiltrados.forEach((lead) => {
        const nomeDia = nomesDias[extrairData(lead).getDay()];
        if (mapa[nomeDia]) {
          mapa[nomeDia].quantidade += 1;
          mapa[nomeDia].detalhe =
            lead.interesse || lead.produto || lead.nome || 'Orçamento Solicitado';
        }
      });
    } else {
      transacoesFiltradas.forEach((t) => {
        const tipo = (t.tipo || t.natureza || 'entrada').toLowerCase();
        const isSaida = tipo.includes('saida') || tipo.includes('saída') || tipo.includes('despesa');
        if (!isSaida) {
          const nomeDia = nomesDias[extrairData(t).getDay()];
          const valor = extrairValor(t);
          if (mapa[nomeDia]) {
            mapa[nomeDia].quantidade += valor;
            mapa[nomeDia].detalhe = t.descricao || t.cliente || t.titulo || 'Receita registrada';
          }
        }
      });
    }

    return ordemExibicao.map((dia) => ({
      dia,
      quantidade: mapa[dia].quantidade,
      detalhe: mapa[dia].detalhe,
    }));
  }, [leadsFiltrados, transacoesFiltradas, visaoGrafico]);

  const maxQuantidade = Math.max(...dadosGrafico.map((d) => d.quantidade), 1);

  // Cálculo do Donut Chart (alterna entre Taxa de Atendimento ou Margem Financeira)
  const percentualDonut =
    visaoGrafico === 'leads' ? metricasLeads.taxaResposta : metricasFinanceiras.margem;
  const circunferencia = 377;
  const dashOffset = circunferencia - (circunferencia * percentualDonut) / 100;

  // 🗂️ Últimos 5 Leads e Últimas 5 Transações
  const ultimosLeads = useMemo(
    () => [...leads].sort((a, b) => extrairData(b).getTime() - extrairData(a).getTime()).slice(0, 5),
    [leads]
  );

  const ultimasTransacoes = useMemo(
    () =>
      [...transacoes]
        .sort((a, b) => extrairData(b).getTime() - extrairData(a).getTime())
        .slice(0, 5),
    [transacoes]
  );

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* 1. CABEÇALHO COM FILTRO DE PERÍODO */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-serif font-bold text-zinc-900 tracking-tight">
            Painel de Controle
          </h1>
          <p className="text-sm text-zinc-500 mt-1">
            Visão integrada de conversão comercial e fluxo de caixa da Ark Eucalipto.
          </p>
        </div>

        <div className="flex bg-zinc-200/60 p-1 rounded-xl border border-zinc-200 self-start sm:self-center">
          <button
            onClick={() => setPeriodo('7d')}
            className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all ${
              periodo === '7d' ? 'bg-white text-emerald-900 shadow-sm' : 'text-zinc-500 hover:text-zinc-900'
            }`}
          >
            Últimos 7 dias
          </button>
          <button
            onClick={() => setPeriodo('30d')}
            className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all ${
              periodo === '30d' ? 'bg-white text-emerald-900 shadow-sm' : 'text-zinc-500 hover:text-zinc-900'
            }`}
          >
            Mês Atual
          </button>
        </div>
      </div>

      {/* 2. CARDS DE DESEMPENHO (COMERCIAL + FINANCEIRO) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white border border-zinc-200 rounded-2xl p-5 shadow-sm hover:border-emerald-200 transition-all">
          <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
            Faturamento ({periodo === '7d' ? '7d' : 'Mês'})
          </p>
          <div className="flex items-baseline justify-between mt-2">
            <span className="text-2xl font-serif font-bold text-emerald-800">
              {carregando ? '...' : formatarMoeda(metricasFinanceiras.entradas)}
            </span>
            <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
              Entradas
            </span>
          </div>
        </div>

        <div className="bg-white border border-zinc-200 rounded-2xl p-5 shadow-sm hover:border-emerald-200 transition-all">
          <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
            Saídas / Custos ({periodo === '7d' ? '7d' : 'Mês'})
          </p>
          <div className="flex items-baseline justify-between mt-2">
            <span className="text-2xl font-serif font-bold text-zinc-900">
              {carregando ? '...' : formatarMoeda(metricasFinanceiras.saidas)}
            </span>
            <span className="text-[11px] font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded-full">
              Despesas
            </span>
          </div>
        </div>

        <div className="bg-white border border-zinc-200 rounded-2xl p-5 shadow-sm hover:border-emerald-200 transition-all">
          <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
            Saldo Líquido ({periodo === '7d' ? '7d' : 'Mês'})
          </p>
          <div className="flex items-baseline justify-between mt-2">
            <span
              className={`text-2xl font-serif font-bold ${
                metricasFinanceiras.saldo >= 0 ? 'text-zinc-900' : 'text-red-600'
              }`}
            >
              {carregando ? '...' : formatarMoeda(metricasFinanceiras.saldo)}
            </span>
            <span className="text-[11px] font-bold text-zinc-600 bg-zinc-100 px-2 py-0.5 rounded-full">
              Margem {metricasFinanceiras.margem}%
            </span>
          </div>
        </div>

        <div className="bg-white border border-zinc-200 rounded-2xl p-5 shadow-sm hover:border-emerald-200 transition-all">
          <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
            Entrada de Leads ({periodo === '7d' ? '7d' : 'Mês'})
          </p>
          <div className="flex items-baseline justify-between mt-2">
            <span className="text-2xl font-serif font-bold text-zinc-900">
              {carregando ? '...' : metricasLeads.total}
            </span>
            <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
              {metricasLeads.concluidos} fechados
            </span>
          </div>
        </div>
      </div>

      {/* 3. SESSÃO DO GRÁFICO INTERATIVO */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Bloco do Gráfico de Barras (8 Colunas) */}
        <div className="bg-white border border-zinc-200 rounded-2xl p-6 shadow-sm lg:col-span-8 flex flex-col justify-between">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="font-serif font-bold text-zinc-900 text-lg">
                {visaoGrafico === 'leads'
                  ? 'Fluxo Semanal de Contatos'
                  : 'Faturamento Diário da Semana'}
              </h3>
              <p className="text-xs text-zinc-400 mt-0.5">
                Passe o mouse sobre as barras para inspecionar os detalhes do dia.
              </p>
            </div>

            {/* Alternador Leads vs Financeiro no Gráfico */}
            <div className="flex bg-zinc-100 p-1 rounded-lg self-start">
              <button
                onClick={() => setVisaoGrafico('leads')}
                className={`px-3 py-1 text-xs font-bold rounded-md transition-all ${
                  visaoGrafico === 'leads'
                    ? 'bg-emerald-800 text-white shadow-sm'
                    : 'text-zinc-500 hover:text-zinc-800'
                }`}
              >
                Leads
              </button>
              <button
                onClick={() => setVisaoGrafico('financeiro')}
                className={`px-3 py-1 text-xs font-bold rounded-md transition-all ${
                  visaoGrafico === 'financeiro'
                    ? 'bg-emerald-800 text-white shadow-sm'
                    : 'text-zinc-500 hover:text-zinc-800'
                }`}
              >
                Faturamento (R$)
              </button>
            </div>
          </div>

          {/* Área Prática do Gráfico */}
          <div className="h-64 flex items-end justify-between gap-2 pt-10 pb-2 px-2 relative border-b border-zinc-100">
            {dadosGrafico.map((dado, index) => {
              const alturaPorcentagem =
                dado.quantidade > 0 ? Math.max((dado.quantidade / maxQuantidade) * 100, 8) : 4;
              const estaFocado = focoGrafico === index;

              return (
                <div
                  key={dado.dia}
                  className="flex-1 flex flex-col items-center relative group h-full justify-end"
                  onMouseEnter={() => setFocoGrafico(index)}
                  onMouseLeave={() => setFocoGrafico(null)}
                >
                  {/* TOOLTIP INTERATIVO FLUTUANTE */}
                  <div
                    className={`absolute -top-12 bg-zinc-900 text-white text-[11px] p-2 rounded-xl shadow-xl z-10 pointer-events-none transition-all duration-200 flex flex-col items-center min-w-[135px] ${
                      estaFocado ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-2 scale-95'
                    }`}
                  >
                    <span className="font-bold text-emerald-400">
                      {visaoGrafico === 'leads'
                        ? `${dado.quantidade} Leads`
                        : formatarMoeda(dado.quantidade)}
                    </span>
                    <span className="text-[10px] text-zinc-300 truncate max-w-[125px]">
                      {dado.detalhe}
                    </span>
                    <div className="w-2 h-2 bg-zinc-900 rotate-45 absolute -bottom-1" />
                  </div>

                  {/* A BARRA DO GRÁFICO */}
                  <div
                    style={{ height: `${alturaPorcentagem}%` }}
                    className={`w-full max-w-[40px] rounded-t-lg transition-all duration-500 cursor-pointer ${
                      estaFocado
                        ? 'bg-emerald-500 shadow-lg shadow-emerald-500/20'
                        : dado.quantidade > 0
                        ? 'bg-emerald-900/90 hover:bg-emerald-700'
                        : 'bg-zinc-200'
                    }`}
                  />

                  <span
                    className={`text-xs font-semibold mt-3 transition-colors ${
                      estaFocado ? 'text-emerald-700 font-bold' : 'text-zinc-400'
                    }`}
                  >
                    {dado.dia}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Bloco Lateral de Donut (4 Colunas) */}
        <div className="bg-white border border-zinc-200 rounded-2xl p-6 shadow-sm lg:col-span-4 flex flex-col justify-between">
          <div>
            <h3 className="font-serif font-bold text-zinc-900 text-lg">
              {visaoGrafico === 'leads' ? 'Taxa de Atendimento' : 'Margem Operacional'}
            </h3>
            <p className="text-xs text-zinc-400 mt-0.5">
              {visaoGrafico === 'leads'
                ? 'Proporção de contatos atendidos no período.'
                : 'Percentual líquido sobre as receitas do período.'}
            </p>
          </div>

          <div className="flex items-center justify-center my-6 relative">
            <svg className="w-36 h-36 transform -rotate-90">
              <circle cx="72" cy="72" r="60" stroke="#f4f4f5" strokeWidth="12" fill="transparent" />
              <circle
                cx="72"
                cy="72"
                r="60"
                stroke="#047857"
                strokeWidth="12"
                fill="transparent"
                strokeDasharray={circunferencia}
                strokeDashoffset={dashOffset}
                className="transition-all duration-1000 ease-out"
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute text-center">
              <span className="text-3xl font-serif font-bold text-zinc-900">
                {carregando ? '...' : `${percentualDonut}%`}
              </span>
              <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider mt-0.5">
                {visaoGrafico === 'leads' ? 'Atendidos' : 'Margem'}
              </p>
            </div>
          </div>

          <div className="border-t border-zinc-100 pt-4 flex justify-between text-xs text-zinc-500">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-700" />
              {visaoGrafico === 'leads' ? 'Contatos processados' : 'Resultado líquido'}
            </div>
            <div className="font-bold text-zinc-800">
              {visaoGrafico === 'leads'
                ? `${metricasLeads.dentroDoPrazo} leads`
                : formatarMoeda(metricasFinanceiras.saldo)}
            </div>
          </div>
        </div>
      </div>

      {/* 4. TABELAS RÁPIDAS: ÚLTIMOS LEADS E ÚLTIMAS MOVIMENTAÇÕES FINANCEIRAS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Tabela de Leads */}
        <div className="bg-white border border-zinc-200 rounded-2xl shadow-sm overflow-hidden">
          <div className="p-6 border-b border-zinc-100 flex items-center justify-between">
            <h3 className="text-base font-serif font-bold text-zinc-900">Últimos Contatos Recebidos</h3>
            <a
              href="/dashboard/leads"
              className="text-xs font-bold text-emerald-700 hover:text-emerald-600 transition-colors"
            >
              Ver leads →
            </a>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-zinc-50 text-zinc-400 text-[10px] font-bold uppercase tracking-wider border-b border-zinc-100">
                  <th className="py-3 px-5">Cliente</th>
                  <th className="py-3 px-5">Interesse</th>
                  <th className="py-3 px-5">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 text-sm">
                {ultimosLeads.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="py-6 px-5 text-center text-zinc-400 text-xs">
                      Nenhum lead registrado.
                    </td>
                  </tr>
                ) : (
                  ultimosLeads.map((lead, idx) => (
                    <tr key={lead.id || idx} className="hover:bg-zinc-50/50 transition-colors">
                      <td className="py-3.5 px-5 font-medium text-zinc-900">
                        {lead.nome || lead.cliente || 'Cliente'}
                      </td>
                      <td className="py-3.5 px-5 text-zinc-500 truncate max-w-[160px]">
                        {lead.interesse || lead.produto || 'Orçamento'}
                      </td>
                      <td className="py-3.5 px-5">
                        <span className="bg-emerald-50 text-emerald-700 text-xs px-2.5 py-1 rounded-full font-medium">
                          {lead.status || 'Novo'}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Tabela Financeira */}
        <div className="bg-white border border-zinc-200 rounded-2xl shadow-sm overflow-hidden">
          <div className="p-6 border-b border-zinc-100 flex items-center justify-between">
            <h3 className="text-base font-serif font-bold text-zinc-900">Últimos Lançamentos Financeiros</h3>
            <a
              href="/dashboard/financeiro"
              className="text-xs font-bold text-emerald-700 hover:text-emerald-600 transition-colors"
            >
              Ver financeiro →
            </a>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-zinc-50 text-zinc-400 text-[10px] font-bold uppercase tracking-wider border-b border-zinc-100">
                  <th className="py-3 px-5">Descrição</th>
                  <th className="py-3 px-5">Tipo</th>
                  <th className="py-3 px-5 text-right">Valor</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 text-sm">
                {ultimasTransacoes.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="py-6 px-5 text-center text-zinc-400 text-xs">
                      Nenhuma movimentação financeira registrada.
                    </td>
                  </tr>
                ) : (
                  ultimasTransacoes.map((item, idx) => {
                    const tipo = (item.tipo || item.natureza || 'entrada').toLowerCase();
                    const isSaida =
                      tipo.includes('saida') || tipo.includes('saída') || tipo.includes('despesa');
                    return (
                      <tr key={item.id || idx} className="hover:bg-zinc-50/50 transition-colors">
                        <td className="py-3.5 px-5 font-medium text-zinc-900 truncate max-w-[180px]">
                          {item.descricao || item.titulo || item.cliente || 'Lançamento'}
                        </td>
                        <td className="py-3.5 px-5">
                          <span
                            className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                              isSaida ? 'bg-red-50 text-red-700' : 'bg-emerald-50 text-emerald-700'
                            }`}
                          >
                            {isSaida ? 'Saída' : 'Entrada'}
                          </span>
                        </td>
                        <td
                          className={`py-3.5 px-5 font-bold text-right ${
                            isSaida ? 'text-red-600' : 'text-emerald-800'
                          }`}
                        >
                          {isSaida ? '- ' : '+ '}
                          {formatarMoeda(extrairValor(item))}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}