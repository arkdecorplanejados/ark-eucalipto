'use client';

import { useState, useEffect } from 'react'; // 👈 IMPORTADO O useEffect PARA RESOLVER O BUG DO F5
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Plus, Clock, Trash2 } from 'lucide-react';

interface Agendamento {
  id: string;
  titulo: string;
  tipo: 'reuniao' | 'atividade' | 'entrega';
  data: string; // Formato YYYY-MM-DD
  hora: string;
  descricao?: string;
}

export default function Calendario() {
  const hoje = new Date();
  const [dataSelecionada, setDataSelecionada] = useState<string>(hoje.toISOString().split('T')[0]);
  const [mesAtual, setMesAtual] = useState<number>(hoje.getMonth());
  const [anoAtual, setAnoAtual] = useState<number>(hoje.getFullYear());

  // 📊 Estado inicializa vazio para rodar de forma estável sem conflitos de sincronização no Next.js
  const [compromissos, setCompromissos] = useState<Agendamento[]>([]);

  // 🔄 1. CARREGAMENTO INICIAL E PERSISTÊNCIA DA AGENDA NO NAVEGADOR
  useEffect(() => {
    const dadosLocais = localStorage.getItem('ark_eucalipto_agenda');
    
    if (dadosLocais !== null) {
      // Se o usuário limpou a tabela ou já tem eventos novos, o navegador obedece
      setCompromissos(JSON.parse(dadosLocais));
    } else {
      // Dados de demonstração padrão caso seja o primeiro acesso absoluto do sistema
      const dadosIniciais: Agendamento[] = [
        { id: '1', titulo: 'Reunião Comercial - Fechamento Lote', tipo: 'reuniao', data: '2026-06-02', hora: '14:00', descricao: 'Alinhamento de faturamento direto com construtora.' },
        { id: '2', titulo: 'Manutenção Preventiva Trator', tipo: 'atividade', data: '2026-06-02', hora: '08:00', descricao: 'Troca de óleo e checagem das esteiras.' },
        { id: '3', titulo: 'Entrega Programada - Carga Escoras', tipo: 'entrega', data: '2026-06-05', hora: '10:30', descricao: 'Despachar caminhão truck para Vitória da Conquista.' },
      ];
      setCompromissos(dadosIniciais);
      localStorage.setItem('ark_eucalipto_agenda', JSON.stringify(dadosIniciais));
    }
  }, []);

  // Estado do formulário de novo agendamento
  const [novo, setNovo] = useState({ titulo: '', tipo: 'atividade' as 'reuniao' | 'atividade' | 'entrega', hora: '', descricao: '' });

  // Nomes dos meses para exibição no topo
  const meses = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];

  // 🧮 Lógica matemática para renderizar o grid de dias do mês atual
  const primeiroDiaDoMes = new Date(anoAtual, mesAtual, 1).getDay();
  const diasNoMes = new Date(anoAtual, mesAtual + 1, 0).getDate();
  
  const arrayDias = [];
  for (let i = 0; i < primeiroDiaDoMes; i++) {
    arrayDias.push(null);
  }
  for (let i = 1; i <= diasNoMes; i++) {
    arrayDias.push(i);
  }

  // Navegação de Meses
  const mesAnterior = () => {
    if (mesAtual === 0) {
      setMesAtual(11);
      setAnoAtual(anoAtual - 1);
    } else {
      setMesAtual(mesAtual - 1);
    }
  };

  const proximoMes = () => {
    if (mesAtual === 11) {
      setMesAtual(0);
      setAnoAtual(anoAtual + 1);
    } else {
      setMesAtual(mesAtual + 1);
    }
  };

  // ➕ 2. CRIAR NOVO COMPROMISSO (Salva na tela e grava no localStorage)
  const handleAddAgendamento = () => {
    if (!novo.titulo.trim() || !novo.hora) return alert('Por favor, preencha o título e o horário.');

    const novoItem: Agendamento = {
      id: `evt_${Date.now()}`,
      titulo: novo.titulo,
      tipo: novo.tipo,
      data: dataSelecionada,
      hora: novo.hora,
      descricao: novo.descricao
    };

    const listaAtualizada = [...compromissos, novoItem];

    setCompromissos(listaAtualizada);
    localStorage.setItem('ark_eucalipto_agenda', JSON.stringify(listaAtualizada));
    
    setNovo({ titulo: '', tipo: 'atividade', hora: '', descricao: '' });
  };

  // ❌ 3. REMOVER COMPROMISSO (Sincroniza e limpa de vez do localStorage)
  const handleDeletar = (id: string) => {
    if (confirm('Deseja remover este agendamento do calendário?')) {
      const listaFiltrada = compromissos.filter(c => c.id !== id);
      
      setCompromissos(listaFiltrada);
      localStorage.setItem('ark_eucalipto_agenda', JSON.stringify(listaFiltrada));
    }
  };

  // Filtra compromissos do dia selecionado no grid para exibir na barra lateral
  const compromissosDoDia = compromissos
    .filter(c => c.data === dataSelecionada)
    .sort((a, b) => a.hora.localeCompare(b.hora));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-fadeIn text-zinc-800">
      
      {/* 📅 COLUNA 1: GRID DE DIAS DO CALENDÁRIO */}
      <div className="lg:col-span-7 bg-white border border-zinc-200 rounded-2xl p-5 shadow-sm space-y-4">
        
        {/* Topo / Navegador do calendário */}
        <div className="flex items-center justify-between border-b pb-4">
          <div className="flex items-center gap-2">
            <CalendarIcon className="w-5 h-5 text-emerald-700" />
            <h3 className="font-serif font-black text-lg uppercase tracking-tight text-zinc-900">
              {meses[mesAtual]} <span className="font-sans text-sm font-normal text-zinc-400">/ {anoAtual}</span>
            </h3>
          </div>
          <div className="flex items-center gap-1 bg-zinc-100 p-1 rounded-lg border border-zinc-200">
            <button onClick={mesAnterior} className="p-1 hover:bg-white rounded transition-all"><ChevronLeft className="w-4 h-4" /></button>
            <button onClick={() => { setMesAtual(hoje.getMonth()); setAnoAtual(hoje.getFullYear()); setDataSelecionada(hoje.toISOString().split('T')[0]); }} className="text-[10px] px-2 py-1 font-black uppercase rounded tracking-wider hover:bg-white transition-all">Hoje</button>
            <button onClick={proximoMes} className="p-1 hover:bg-white rounded transition-all"><ChevronRight className="w-4 h-4" /></button>
          </div>
        </div>

        {/* Grid de Dias da Semana */}
        <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-black uppercase text-zinc-400 tracking-wider">
          {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map(d => <div key={d} className="py-1">{d}</div>)}
        </div>

        {/* Grid numérico de dias */}
        <div className="grid grid-cols-7 gap-1.5">
          {arrayDias.map((dia, idx) => {
            if (dia === null) return <div key={`empty-${idx}`} className="aspect-square" />;

            const diaFormatado = `${anoAtual}-${String(mesAtual + 1).padStart(2, '0')}-${String(dia).padStart(2, '0')}`;
            const isSelecionado = diaFormatado === dataSelecionada;
            const isHoje = diaFormatado === hoje.toISOString().split('T')[0];
            
            const temEvento = compromissos.some(c => c.data === diaFormatado);

            return (
              <button
                key={`dia-${dia}`}
                type="button"
                onClick={() => setDataSelecionada(diaFormatado)}
                className={`aspect-square rounded-xl p-1.5 relative flex flex-col justify-between transition-all group font-bold text-xs border ${
                  isSelecionado 
                    ? 'bg-zinc-900 border-zinc-900 text-white shadow-md' 
                    : isHoje 
                      ? 'bg-emerald-50 border-emerald-200 text-emerald-800' 
                      : 'bg-zinc-50/50 border-zinc-100 text-zinc-700 hover:bg-zinc-100/80 hover:border-zinc-200'
                }`}
              >
                <span>{dia}</span>
                {temEvento && (
                  <span className={`w-1.5 h-1.5 rounded-full mx-auto ${isSelecionado ? 'bg-emerald-400' : 'bg-emerald-600'}`} />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* 📋 COLUNA 2: LISTA DE AGENDAMENTOS AND CADASTRO */}
      <div className="lg:col-span-5 space-y-4 flex flex-col justify-between">
        
        {/* Bloco: Lista do Dia */}
        <div className="bg-white border border-zinc-200 rounded-2xl p-5 shadow-sm flex-1 min-h-[250px] space-y-4">
          <div className="border-b pb-3">
            <h4 className="text-xs font-black uppercase text-zinc-400 tracking-wider">Agenda para o dia</h4>
            <p className="text-sm font-serif font-black text-zinc-900 mt-0.5">
              {dataSelecionada.split('-').reverse().join('/')}
            </p>
          </div>

          <div className="space-y-2.5 max-h-[280px] overflow-y-auto pr-1 scrollbar-thin">
            {compromissosDoDia.map(c => (
              <div key={c.id} className="p-3 bg-zinc-50 border rounded-xl flex items-start justify-between gap-3 group hover:border-zinc-300 transition-all">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className={`text-[9px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded border ${
                      c.tipo === 'reuniao' ? 'bg-blue-50 text-blue-700 border-blue-100' :
                      c.tipo === 'entrega' ? 'bg-amber-50 text-amber-700 border-amber-100' : 'bg-purple-50 text-purple-700 border-purple-100'
                    }`}>
                      {c.tipo === 'reuniao' && '🤝 Reunião'}
                      {c.tipo === 'entrega' && '🚛 Entrega'}
                      {c.tipo === 'atividade' && '⚙️ Atividade'}
                    </span>
                    <span className="text-[10px] font-mono font-bold text-zinc-500 flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {c.hora}
                    </span>
                  </div>
                  <h5 className="text-xs font-bold text-zinc-800 leading-tight">{c.titulo}</h5>
                  {c.descricao && <p className="text-[11px] text-zinc-400 font-normal leading-relaxed">{c.descricao}</p>}
                </div>
                <button onClick={() => handleDeletar(c.id)} className="text-zinc-300 hover:text-rose-500 p-1 rounded-lg hover:bg-rose-50 border border-transparent hover:border-rose-100 transition-all">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}

            {compromissosDoDia.length === 0 && (
              <div className="text-center py-12 text-zinc-400 text-xs font-medium border border-dashed rounded-xl bg-zinc-50/50">
                Livre de compromissos para este dia.
              </div>
            )}
          </div>
        </div>

        {/* Bloco: Cadastro Rápido de Agendamento */}
        <div className="bg-zinc-50 border border-zinc-200 rounded-2xl p-5 space-y-3">
          <h4 className="text-xs font-black uppercase text-zinc-700 tracking-wide flex items-center gap-1.5">
            <Plus className="w-3.5 h-3.5 text-emerald-700" /> Agendar Atividade / Reunião
          </h4>
          
          <div className="space-y-2">
            <input 
              type="text" 
              placeholder="Título (Ex: Reunião com Freteiro)" 
              value={novo.titulo} 
              onChange={e => setNovo({...novo, titulo: e.target.value})}
              className="w-full p-2.5 bg-white border rounded-xl text-xs focus:outline-none"
            />
            
            <div className="grid grid-cols-2 gap-2">
              <input 
                type="time" 
                value={novo.hora} 
                onChange={e => setNovo({...novo, hora: e.target.value})}
                className="p-2.5 bg-white border rounded-xl text-xs text-zinc-700 font-mono font-bold focus:outline-none"
              />
              <select 
                value={novo.tipo} 
                onChange={e => setNovo({...novo, tipo: e.target.value as any})}
                className="p-2.5 bg-white border rounded-xl text-xs text-zinc-700 font-bold focus:outline-none"
              >
                <option value="atividade">⚙️ Atividade Diária</option>
                <option value="reuniao">🤝 Reunião / Visita</option>
                <option value="entrega">🚛 Carga / Logística</option>
              </select>
            </div>

            <textarea 
              rows={2}
              placeholder="Notas adicionais ou observações..." 
              value={novo.descricao} 
              onChange={e => setNovo({...novo, descricao: e.target.value})}
              className="w-full p-2.5 bg-white border rounded-xl text-xs resize-none focus:outline-none"
            />
          </div>

          <button 
            type="button" 
            onClick={handleAddAgendamento}
            className="w-full bg-zinc-900 text-white py-2.5 rounded-xl text-xs font-black uppercase tracking-wider hover:bg-emerald-700 transition-colors shadow-sm flex items-center justify-center gap-2"
          >
            Confirmar na Agenda
          </button>
        </div>

      </div>

    </div>
  );
}