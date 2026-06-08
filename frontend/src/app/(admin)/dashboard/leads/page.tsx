'use client';

import { useState, useEffect } from 'react';
import { UserCheck, MessageSquare, Trash2, CheckCircle, Clock, AlertCircle, Search, Layers, Eye, ArrowRight, History } from 'lucide-react';

// 🔍 1. Estrutura expandida para suportar Rastreamento Comercial e de Marketing
interface Interacao {
  data: string;
  texto: string;
}

interface Lead {
  id: string;
  nome: string;
  empresa?: string;
  telefone: string;
  categoria: 'rural' | 'innatura' | 'lenha' | 'tratado'; // 👈 INCLUÍDO 'tratado' E REMOVIDO 'decor'
  origem: string;       
  utm_source?: string;  
  status: 'novo' | 'em_atendimento' | 'ganho' | 'perdido';
  dataCriacao: string;
  historico: Interacao[]; 
}

export default function LeadsPage() {
  // 📥 Carrega os leads salvos localmente ou usa os mockados como base inicial
  const [leads, setLeads] = useState<Lead[]>([]);

  useEffect(() => {
    // Busca dados reais preenchidos no formulário (salvos no localStorage)
    const leadsLocais = localStorage.getItem('ark_eucalipto_leads');
    if (leadsLocais) {
      setLeads(JSON.parse(leadsLocais));
    } else {
      // Leads padrão para o pátio não iniciar vazio no seu primeiro acesso
      const dadosIniciais: Lead[] = [
        { 
          id: 'l1', 
          nome: 'Carlos Henrique', 
          empresa: 'Fazenda Boa Vista', 
          telefone: '77999998888', 
          categoria: 'rural', 
          origem: 'Google Ads', 
          utm_source: 'campanha_mourao_vca',
          status: 'novo', 
          dataCriacao: '2026-06-03',
          historico: [
            { data: '2026-06-03 09:15', texto: '📥 Lead capturado via Formulário do Site Público.' },
            { data: '2026-06-03 09:15', texto: '🌐 Origem detectada: Google / Campanha: Mourão Vitória da Conquista.' }
          ]
        },
        { 
          id: 'l2', 
          nome: 'Engenheiro Marcos', 
          empresa: 'MF Construtora', 
          telefone: '71988887777', 
          categoria: 'innatura', 
          origem: 'Instagram Orgânico', 
          status: 'em_atendimento', 
          dataCriacao: '2026-06-02',
          historico: [
            { data: '2026-06-02 14:20', texto: '📥 Lead clicou no botão flutuante do WhatsApp no site.' },
            { data: '2026-06-03 10:00', texto: '📞 Primeiro contato feito. Cliente avaliando custos de frete CIF.' }
          ]
        }
      ];
      setLeads(dadosIniciais);
      localStorage.setItem('ark_eucalipto_leads', JSON.stringify(dadosIniciais));
    }
  }, []);

  const [busca, setBusca] = useState('');
  const [filtroCategoria, setFiltroCategoria] = useState<string>('todos');
  const [filtroStatus, setFiltroStatus] = useState<string>('todos');
  
  const [leadSelecionado, setLeadSelecionado] = useState<Lead | null>(null);
  const [novaNota, setNovaNota] = useState('');

  // Salva no localStorage sempre que a lista de leads for modificada no painel
  const atualizarPersistencia = (listaNova: Lead[]) => {
    setLeads(listaNova);
    localStorage.setItem('ark_eucalipto_leads', JSON.stringify(listaNova));
  };

  // 🔄 Alterar Status e registrar no rastreamento automaticamente
  const handleMudarStatus = (id: string, novoStatus: Lead['status']) => {
    const dataHoraAtual = new Date().toLocaleString('pt-BR').slice(0, 16);
    
    const statusFormatado: Record<Lead['status'], string> = {
      novo: 'Novo / Pendente',
      em_atendimento: 'Em Atendimento',
      ganho: 'Ganho (Pedido Fechado)',
      perdido: 'Perdido (Negociação Encerrada)'
    };

    const novosLeads = leads.map(l => {
      if (l.id === id) {
        return { 
          ...l, 
          status: novoStatus,
          historico: [
            { data: dataHoraAtual, texto: `🔄 Status alterado pelo comercial para: ${statusFormatado[novoStatus]}.` },
            ...l.historico
          ]
        };
      }
      return l;
    });

    atualizarPersistencia(novosLeads);
    if (leadSelecionado?.id === id) {
      const alvo = novosLeads.find(l => l.id === id);
      if (alvo) setLeadSelecionado(alvo);
    }
  };

  // 📝 Adicionar nota manual de atendimento no histórico de rastreio
  const handleAdicionarNota = () => {
    if (!leadSelecionado || !novaNota.trim()) return;
    const dataHoraAtual = new Date().toLocaleString('pt-BR').slice(0, 16);

    const novosLeads = leads.map(l => {
      if (l.id === leadSelecionado.id) {
        return {
          ...l,
          historico: [{ data: dataHoraAtual, texto: `💬 Nota: ${novaNota}` }, ...l.historico]
        };
      }
      return l;
    });

    atualizarPersistencia(novosLeads);
    setLeadSelecionado(novosLeads.find(l => l.id === leadSelecionado.id) || null);
    setNovaNota('');
  };

  const handleRemoverLead = (id: string) => {
    if (confirm('Remover este lead apagará todo o histórico de rastreamento. Continuar?')) {
      const filtrados = leads.filter(l => l.id !== id);
      atualizarPersistencia(filtrados);
      if (leadSelecionado?.id === id) setLeadSelecionado(null);
    }
  };

  const leadsNovos = leads.filter(l => l.status === 'novo').length;
  const leadsEmAtendimento = leads.filter(l => l.status === 'em_atendimento').length;
  const totalGanhas = leads.filter(l => l.status === 'ganho').length;

  const leadsFiltrados = leads.filter(l => {
    const bateTexto = l.nome.toLowerCase().includes(busca.toLowerCase()) || (l.empresa && l.empresa.toLowerCase().includes(busca.toLowerCase()));
    const bateCategoria = filtroCategoria === 'todos' || l.categoria === filtroCategoria;
    const bateStatus = filtroStatus === 'todos' || l.status === filtroStatus;
    return bateTexto && bateCategoria && bateStatus;
  });

  // Auxiliar para Badge visual amigável das categorias do pátio
  const obterLabelCategoria = (cat: Lead['categoria']) => {
    const mapa = {
      tratado: '🛡️ Tratado Autoclave',
      rural: '🌲 Linha Rural',
      innatura: '🪵 In Natura',
      lenha: '🔥 Biomassa / Lenha'
    };
    return mapa[cat] || cat;
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto p-2 text-zinc-800">
      
      <div className="border-b pb-4">
        <h1 className="text-2xl font-serif font-black text-zinc-900 uppercase tracking-tight">Rastreamento Comercial & CRM</h1>
        <p className="text-zinc-500 text-xs">Identifique a origem do tráfego do pátio e audite a linha do tempo de interações de cada cliente da Ark Eucalipto.</p>
      </div>

      {/* 📊 METRICS */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-zinc-900 text-white p-5 rounded-2xl border flex justify-between items-center">
          <div><span className="text-[10px] font-black uppercase text-zinc-400">Novas Oportunidades</span><h3 className="text-xl font-serif font-black mt-1 text-amber-400">{leadsNovos} Pendentes</h3></div>
          <AlertCircle className="w-5 h-5 text-amber-400" />
        </div>
        <div className="bg-white p-5 rounded-2xl border border-zinc-200 flex justify-between items-center">
          <div><span className="text-[10px] font-black uppercase text-zinc-400">Em Negociação</span><h3 className="text-xl font-serif font-black mt-1 text-blue-600">{leadsEmAtendimento} Contatos</h3></div>
          <Clock className="w-5 h-5 text-blue-500" />
        </div>
        <div className="bg-white p-5 rounded-2xl border border-zinc-200 flex justify-between items-center">
          <div><span className="text-[10px] font-black uppercase text-zinc-400">Conversão de Pátio</span><h3 className="text-xl font-serif font-black mt-1 text-emerald-700">{totalGanhas} Faturados</h3></div>
          <CheckCircle className="w-5 h-5 text-emerald-600" />
        </div>
      </div>

      {/* FILTROS */}
      <div className="bg-zinc-50 border rounded-2xl p-4 flex flex-col md:flex-row gap-3 justify-between items-center shadow-inner">
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 w-4 h-4" />
          <input type="text" placeholder="Buscar por nome ou empresa..." value={busca} onChange={e => setBusca(e.target.value)} className="w-full p-2.5 pl-10 bg-white border rounded-xl text-xs focus:outline-none" />
        </div>
        <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
          <select value={filtroCategoria} onChange={e => setFiltroCategoria(e.target.value)} className="p-2.5 bg-white border rounded-xl text-xs font-bold text-zinc-700 focus:outline-none">
            <option value="todos">🪵 Todas as Categorias</option>
            <option value="tratado">🛡️ Eucalipto Tratado</option> {/* 👈 INCLUÍDO NAS OPÇÕES */}
            <option value="rural">🌲 Linha Rural</option>
            <option value="innatura">🪵 In Natura</option>
            <option value="lenha">🔥 Biomassa / Lenha</option>
          </select>
          <select value={filtroStatus} onChange={e => setFiltroStatus(e.target.value)} className="p-2.5 bg-white border rounded-xl text-xs font-bold text-zinc-700 focus:outline-none">
            <option value="todos">💼 Todos os Status</option>
            <option value="novo">🆕 Novo</option>
            <option value="em_atendimento">⏳ Em Atendimento</option>
            <option value="ganho">✅ Ganho</option>
          </select>
        </div>
      </div>

      {/* 🚀 LAYOUT COM DUAS COLUNAS: LISTAGEM + LINHA DO TEMPO DO LEAD */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Lista de Leads (Esquerda) */}
        <div className="lg:col-span-7 space-y-3">
          <h4 className="text-xs font-black uppercase text-zinc-400 tracking-wider">Oportunidades Ativas</h4>
          
          {leadsFiltrados.length === 0 ? (
            <p className="text-xs text-zinc-400 italic p-4 text-center border border-dashed rounded-xl bg-zinc-50/50">Nenhum lead encontrado com os filtros atuais.</p>
          ) : (
            leadsFiltrados.map((lead) => (
              <div 
                key={lead.id} 
                className={`p-4 border rounded-2xl bg-white shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all ${
                  leadSelecionado?.id === lead.id ? 'ring-2 ring-emerald-700 border-transparent' : 'hover:border-zinc-300'
                }`}
              >
                <div className="space-y-1 max-w-[65%]">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h4 className="text-xs font-black text-zinc-900 tracking-tight">{lead.nome}</h4>
                    {lead.empresa && <span className="text-[9px] font-bold bg-zinc-100 text-zinc-500 px-1.5 py-0.5 rounded border">🏢 {lead.empresa}</span>}
                    {/* Procure por esta linha atual: */}
                    <span className="text-[9px] font-black bg-emerald-50 text-emerald-800 border border-emerald-200 px-1.5 py-0.5 rounded">
                      {obterLabelCategoria(lead.categoria)} {/* 👈 Troque "lead.categoria" por "obterLabelCategoria(lead.categoria)" se já não estiver assim */}
                    </span>
                  </div>
                  <p className="text-[11px] text-zinc-400 font-medium">
                    Rastreio: <span className="text-zinc-600 font-bold">{lead.origem}</span> {lead.utm_source && `(${lead.utm_source})`}
                  </p>
                </div>

                <div className="flex items-center gap-2 justify-end">
                  <select
                    value={lead.status}
                    onChange={e => handleMudarStatus(lead.id, e.target.value as any)}
                    className="p-1.5 rounded-lg text-[11px] font-black uppercase tracking-wider border bg-zinc-50 focus:outline-none"
                  >
                    <option value="novo">🆕 Novo</option>
                    <option value="em_atendimento">⏳ Atendimento</option>
                    <option value="ganho">✅ Ganho</option>
                    <option value="perdido">❌ Perdido</option>
                  </select>

                  <button 
                    type="button" 
                    onClick={() => setLeadSelecionado(lead)}
                    className="p-2 border rounded-xl text-zinc-600 bg-zinc-50 hover:bg-zinc-900 hover:text-white transition-all flex items-center gap-1 text-[11px] font-bold"
                  >
                    <Eye className="w-3.5 h-3.5" /> <span className="hidden sm:inline">Rastrear</span>
                  </button>

                  <button type="button" onClick={() => handleRemoverLead(lead.id)} className="p-2 text-zinc-300 hover:text-rose-500 rounded-lg transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Panel de Rastreamento e Histórico */}
        <div className="lg:col-span-5 bg-white border border-zinc-200 rounded-2xl p-5 shadow-sm space-y-4 sticky top-4">
          {leadSelecionado ? (
            <div className="space-y-4">
              <div className="border-b pb-3 flex justify-between items-start">
                <div>
                  <span className="text-[9px] font-black uppercase text-zinc-400 tracking-widest block">Linha do Tempo Comercial</span>
                  <h4 className="font-serif font-black text-base text-zinc-900 tracking-tight">{leadSelecionado.nome}</h4>
                  <p className="text-[11px] text-zinc-500">{leadSelecionado.empresa || 'Pessoa Física'} — 📞 {leadSelecionado.telefone}</p>
                </div>
                <span className="text-[10px] font-mono font-bold bg-zinc-900 text-white px-2 py-0.5 rounded">
                  {leadSelecionado.origem}
                </span>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-zinc-400 block">Registrar Interação / Atualização</label>
                <div className="flex gap-2">
                  <input 
                    type="text" 
                    placeholder="Ex: Ligado para o cliente, aceitou o orçamento..." 
                    value={novaNota} 
                    onChange={e => setNovaNota(e.target.value)}
                    className="flex-1 p-2 bg-zinc-50 border rounded-xl text-xs focus:outline-none focus:bg-white"
                  />
                  <button 
                    type="button" 
                    onClick={handleAdicionarNota}
                    className="bg-emerald-700 text-white px-3 py-2 rounded-xl text-xs font-bold hover:bg-emerald-800 transition-colors"
                  >
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase text-zinc-400 tracking-wider flex items-center gap-1">
                  <History className="w-3.5 h-3.5 text-zinc-400" /> Trilha de Eventos do Lead
                </label>
                
                <div className="space-y-3 max-h-[220px] overflow-y-auto pr-1 scrollbar-thin divide-y divide-zinc-100">
                  {leadSelecionado.historico.map((h, i) => (
                    <div key={i} className="pt-2 text-xs space-y-0.5 first:pt-0">
                      <span className="text-[10px] text-zinc-400 font-mono font-bold block">{h.data}</span>
                      <p className="text-zinc-600 font-medium leading-relaxed">{h.texto}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-24 text-zinc-400 text-xs font-medium border border-dashed rounded-xl bg-zinc-50/50 flex flex-col items-center justify-center gap-2">
              <span>🕵️‍♂️</span>
              <span>Selecione um lead na lista para escanear a origem e auditar o histórico de atendimento do pátio.</span>
            </div>
          )}
        </div>

      </div>

    </div>
  );
}