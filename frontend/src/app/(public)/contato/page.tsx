'use client';

import { useState, useEffect } from 'react';
import { Send, CheckCircle2, ShieldCheck, TreePine, Sparkles } from 'lucide-react';

export default function ContatoPage() {
  const [nome, setNome] = useState('');
  const [empresa, setEmpresa] = useState('');
  const [telefone, setTelephone] = useState('');
  const [email, setEmail] = useState(''); // 🟢 NOVO: Estado para capturar o e-mail
  const [categoria, setCategoria] = useState('tratado'); 
  const [mensagem, setMensagem] = useState('');
  
  const [enviando, setEnviando] = useState(false);
  const [sucesso, setSucesso] = useState(false);
  const [rastreio, setRastreio] = useState({ origem: 'Tráfego Orgânico (Busca Google)', utmSource: '' });

  // Valida se o número tem um formato de celular brasileiro real válido (com DDD + 9 dígitos)
  const validarWhatsAppReal = (numero: string): boolean => {
    const apenasNumeros = numero.replace(/\D/g, '');
    if (apenasNumeros.length !== 11) return false;
    if (apenasNumeros[2] !== '9') return false;

    const apenasO_Telefone = apenasNumeros.substring(2);
    const sequenciasFalsasDeTelefone = [
      '000000000', '111111111', '222222222', '333333333', 
      '444444444', '555555555', '666666666', '777777777', 
      '888888888', '999999999'
    ];
    
    if (sequenciasFalsasDeTelefone.includes(apenasO_Telefone)) return false;
    return true;
  };

  // Aplica a máscara (77) 99999-0000 automaticamente enquanto o usuário digita
  const aplicarMascaraTelefone = (valor: string) => {
    return valor
      .replace(/\D/g, '') 
      .replace(/^(\d{2})(\d)/g, '($1) $2') 
      .replace(/(\d{5})(\d)/, '$1-$2') 
      .substring(0, 15); 
  };

  // 📡 Captura de Geolocalização por IP e parâmetros de Marketing
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const source = urlParams.get('utm_source');
      const campaign = urlParams.get('utm_campaign');

      let origemDetectada = 'Tráfego Orgânico (Busca Google)';
      let utmSourceDetectada = '';

      if (source === 'google' || urlParams.has('gclid')) {
        origemDetectada = 'Google Ads (Patrocinado)';
        utmSourceDetectada = campaign || 'campanha_pesquisa';
      } else if (document.referrer.includes('google.com')) {
        origemDetectada = 'Busca Orgânica (Google SEO)';
      }

      fetch('https://ipapi.co/json/')
        .then(res => res.json())
        .then(data => {
          const localizacao = data.city && data.region 
            ? `${data.city} - ${data.region}` 
            : 'Localização Não Detectada';

          setRastreio({
            origem: `${origemDetectada} [📍 ${localizacao}]`,
            utmSource: utmSourceDetectada
          });
        })
        .catch(() => {
          setRastreio({
            origem: origemDetectada,
            utmSource: utmSourceDetectada
          });
        });
    }
  }, []);

  const handleEnviarLead = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!nome.trim()) return alert('Por favor, preencha seu nome.');
    
    if (!validarWhatsAppReal(telefone)) {
      return alert('⚠️ Por favor, insira um número de WhatsApp válido com DDD e o dígito 9 (Ex: (77) 99999-0000).');
    }

    setEnviando(true);

    const novoLead = {
      nome,
      empresa: empresa || 'Pessoa Física',
      telefone,
      email: email.trim() || null, // 🟢 NOVO: Integrado no payload enviado para o Back-end
      categoria,
      origem: rastreio.origem,
      utm_source: rastreio.utmSource,
      status: 'novo',
      mensagem,
      dataCriacao: new Date().toISOString().split('T')[0],
      historico: [{ 
        data: new Date().toLocaleString('pt-BR').slice(0, 16), 
        texto: `📥 Lead capturado via formulário otimizado. Origem: ${rastreio.origem}.` 
      }]
    };

    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(novoLead)
      });

      if (res.ok) {
        if (typeof window !== 'undefined') {
          const leadsAtuaisRaw = localStorage.getItem('ark_eucalipto_leads');
          let listaLeads = leadsAtuaisRaw ? JSON.parse(leadsAtuaisRaw) : [];
          
          const leadComId = {
            id: `l_local_${Date.now()}`,
            ...novoLead
          };

          listaLeads = [leadComId, ...listaLeads];
          localStorage.setItem('ark_eucalipto_leads', JSON.stringify(listaLeads));
        }

        setSucesso(true);
        setNome(''); setEmpresa(''); setTelephone(''); setEmail(''); setMensagem('');
      } else {
        throw new Error();
      }
    } catch (error) {
      console.error("Erro ao enviar lead:", error);
      alert('⚠️ Erro ao salvar sua cotação no pátio central. Por favor, tente novamente.');
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(#e4e4e7_1px,transparent_1px)] [background-size:16px_16px] bg-zinc-50/60 flex flex-col justify-center items-center p-4 md:p-8">
      
      <div className="w-full max-w-4xl grid grid-cols-1 lg:grid-cols-12 bg-white rounded-3xl border border-zinc-200/80 shadow-2xl shadow-zinc-200/60 overflow-hidden animate-fadeIn">
        
        {/* Painel Lateral */}
        <div className="lg:col-span-4 bg-zinc-900 p-8 flex flex-col justify-between text-white relative overflow-hidden">
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:12px_12px]" />
          
          <div className="space-y-6 relative z-10">
            <div className="inline-flex p-3 bg-emerald-800/40 border border-emerald-700/50 rounded-2xl text-emerald-400">
              <TreePine className="w-6 h-6" />
            </div>
            <div className="space-y-2">
              <h3 className="font-serif font-black text-xl tracking-tight uppercase">Pátio Ark</h3>
              <p className="text-zinc-400 text-xs leading-relaxed">
                Madeiras brutas e soluções estruturais com faturamento direto do produtor regional.
              </p>
            </div>
          </div>

          <div className="space-y-4 pt-12 border-t border-zinc-800 relative z-10">
            <div className="flex items-center gap-3 text-xs text-zinc-300">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Garantia de Origem e Rigidez</span>
            </div>
            <div className="flex items-center gap-3 text-xs text-zinc-300">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <span>Padrão Estético Sob Medida</span>
            </div>
          </div>
        </div>

        {/* Formulário */}
        <div className="lg:col-span-8 p-6 md:p-10 bg-white">
          {sucesso ? (
            <div className="h-full flex flex-col justify-center items-center text-center space-y-4 py-12 animate-fadeIn">
              <div className="w-16 h-16 bg-emerald-50 border border-emerald-100 rounded-2xl flex items-center justify-center text-emerald-600 shadow-sm">
                <CheckCircle2 className="w-10 h-10 animate-pulse" />
              </div>
              <h3 className="font-serif font-black text-zinc-900 text-xl uppercase tracking-wide">Orçamento Solicitado!</h3>
              <p className="text-zinc-500 text-xs max-w-sm leading-relaxed">
                Nossa central operacional já recebeu sua proposta. Entraremos em contato via WhatsApp com os valores de frete e cubagem.
              </p>
              <button type="button" onClick={() => setSucesso(false)} className="text-emerald-700 font-black text-xs uppercase tracking-wider hover:text-emerald-800 transition-colors underline pt-2">
                Realizar Nova Cotação
              </button>
            </div>
          ) : (
            <form onSubmit={handleEnviarLead} className="space-y-6">
              
              <div className="space-y-1 border-b border-zinc-100 pb-4">
                <h2 className="text-xl font-serif font-black text-zinc-900 uppercase tracking-tight">
                  Solicitar Orçamento Direto
                </h2>
                <p className="text-zinc-400 text-xs">
                  Preencha os dados de pátio abaixo para calcular cubagem e logística ($m^3$).
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase text-zinc-400 tracking-wide">Seu Nome *</label>
                  <input 
                    type="text" required placeholder="Ex: Fabiano Souza" value={nome} onChange={e => setNome(e.target.value)} 
                    className="w-full p-3 bg-zinc-50/60 border border-zinc-200 rounded-xl text-xs font-medium focus:outline-none focus:border-zinc-400 focus:bg-white transition-all shadow-sm" 
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase text-zinc-400 tracking-wide">Empresa / Fazenda</label>
                  <input 
                    type="text" placeholder="Opcional" value={empresa} onChange={e => setEmpresa(e.target.value)} 
                    className="w-full p-3 bg-zinc-50/60 border border-zinc-200 rounded-xl text-xs font-medium focus:outline-none focus:border-zinc-400 focus:bg-white transition-all shadow-sm" 
                  />
                </div>
              </div>

              {/* 🟢 SEÇÃO ATUALIZADA: Bloco de WhatsApp e E-mail lado a lado */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase text-zinc-400 tracking-wide">WhatsApp / Telefone *</label>
                  <input 
                    type="tel" 
                    required 
                    placeholder="(77) 99999-0000" 
                    value={telefone} 
                    onChange={e => setTelephone(aplicarMascaraTelefone(e.target.value))} 
                    className="w-full p-3 bg-zinc-50/60 border border-zinc-200 rounded-xl text-xs font-mono font-bold focus:outline-none focus:border-zinc-400 focus:bg-white transition-all shadow-sm" 
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase text-zinc-400 tracking-wide">E-mail (Opcional)</label>
                  <input 
                    type="email" 
                    placeholder="exemplo@email.com" 
                    value={email} 
                    onChange={e => setEmail(e.target.value)} 
                    className="w-full p-3 bg-zinc-50/60 border border-zinc-200 rounded-xl text-xs font-medium focus:outline-none focus:border-zinc-400 focus:bg-white transition-all shadow-sm" 
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase text-zinc-400 tracking-wide">Material de Interesse</label>
                <select 
                  value={categoria} onChange={e => setCategoria(e.target.value)} 
                  className="w-full p-3 bg-zinc-50/60 border border-zinc-200 rounded-xl text-xs font-bold text-zinc-700 focus:outline-none focus:border-zinc-400 focus:bg-white transition-all shadow-sm cursor-pointer"
                >
                  <option value="tratado">🛡️ Eucalipto Tratado (Autoclave / Mourões Premium)</option>
                  <option value="rural">🌲 Linha Rural (Mourões / Estacas In Natura)</option>
                  <option value="innatura">🪵 In Natura (Escoras de Laje / Vigas)</option>
                  <option value="lenha">🔥 Biomassa / Lenha Industrial</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase text-zinc-400 tracking-wide">Observações do Pedido (Opcional)</label>
                <textarea 
                  rows={4} placeholder="Descreva as quantidades aproximadas ou detalhes do projeto estrutural..." value={mensagem} onChange={e => setMensagem(e.target.value)} 
                  className="w-full p-3 bg-zinc-50/60 border border-zinc-200 rounded-xl text-xs font-medium resize-none focus:outline-none focus:border-zinc-400 focus:bg-white transition-all shadow-sm" 
                />
              </div>

              <button
                type="submit" disabled={enviando}
                className="w-full bg-emerald-800 text-white p-3.5 rounded-xl font-black text-xs uppercase tracking-wider hover:bg-emerald-900 transition-all shadow-lg shadow-emerald-800/10 active:scale-[0.99] flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <Send className="w-3.5 h-3.5" />
                {enviando ? 'Transmitindo Cotação...' : 'Enviar para o Pátio'}
              </button>
            </form>
          )}
        </div>

      </div>

    </div>
  );
}