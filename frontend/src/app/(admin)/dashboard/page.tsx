'use client';

import { useState } from 'react';

export default function DashboardPage() {
  // Estado para controlar qual barra do gráfico está com o mouse por cima (Tooltip)
  const [focoGrafico, setFocoGrafico] = useState<number | null>(null);
  
  // Estado para simular um filtro de período interativo
  const [periodo, setPeriodo] = useState<'7d' | '30d'>('7d');

  // Dados estruturados para o gráfico de Leads por Dia (Tons de Verde)
  const dadosGrafico = [
    { dia: 'Seg', quantidade: 12, valor: 'R$ 4.200' },
    { dia: 'Ter', quantidade: 19, valor: 'R$ 7.800' },
    { dia: 'Qua', quantidade: 15, valor: 'R$ 5.100' },
    { dia: 'Qui', quantidade: 27, valor: 'Mesa de Jantar Grande' },
    { dia: 'Sex', quantidade: 32, valor: 'Lote Mourões Tratados' },
    { dia: 'Sáb', quantidade: 8,  valor: 'R$ 2.900' },
    { dia: 'Dom', quantidade: 5,  valor: 'R$ 1.500' },
  ];

  // Encontra o maior valor para calcular a altura proporcional de forma dinâmica
  const maxQuantidade = Math.max(...dadosGrafico.map(d => d.quantidade));

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      
      {/* 1. CABEÇALHO COM FILTRO INTERATIVO */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-serif font-bold text-zinc-900 tracking-tight">
            Painel de Controle
          </h1>
          <p className="text-sm text-zinc-500 mt-1">
            Análise de conversão e entrada de novos leads para a Ark Eucalipto.
          </p>
        </div>

        {/* Botões de Filtro */}
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

      {/* 2. CARDS MÉTRICOS COMPACTOS NO TOPO */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-white border border-zinc-200 rounded-2xl p-6 shadow-sm hover:border-emerald-200 transition-all">
          <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Entrada de Leads</p>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-3xl font-serif font-bold text-zinc-900">118</span>
            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">+18%</span>
          </div>
        </div>

        <div className="bg-white border border-zinc-200 rounded-2xl p-6 shadow-sm hover:border-emerald-200 transition-all">
          <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Taxa de Resposta</p>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-3xl font-serif font-bold text-zinc-900">92%</span>
            <span className="text-xs font-bold text-zinc-500 bg-zinc-100 px-2 py-0.5 rounded-full">Excelente</span>
          </div>
        </div>

        <div className="bg-white border border-zinc-200 rounded-2xl p-6 shadow-sm hover:border-emerald-200 transition-all">
          <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Conversões Concluídas</p>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-3xl font-serif font-bold text-zinc-900">34</span>
            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">Meta Batida</span>
          </div>
        </div>
      </div>

      {/* 3. SESSÃO DO GRÁFICO INTERATIVO */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Bloco do Gráfico de Barras (8 Colunas) */}
        <div className="bg-white border border-zinc-200 rounded-2xl p-6 shadow-sm lg:col-span-8 flex flex-col justify-between">
          <div>
            <h3 className="font-serif font-bold text-zinc-900 text-lg">Fluxo Semanal de Contatos</h3>
            <p className="text-xs text-zinc-400 mt-0.5">Passe o mouse sobre as barras para ver os detalhes da maior demanda.</p>
          </div>

          {/* Área Prática do Gráfico */}
          <div className="h-64 flex items-end justify-between gap-2 pt-10 pb-2 px-2 relative border-b border-zinc-100">
            
            {dadosGrafico.map((dado, index) => {
              const alturaPorcentagem = (dado.quantidade / maxQuantidade) * 100;
              const estaFocado = focoGrafico === index;

              return (
                <div
                  key={dado.dia}
                  className="flex-1 flex flex-col items-center relative group"
                  onMouseEnter={() => setFocoGrafico(index)} // 🚀 Corrigido aqui
                  onMouseLeave={() => setFocoGrafico(null)}  // 🚀 Corrigido aqui
                >
                  {/* TOOLTIP INTERATIVO FLUTUANTE */}
                  <div
                    className={`absolute -top-12 bg-zinc-900 text-white text-[11px] p-2 rounded-xl shadow-xl z-10 pointer-events-none transition-all duration-200 flex flex-col items-center min-w-[120px] ${
                      estaFocado ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-2 scale-95'
                    }`}
                  >
                    <span className="font-bold text-emerald-400">{dado.quantidade} Leads</span>
                    <span className="text-[10px] text-zinc-400 truncate max-w-[110px]">{dado.valor}</span>
                    <div className="w-2 h-2 bg-zinc-900 rotate-45 absolute -bottom-1" />
                  </div>

                  {/* A BARRA DO GRÁFICO */}
                  <div
                    style={{ height: `${alturaPorcentagem}%` }}
                    className={`w-full max-w-[40px] rounded-t-lg transition-all duration-500 cursor-pointer ${
                      estaFocado 
                        ? 'bg-emerald-500 shadow-lg shadow-emerald-500/20' 
                        : 'bg-emerald-900/90 hover:bg-emerald-700'
                    }`}
                  />
                  
                  {/* Legenda do Dia */}
                  <span className={`text-xs font-semibold mt-3 transition-colors ${
                    estaFocado ? 'text-emerald-700 font-bold' : 'text-zinc-400'
                  }`}>
                    {dado.dia}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Bloco Lateral de Donut/Meta de Desempenho (4 Colunas) */}
        <div className="bg-white border border-zinc-200 rounded-2xl p-6 shadow-sm lg:col-span-4 flex flex-col justify-between">
          <div>
            <h3 className="font-serif font-bold text-zinc-900 text-lg">Meta de Atendimento</h3>
            <p className="text-xs text-zinc-400 mt-0.5">Capacidade de retorno em menos de 2h.</p>
          </div>

          {/* Gráfico de Rosca/Círculo usando puro CSS SVG */}
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
                strokeDasharray="377"
                strokeDashoffset="94"
                className="transition-all duration-1000 ease-out"
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute text-center">
              <span className="text-3xl font-serif font-bold text-zinc-900">75%</span>
              <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider mt-0.5">Da Meta</p>
            </div>
          </div>

          {/* Legenda Inferior */}
          <div className="border-t border-zinc-100 pt-4 flex justify-between text-xs text-zinc-500">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-700" />
              Dentro do prazo
            </div>
            <div className="font-bold text-zinc-800">89 leads</div>
          </div>
        </div>

      </div>

      {/* 4. TABELA DE LEADS RÁPIDA ABAIXO DOS GRÁFICOS */}
      <div className="bg-white border border-zinc-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="p-6 border-b border-zinc-100 flex items-center justify-between">
          <h3 className="text-lg font-serif font-bold text-zinc-900">Últimos Contatos Recebidos</h3>
          <a href="/dashboard/leads" className="text-xs font-bold text-emerald-700 hover:text-emerald-600 transition-colors">
            Ver todos os leads →
          </a>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-zinc-50 text-zinc-400 text-[10px] font-bold uppercase tracking-wider border-b border-zinc-100">
                <th className="py-3.5 px-6">Cliente / Empresa</th>
                <th className="py-3.5 px-6">Interesse Principal</th>
                <th className="py-3.5 px-6">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 text-sm">
              <tr className="hover:bg-zinc-50/50 transition-colors">
                <td className="py-4 px-6 font-medium text-zinc-900">Fazenda Vale do Eucalipto</td>
                <td className="py-4 px-6 text-zinc-500">Eucalipto Tratado para Cerca</td>
                <td className="py-4 px-6">
                  <span className="bg-amber-50 text-amber-700 text-xs px-2.5 py-1 rounded-full font-medium">Aguardando Orçamento</span>
                </td>
              </tr>
              <tr className="hover:bg-zinc-50/50 transition-colors">
                <td className="py-4 px-6 font-medium text-zinc-900">Indústria de Cercas Conquista</td>
                <td className="py-4 px-6 text-zinc-500">Madeira Bruta para Estruturas</td>
                <td className="py-4 px-6">
                  <span className="bg-emerald-50 text-emerald-700 text-xs px-2.5 py-1 rounded-full font-medium">Atendimento Iniciado</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}