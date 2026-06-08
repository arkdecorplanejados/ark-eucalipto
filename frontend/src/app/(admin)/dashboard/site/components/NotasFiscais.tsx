'use client';

import { useState, useEffect } from 'react';
import { FileText, Plus, Trash2, Search, CheckCircle, XCircle, Clock, ExternalLink } from 'lucide-react';

interface NotaFiscal {
  id: string;
  numero: string;
  serie: string;
  cliente: string;
  tipo: 'saida' | 'entrada';
  valor: number;
  chaveAcesso: string;
  status: 'emitida' | 'cancelada' | 'aguardando';
  dataEmissao: string;
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

export default function NotasFiscais() {
  const hoje = '2026-06-07'; // Ajustado dinamicamente para sincronizar cronologicamente com o pátio

  const [notas, setNotas] = useState<NotaFiscal[]>([]);
  const [novo, setNovo] = useState({ numero: '', serie: '1', cliente: '', tipo: 'saida' as 'saida' | 'entrada', valor: '', chaveAcesso: '', status: 'emitida' as any, dataEmissao: hoje });
  const [busca, setBusca] = useState('');

  // 🔄 1. CARREGAMENTO INICIAL E PERSISTÊNCIA DAS NOTAS NO NAVEGADOR (FIXO CONTRA RESET)
  useEffect(() => {
    const dadosLocais = localStorage.getItem('ark_eucalipto_notas');
    if (dadosLocais !== null) {
      setNotas(JSON.parse(dadosLocais));
    } else {
      const dadosIniciais: NotaFiscal[] = [
        { id: 'nf_1', numero: '000104', serie: '1', cliente: 'Construtora Vale do Sol', tipo: 'saida', valor: 14500.00, chaveAcesso: '29260600000000000000550010000001041000000001', status: 'emitida', dataEmissao: hoje },
        { id: 'nf_2', numero: '000105', serie: '1', cliente: 'Fazenda Barreiro Seco', tipo: 'saida', valor: 4200.00, chaveAcesso: '29260600000000000000550010000001051000000002', status: 'aguardando', dataEmissao: hoje },
        { id: 'nf_3', numero: '000054', serie: '3', cliente: 'Fornecedor Florestal BA', tipo: 'entrada', valor: 8900.00, chaveAcesso: '29260500000000000000550030000000541000000003', status: 'emitida', dataEmissao: '2026-05-28' },
      ];
      setNotas(dadosIniciais);
      localStorage.setItem('ark_eucalipto_notas', JSON.stringify(dadosIniciais));
    }
  }, []);

  // ➕ 2. ADICIONAR NOVA NOTA
  const handleAddNF = () => {
    if (!novo.numero.trim() || !novo.cliente.trim() || !novo.valor) {
      return alert('Por favor, preencha o número da NF, o cliente e o valor bruto.');
    }

    const valorTratado = converterStringParaNumero(novo.valor);
    if (valorTratado <= 0) return alert('Por favor, digite um valor maior que zero.');

    // Remove qualquer espaço residual de segurança antes de subir para o estado
    const chaveLimpa = novo.chaveAcesso.replace(/\s/g, '');

    const novaNF: NotaFiscal = {
      id: `nf_${Date.now()}`,
      numero: novo.numero.padStart(6, '0'), 
      serie: novo.serie || '1',
      cliente: novo.cliente,
      tipo: novo.tipo,
      valor: valorTratado, 
      chaveAcesso: chaveLimpa || 'Chave não gerada',
      status: novo.status,
      dataEmissao: novo.dataEmissao || hoje
    };

    const listaAtualizada = [novaNF, ...notas];
    setNotas(listaAtualizada);
    localStorage.setItem('ark_eucalipto_notas', JSON.stringify(listaAtualizada));
    
    setNovo({ numero: '', serie: '1', cliente: '', tipo: 'saida', valor: '', chaveAcesso: '', status: 'emitida', dataEmissao: hoje });
  };

  const handleDeletar = (id: string) => {
    if (confirm('Deseja remover o registro desta nota fiscal do painel?')) {
      const listaFiltrada = notas.filter(n => n.id !== id);
      setNotas(listaFiltrada);
      localStorage.setItem('ark_eucalipto_notas', JSON.stringify(listaFiltrada));
    }
  };

  const totalFaturadoSaida = notas.filter(n => n.tipo === 'saida' && n.status === 'emitida').reduce((acc, cur) => acc + cur.valor, 0);
  const nfsAguardando = notas.filter(n => n.status === 'aguardando').length;

  const notasFiltradas = notas.filter(n => {
    const termo = busca.toLowerCase();
    return n.numero.includes(termo) || n.cliente.toLowerCase().includes(termo);
  });

  return (
    <div className="space-y-6 text-zinc-800">
      
      {/* METRICS CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-zinc-900 text-white p-5 rounded-2xl border border-zinc-800 shadow-sm">
          <span className="text-[10px] font-black uppercase text-zinc-400 tracking-wider">Faturamento NF-e (Saídas)</span>
          <h3 className="text-xl font-serif font-black mt-2 text-emerald-400">
            R$ {totalFaturadoSaida.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </h3>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-zinc-200 shadow-sm">
          <span className="text-[10px] font-black uppercase text-zinc-400 tracking-wider">Notas em Pendência</span>
          <h3 className="text-xl font-serif font-black mt-2 text-amber-600 flex items-center gap-2">
            <Clock className="w-5 h-5 text-amber-500 animate-pulse" /> {nfsAguardando} {nfsAguardando === 1 ? 'Nota' : 'Notas'}
          </h3>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-zinc-200 shadow-sm">
          <span className="text-[10px] font-black uppercase text-zinc-400 tracking-wider">Total de Notas Registradas</span>
          <h3 className="text-xl font-serif font-black mt-2 text-zinc-800">
            {notas.length} Documentos
          </h3>
        </div>
      </div>

      {/* FORMULÁRIO DE LANÇAMENTO FISCAL */}
      <div className="bg-zinc-50 border rounded-2xl p-5 space-y-4">
        <h4 className="text-xs font-black uppercase text-zinc-700 tracking-wide flex items-center gap-1.5">
          <FileText className="w-4 h-4 text-emerald-700" /> Lançar Emissão de Nota Fiscal (NF-e)
        </h4>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-12 gap-3">
          <div className="md:col-span-2 space-y-1">
            <label className="text-[9px] font-black uppercase text-zinc-400">Operação</label>
            <select value={novo.tipo} onChange={e => setNovo({...novo, tipo: e.target.value as any})} className="w-full p-2.5 bg-white border rounded-xl text-xs font-bold text-zinc-700">
              <option value="saida">📈 Saída (Venda)</option>
              <option value="entrada">📉 Entrada (Compra)</option>
            </select>
          </div>

          <div className="md:col-span-2 space-y-1">
            <label className="text-[9px] font-black uppercase text-zinc-400">Número NF</label>
            <input type="text" placeholder="Ex: 104" value={novo.numero} onChange={e => setNovo({...novo, numero: e.target.value})} className="w-full p-2.5 bg-white border rounded-xl text-xs font-bold" />
          </div>

          <div className="md:col-span-1 space-y-1">
            <label className="text-[9px] font-black uppercase text-zinc-400">Série</label>
            <input type="text" value={novo.serie} onChange={e => setNovo({...novo, serie: e.target.value})} className="w-full p-2.5 bg-white border rounded-xl text-xs text-center font-bold" />
          </div>

          <div className="md:col-span-4 space-y-1">
            <label className="text-[9px] font-black uppercase text-zinc-400">Destinatário / Cliente / Emitente</label>
            <input type="text" placeholder="Razão Social ou Nome Completo" value={novo.cliente} onChange={e => setNovo({...novo, cliente: e.target.value})} className="w-full p-2.5 bg-white border rounded-xl text-xs font-medium" />
          </div>

          <div className="md:col-span-3 space-y-1">
            <label className="text-[9px] font-black uppercase text-zinc-400">Valor Bruto da NF</label>
            <input 
              type="text" 
              placeholder="R$ 0,00" 
              value={novo.valor} 
              onChange={e => setNovo({...novo, valor: aplicarMascaraDinheiro(e.target.value)})} 
              className="w-full p-2.5 bg-white border rounded-xl text-xs font-mono font-bold text-zinc-800" 
            />
          </div>

          {/* 🟢 CAMPO ATUALIZADO: Aceita colagem com espaços do PDF e limpa na hora */}
          <div className="md:col-span-7 space-y-1">
            <label className="text-[9px] font-black uppercase text-zinc-400">Chave de Acesso (44 dígitos puros)</label>
            <input 
              type="text" 
              maxLength={55} // 👈 EXPANDIDO: Permite que o bloco com os espaços do PDF caiba na colagem
              placeholder="Cole a chave completa da SEFAZ aqui" 
              value={novo.chaveAcesso} 
              onChange={e => {
                // 1. Remove instantaneamente tudo o que não for número (espaços, traços, etc)
                const valorLimpo = e.target.value.replace(/\D/g, '');
                
                // 2. Garante que o estado salve estritamente os 44 números regulamentares
                setNovo({...novo, chaveAcesso: valorLimpo.substring(0, 44)});
              }} 
              className="w-full p-2.5 bg-white border rounded-xl text-xs font-mono tracking-wider font-bold text-zinc-800 focus:outline-none" 
            />
          </div>

          <div className="md:col-span-3 space-y-1">
            <label className="text-[9px] font-black uppercase text-zinc-400">Status Fiscal</label>
            <select value={novo.status} onChange={e => setNovo({...novo, status: e.target.value as any})} className="w-full p-2.5 bg-white border rounded-xl text-xs font-bold text-zinc-700">
              <option value="emitida">🟢 Autorizada / Emitida</option>
              <option value="aguardando">🟡 Aguardando Envio</option>
              <option value="cancelada">🔴 Cancelada</option>
            </select>
          </div>

          <div className="md:col-span-2 space-y-1">
            <label className="text-[9px] font-black uppercase text-zinc-400">Data Emissão</label>
            <input type="date" value={novo.dataEmissao} onChange={e => setNovo({...novo, dataEmissao: e.target.value})} className="w-full p-2.5 bg-white border rounded-xl text-xs font-bold focus:outline-none text-zinc-700" />
          </div>
        </div>

        <div className="flex justify-end pt-1">
          <button type="button" onClick={handleAddNF} className="w-full sm:w-auto bg-zinc-900 text-white px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider hover:bg-emerald-800 transition-colors flex items-center justify-center gap-2 shadow-sm">
            <Plus className="w-4 h-4" /> Registrar Nota Fiscal
          </button>
        </div>
      </div>

      {/* LISTAGEM E FILTRO */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b pb-2">
          <h4 className="text-xs font-black uppercase text-zinc-400 tracking-wider">Histórico de Livro Fiscal</h4>
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 w-3.5 h-3.5" />
            <input type="text" placeholder="Buscar por número ou cliente..." value={busca} onChange={e => setBusca(e.target.value)} className="w-full p-2 pl-9 bg-zinc-50 border rounded-xl text-xs focus:outline-none focus:bg-white" />
          </div>
        </div>

        <div className="border border-zinc-200 rounded-2xl overflow-hidden bg-white divide-y divide-zinc-100 shadow-sm">
          {notasFiltradas.map((n) => (
            <div key={n.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 gap-3 hover:bg-zinc-50/50 transition-colors">
              <div className="space-y-1 max-w-[80%]">
                <div className="flex flex-wrap items-center gap-2">
                  <span className={`text-[10px] font-mono font-black border px-2 py-0.5 rounded ${
                    n.tipo === 'saida' ? 'bg-emerald-50 border-emerald-100 text-emerald-800' : 'bg-blue-50 border-blue-100 text-blue-800'
                  }`}>
                    NF-e Nº {n.numero} <span className="text-zinc-400 font-normal">Série {n.serie}</span>
                  </span>

                  {n.status === 'emitida' && <span className="text-[9px] font-black uppercase bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded flex items-center gap-1"><CheckCircle className="w-2.5 h-2.5" /> Emitida</span>}
                  {n.status === 'aguardando' && <span className="text-[9px] font-black uppercase bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded flex items-center gap-1"><Clock className="w-2.5 h-2.5" /> Pendente</span>}
                  {n.status === 'cancelada' && <span className="text-[9px] font-black uppercase bg-rose-100 text-rose-800 px-1.5 py-0.5 rounded flex items-center gap-1"><XCircle className="w-2.5 h-2.5" /> Cancelada</span>}
                </div>
                <h5 className="text-xs font-black text-zinc-800">{n.cliente}</h5>
                <p className="text-[10px] font-mono text-zinc-400 truncate tracking-tight font-bold" title={n.chaveAcesso}>
                  Chave: {n.chaveAcesso}
                </p>
              </div>

              <div className="flex items-center justify-between sm:justify-end gap-4 border-t sm:border-transparent pt-2 sm:pt-0">
                <div className="text-right">
                  <p className="text-xs font-black font-mono text-zinc-800">
                    R$ {n.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </p>
                  <p className="text-[9px] text-zinc-400 font-bold">{n.dataEmissao.split('-').reverse().join('/')}</p>
                </div>
                
                <div className="flex items-center gap-1">
                  <a href={`https://www.nfe.fazenda.gov.br/portal/consultaRecaptcha.aspx?tipoConsulta=completa&idConteudo=XbSeqbGeDnY=`} target="_blank" rel="noopener noreferrer" className="p-1.5 text-zinc-400 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg border border-transparent transition-all">
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                  <button type="button" onClick={() => handleDeletar(n.id)} className="p-1.5 text-zinc-300 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-all">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}

          {notasFiltradas.length === 0 && (
            <div className="text-center py-12 text-zinc-400 text-xs font-medium">
              Nenhuma nota fiscal localizada com os critérios de busca.
            </div>
          )}
        </div>
      </div>

    </div>
  );
}