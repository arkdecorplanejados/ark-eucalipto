'use client';

import { useState, useEffect } from 'react';
import { Mail, Copy, Check, Calendar, UserCheck, MessageSquare, Trash2, CheckCircle, Clock, AlertCircle, Search, Target, Users, Eye, ArrowRight, History } from 'lucide-react';

interface Interacao {
  data: string;
  texto: string;
}

interface LeadProspeccao {
  id: string;
  companyName: string;
  segment: string;
  contactName?: string;
  phone?: string;
  email?: string;
  location: string;
  status: 'NEW' | 'CONTACTED' | 'WON' | 'LOST';
  aiScore: number;
  aiJustification?: string;
  createdAt: string;
}

interface LeadNewsletter {
  id: string;
  email: string;
  dataInscricao?: {
    _seconds: number;
  };
}

export default function LeadsPage() {
  // 🎛️ Controle de Abas Administrativas
  const [abaAtiva, setAbaAtiva] = useState<'prospeccao' | 'newsletter'>('prospeccao');

  // 📡 Estados de Dados vindos da API da Render (Firebase)
  const [leadsProspeccao, setLeadsProspeccao] = useState<LeadProspeccao[]>([]);
  const [emailsNewsletter, setEmailsNewsletter] = useState<LeadNewsletter[]>([]);
  const [carregando, setCarregando] = useState(true);
  
  // 🔍 Filtros e Pesquisas
  const [busca, setBusca] = useState('');
  const [filtroSegmento, setFiltroSegmento] = useState('todos');
  const [filtroStatus, setFiltroStatus] = useState('todos');
  
  // 📋 Estado de Cópia e Seleção
  const [leadSelecionado, setLeadSelecionado] = useState<LeadProspeccao | null>(null);
  const [copiado, setCopiado] = useState(false);

  // 📥 Busca unificada de dados reais do ecossistema Ark
  useEffect(() => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
    
    Promise.all([
      fetch(`${apiUrl}/api/leads`).then(res => res.json()),
      fetch(`${apiUrl}/api/leads/newsletter`).then(res => res.json())
    ])
      .then(([dadosLeads, dadosNews]) => {
        if (Array.isArray(dadosLeads)) setLeadsProspeccao(dadosLeads);
        if (Array.isArray(dadosNews)) setEmailsNewsletter(dadosNews);
        setCarregando(false);
      })
      .catch(err => {
        console.error('Erro ao conectar ao barramento comercial:', err);
        setCarregando(false);
      });
  }, []);

  // 📋 Copiar lista de transmissão da newsletter separada por vírgulas
  const copiarListaNewsletter = () => {
    if (emailsNewsletter.length === 0) return;
    const listaTexto = emailsNewsletter.map(e => e.email).join(', ');
    navigator.clipboard.writeText(listaTexto);
    setCopiado(true);
    setTimeout(() => setCopiado(false), 2000);
  };

  // 🔄 Filtros dinâmicos aplicados na aba de prospecção ativa
  const leadsFiltrados = leadsProspeccao.filter(l => {
    const termo = busca.toLowerCase();
    const bateTexto = l.companyName.toLowerCase().includes(termo) || 
                      (l.contactName && l.contactName.toLowerCase().includes(termo));
    const bateSegmento = filtroSegmento === 'todos' || l.segment === filtroSegmento;
    const bateStatus = filtroStatus === 'todos' || l.status === filtroStatus;
    return bateTexto && bateSegmento && bateStatus;
  });

  // 📊 Métricas calculadas em tempo real com base no Firestore
  const novosLeads = leadsProspeccao.filter(l => l.status === 'NEW').length;
  const emAtendimento = leadsProspeccao.filter(l => l.status === 'CONTACTED').length;
  const totalFaturados = leadsProspeccao.filter(l => l.status === 'WON').length;

  if (carregando) {
    return (
      <div className="p-12 text-center text-zinc-400 text-xs animate-pulse font-medium">
        Sincronizando central de inteligência comercial Ark...
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto p-4 text-zinc-800">
      
      {/* 👑 TÍTULO DO MÓDULO */}
      <div className="border-b pb-4">
        <h1 className="text-2xl font-serif font-black text-zinc-900 uppercase tracking-tight">Central de Inteligência Comercial</h1>
        <p className="text-zinc-500 text-xs">Audite leads de prospecção pesada gerados por inteligência artificial ou capture a lista de transmissão do site público.</p>
      </div>

      {/* 📊 METRICAS EM TEMPO REAL */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-zinc-900 text-white p-5 rounded-2xl border flex justify-between items-center shadow-sm">
          <div>
            <span className="text-[10px] font-black uppercase text-zinc-400">Novas Oportunidades</span>
            <h3 className="text-xl font-serif font-black mt-1 text-amber-400">{novosLeads} Pendentes</h3>
          </div>
          <AlertCircle className="w-5 h-5 text-amber-400" />
        </div>
        <div className="bg-white p-5 rounded-2xl border border-zinc-200 flex justify-between items-center shadow-sm">
          <div>
            <span className="text-[10px] font-black uppercase text-zinc-400">Em Negociação</span>
            <h3 className="text-xl font-serif font-black mt-1 text-blue-600">{emAtendimento} Contatos</h3>
          </div>
          <Clock className="w-5 h-5 text-blue-500" />
        </div>
        <div className="bg-white p-5 rounded-2xl border border-zinc-200 flex justify-between items-center shadow-sm">
          <div>
            <span className="text-[10px] font-black uppercase text-zinc-400">Conversão de Pátio</span>
            <h3 className="text-xl font-serif font-black mt-1 text-emerald-700">{totalFaturados} Faturados</h3>
          </div>
          <CheckCircle className="w-5 h-5 text-emerald-600" />
        </div>
      </div>

      {/* 🎛️ ALTERNADOR DE ABAS CORPORATIVAS */}
      <div className="flex border-b border-zinc-200 gap-6 text-xs font-black uppercase tracking-wider pt-2">
        <button
          onClick={() => setAbaAtiva('prospeccao')}
          className={`pb-3 flex items-center gap-2 border-b-2 transition-all ${
            abaAtiva === 'prospeccao' 
              ? 'border-emerald-700 text-emerald-800' 
              : 'border-transparent text-zinc-400 hover:text-zinc-600'
          }`}
        >
          <Target className="w-4 h-4" />
          Prospecção de IA ({leadsProspeccao.length})
        </button>
        
        <button
          onClick={() => setAbaAtiva('newsletter')}
          className={`pb-3 flex items-center gap-2 border-b-2 transition-all ${
            abaAtiva === 'newsletter' 
              ? 'border-emerald-700 text-emerald-800' 
              : 'border-transparent text-zinc-400 hover:text-zinc-600'
          }`}
        >
          <Users className="w-4 h-4" />
          Newsletter do Site ({emailsNewsletter.length})
        </button>
      </div>

      {/* 📋 CONTEÚDO DA ABA 1: PROSPECÇÃO ATIVA DE CLIENTES (IA) */}
      {abaAtiva === 'prospeccao' && (
        <div className="space-y-6">
          {/* BARRA DE FILTROS */}
          <div className="bg-zinc-50 border rounded-2xl p-4 flex flex-col md:flex-row gap-3 justify-between items-center shadow-inner">
            <div className="relative w-full md:w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 w-4 h-4" />
              <input type="text" placeholder="Buscar por empresa ou contato..." value={busca} onChange={e => setBusca(e.target.value)} className="w-full p-2.5 pl-10 bg-white border rounded-xl text-xs focus:outline-none" />
            </div>
            <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
              <select value={filtroSegmento} onChange={e => setFiltroSegmento(e.target.value)} className="p-2.5 bg-white border rounded-xl text-xs font-bold text-zinc-700 focus:outline-none">
                <option value="todos">🪵 Todos os Segmentos</option>
                <option value="CONSTRUTORA">🏗️ Construtoras / Obras</option>
                <option value="FAZENDA">🌾 Agronegócio / Rural</option>
                <option value="INDUSTRIA_CERCA">🏭 Distribuidores / Indústria</option>
              </select>
              <select value={filtroStatus} onChange={e => setFiltroStatus(e.target.value)} className="p-2.5 bg-white border rounded-xl text-xs font-bold text-zinc-700 focus:outline-none">
                <option value="todos">💼 Todos os Status</option>
                <option value="NEW">🆕 Novo Lead</option>
                <option value="CONTACTED">⏳ Em Atendimento</option>
                <option value="WON">✅ Pedido Ganho</option>
                <option value="LOST">❌ Perdido</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Tabela de Oportunidades */}
            <div className="lg:col-span-7 space-y-3">
              {leadsFiltrados.length === 0 ? (
                <p className="text-xs text-zinc-400 italic p-8 text-center border border-dashed rounded-xl bg-zinc-50/50">Nenhum alvo comercial localizado nos filtros selecionados.</p>
              ) : (
                leadsFiltrados.map((lead) => (
                  <div 
                    key={lead.id} 
                    className={`p-4 border rounded-2xl bg-white shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all ${
                      leadSelecionado?.id === lead.id ? 'ring-2 ring-emerald-700 border-transparent' : 'hover:border-zinc-300'
                    }`}
                  >
                    <div className="space-y-1 max-w-[70%]">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="text-sm font-serif font-black text-zinc-900 tracking-tight">{lead.companyName}</h4>
                        <span className="text-[9px] font-black bg-zinc-100 text-zinc-500 border px-1.5 py-0.5 rounded uppercase">{lead.segment}</span>
                        <span className={`text-[9px] font-black border px-1.5 py-0.5 rounded ${lead.aiScore >= 75 ? 'bg-emerald-50 text-emerald-800 border-emerald-200' : 'bg-zinc-50 text-zinc-600'}`}>
                          🎯 Score: {lead.aiScore}%
                        </span>
                      </div>
                      <p className="text-[11px] text-zinc-400 font-medium">Localidade: <span className="text-zinc-600 font-bold">{lead.location}</span></p>
                    </div>

                    <div className="flex items-center gap-2 justify-end">
                      <span className={`px-2 py-1 rounded-lg text-[9px] font-black uppercase tracking-wider border ${
                        lead.status === 'NEW' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                        lead.status === 'CONTACTED' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                        lead.status === 'WON' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-rose-50 text-rose-700 border-rose-200'
                      }`}>
                        {lead.status === 'NEW' ? '🆕 Novo' : lead.status === 'CONTACTED' ? '⏳ Contato' : lead.status === 'WON' ? '✅ Ganho' : '❌ Perdido'}
                      </span>
                      <button type="button" onClick={() => setLeadSelecionado(lead)} className="p-2 border rounded-xl text-zinc-600 bg-zinc-50 hover:bg-zinc-900 hover:text-white transition-all flex items-center gap-1 text-[11px] font-bold">
                        <Eye className="w-3.5 h-3.5" /> <span className="hidden sm:inline">Analisar</span>
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Painel de Auditoria Lateral */}
            <div className="lg:col-span-5 bg-white border border-zinc-200 rounded-2xl p-5 shadow-sm space-y-4 sticky top-4">
              {leadSelecionado ? (
                <div className="space-y-4">
                  <div className="border-b pb-3">
                    <span className="text-[9px] font-black uppercase text-emerald-600 tracking-widest block">Justificativa de Prospecção</span>
                    <h4 className="font-serif font-black text-base text-zinc-900 tracking-tight">{leadSelecionado.companyName}</h4>
                    <p className="text-xs text-zinc-500 mt-1 leading-relaxed">{leadSelecionado.aiJustification || 'Sem justificativa detalhada pela IA.'}</p>
                  </div>
                  <div className="space-y-2 text-xs">
                    <p className="text-zinc-400 font-medium">👤 Contato: <span className="text-zinc-800 font-bold">{leadSelecionado.contactName || 'Não Mapeado'}</span></p>
                    <p className="text-zinc-400 font-medium">📞 Telefone: <span className="text-zinc-900 font-mono font-bold select-all">{leadSelecionado.phone || 'Sem número'}</span></p>
                    <p className="text-zinc-400 font-medium">✉️ E-mail: <span className="text-zinc-900 font-mono font-medium select-all">{leadSelecionado.email || 'Sem e-mail'}</span></p>
                  </div>
                </div>
              ) : (
                <div className="text-center py-20 text-zinc-400 text-xs font-medium border border-dashed rounded-xl bg-zinc-50/50 flex flex-col items-center justify-center gap-2">
                  <span>🕵️‍♂️</span>
                  <span>Selecione uma empresa Prospectada na lista para escanear os canais de contato e a justificativa da IA.</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 📊 CONTEÚDO DA ABA 2: LEADS DE CAPTURA DA NEWSLETTER INSTITUCIONAL */}
      {abaAtiva === 'newsletter' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center border border-zinc-100 bg-zinc-50/50 rounded-xl p-4">
            <p className="text-xs text-zinc-500 font-medium">Gere listas de transmissão unificadas para envio em lote de informativos rurais e tabelas brutas de pátio.</p>
            <button
              onClick={copiarListaNewsletter}
              disabled={emailsNewsletter.length === 0}
              className="inline-flex h-9 items-center gap-2 bg-zinc-950 hover:bg-zinc-800 disabled:bg-zinc-100 disabled:text-zinc-400 text-white font-bold text-[10px] uppercase tracking-wider px-4 rounded-xl transition-all shadow-sm whitespace-nowrap"
            >
              {copiado ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              {copiado ? 'Copiado!' : `Copiar Lista (${emailsNewsletter.length})`}
            </button>
          </div>

          <div className="overflow-hidden border border-zinc-200 rounded-2xl bg-white shadow-sm">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-zinc-50 border-b border-zinc-200 text-[10px] font-black text-zinc-400 uppercase tracking-widest">
                  <th className="p-4">E-mail de Contato Capturado</th>
                  <th className="p-4">Data de Ingresso</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 text-xs font-semibold text-zinc-700">
                {emailsNewsletter.length > 0 ? (
                  emailsNewsletter.map((item, idx) => (
                    <tr key={item.id || idx} className="hover:bg-zinc-50/40 transition-colors">
                      <td className="p-4 flex items-center gap-2.5 font-mono text-zinc-900 select-all">
                        <Mail className="w-4 h-4 text-zinc-300" />
                        {item.email}
                      </td>
                      <td className="p-4 text-zinc-400 inline-flex items-center gap-1.5 font-normal">
                        <Calendar className="w-3.5 h-3.5 text-zinc-300" />
                        {item.dataInscricao?._seconds 
                          ? new Date(item.dataInscricao._seconds * 1000).toLocaleDateString('pt-BR')
                          : new Date().toLocaleDateString('pt-BR')
                        }
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={2} className="p-12 text-center text-zinc-400 font-normal">Nenhum lead preencheu o campo da newsletter no site até o momento.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
}