'use client';

import { useState, useEffect, useRef } from 'react';
import { Layout, Check, Upload, Loader2, Eye, Save, Plus, Trash2, Edit2, X, FileText } from 'lucide-react';

interface FAQItem {
  id: string;
  pergunta: string;
  resposta: string;
}

interface ParallaxConfig {
  titulo: string;
  subtitulo: string;
  imagemUrl: string;
}

interface ComponenteProps {
  dados: {
    parallax: {
      logistica: ParallaxConfig;
      catalogo: ParallaxConfig;
      faq: ParallaxConfig;
    };
  };
  setDados: React.Dispatch<React.SetStateAction<any>>;
}

export default function GerenciarFAQ({ dados, setDados }: ComponenteProps) {
  const [faqs, setFaqs] = useState<FAQItem[]>([]);
  const [carregandoImagem, setCarregandoImagem] = useState(false);
  const [salvandoLocal, setSalvandoLocal] = useState(false);
  const [idEmEdicao, setIdEmEdicao] = useState<string | null>(null);
  
  const arquivoInputRef = useRef<HTMLInputElement>(null);

  const [novo, setNovo] = useState({ pergunta: '', resposta: '' });

  // Puxa as configurações atuais do banner do topo
  const configAtual = dados?.parallax?.faq || { 
    titulo: 'DÚVIDAS FREQUENTES', 
    subtitulo: 'Esclareça suas principais dúvidas técnicas e comerciais sobre o nosso eucalipto', 
    imagemUrl: '' 
  };

  // 🔄 1. CARREGAMENTO INICIAL E PERSISTÊNCIA DAS PERGUNTAS DO FAQ
  useEffect(() => {
    const dadosLocais = localStorage.getItem('ark_eucalipto_faq');
    if (dadosLocais !== null) {
      setFaqs(JSON.parse(dadosLocais));
    } else {
      const dadosIniciais: FAQItem[] = [
        { id: 'f1', pergunta: "Qual a durabilidade média do eucalipto tratado em autoclave?", resposta: "O eucalipto tratado em autoclave com composto CCA possui uma vida útil estimada superior a 20 anos, mesmo quando em contato direto com o solo, umidade e intempéries." },
        { id: 'f2', pergunta: "Vocês trabalham com entrega direta no pátio ou na obra?", resposta: "Sim! Gerenciamos toda a logística de carregamento e transporte estruturado. Realizamos entregas programadas de lotes fechados diretamente na sua propriedade." }
      ];
      setFaqs(dadosIniciais);
      localStorage.setItem('ark_eucalipto_faq', JSON.stringify(dadosIniciais));
    }
  }, []);

  // 🔄 Atualiza o estado do banner na memória do CMS
  const handleMudarCampo = (campo: keyof ParallaxConfig, valor: string) => {
    setDados((prev: any) => ({
      ...prev,
      parallax: {
        ...prev?.parallax,
        faq: {
          ...prev?.parallax?.faq,
          [campo]: valor
        }
      }
    }));
  };

  // 🗜️ COMPRESSOR AUTOMÁTICO DE IMAGEM PARA O BANNER
  const comprimirERedimensionar = (base64Str: string) => {
    const img = new window.Image();
    img.src = base64Str;
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const MAX_WIDTH = 1200;
      let width = img.width;
      let height = img.height;

      if (width > MAX_WIDTH) {
        height = Math.round((height * MAX_WIDTH) / width);
        width = MAX_WIDTH;
      }
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(img, 0, 0, width, height);
        handleMudarCampo('imagemUrl', canvas.toDataURL('image/jpeg', 0.7));
        setCarregandoImagem(false);
      }
    };
  };

  const handleTratarArquivo = (e: React.ChangeEvent<HTMLInputElement>) => {
    const arquivo = e.target.files?.[0];
    if (!arquivo) return;
    setCarregandoImagem(true);
    const leitor = new FileReader();
    leitor.onloadend = () => comprimirERedimensionar(leitor.result as string);
    leitor.readAsDataURL(arquivo);
  };

  // 💾 SALVA O BANNER DE FORMA IMEDIATA
  const handleSalvarBannerDireto = () => {
    setSalvandoLocal(true);
    try {
      const configExistente = localStorage.getItem('ark_eucalipto_config') || '{}';
      const objCompleto = JSON.parse(configExistente);
      const dadosAtualizados = {
        ...objCompleto,
        parallax: { ...objCompleto?.parallax, faq: configAtual }
      };
      localStorage.setItem('ark_eucalipto_config', JSON.stringify(dadosAtualizados));
      alert('Configurações do Parallax do FAQ salvas com sucesso!');
    } catch (error) {
      alert('Erro ao salvar as configurações.');
    } finally {
      setSalvandoLocal(false);
    }
  };

  // ➕ 2. ADICIONAR OU EDITAR PERGUNTA NO FAQ
  const handleSalvarFAQ = () => {
    if (!novo.pergunta.trim() || !novo.resposta.trim()) {
      return alert('Por favor, preencha a pergunta e a resposta técnica.');
    }

    let listaAtualizada: FAQItem[] = [];

    if (idEmEdicao) {
      listaAtualizada = faqs.map(f => f.id === idEmEdicao ? { ...f, pergunta: novo.pergunta, resposta: novo.resposta } : f);
      setIdEmEdicao(null);
    } else {
      const novoItem: FAQItem = {
        id: `faq_${Date.now()}`,
        pergunta: novo.pergunta,
        resposta: novo.resposta
      };
      listaAtualizada = [...faqs, novoItem];
    }

    setFaqs(listaAtualizada);
    localStorage.setItem('ark_eucalipto_faq', JSON.stringify(listaAtualizada));
    setNovo({ pergunta: '', resposta: '' });
  };

  return (
    <div className="space-y-8 animate-fadeIn text-zinc-800">
      
      {/* 🛠️ BLOCO 1: CONFIGURAR BANNER PARALLAX TOPO */}
      <div className="bg-zinc-50 border border-zinc-200 rounded-2xl p-5 space-y-4">
        <h4 className="text-xs font-black uppercase text-zinc-700 tracking-wide flex items-center gap-1.5">
          <Layout className="w-4 h-4 text-emerald-700" /> Configurar Topo Parallax (FAQ)
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          <div className="md:col-span-4 space-y-1">
            <label className="text-[9px] font-black uppercase text-zinc-400">Título Principal do Banner</label>
            <input type="text" placeholder="Ex: DÚVIDAS FREQUENTES" value={configAtual.titulo} onChange={e => handleMudarCampo('titulo', e.target.value)} className="w-full p-2.5 bg-white border rounded-xl text-xs font-bold" />
          </div>
          <div className="md:col-span-8 space-y-1">
            <label className="text-[9px] font-black uppercase text-zinc-400">Subtítulo descritivo</label>
            <input type="text" placeholder="Ex: Esclareça suas dúvidas sobre a madeira tratada" value={configAtual.subtitulo} onChange={e => handleMudarCampo('subtitulo', e.target.value)} className="w-full p-2.5 bg-white border rounded-xl text-xs font-medium" />
          </div>
          <div className="md:col-span-12 space-y-1">
            <label className="text-[9px] font-black uppercase text-zinc-400">Imagem de Fundo do Parallax</label>
            <div className="flex flex-col sm:flex-row gap-2">
              <input type="file" ref={arquivoInputRef} accept="image/*" onChange={handleTratarArquivo} className="hidden" />
              <button type="button" disabled={carregandoImagem} onClick={() => arquivoInputRef.current?.click()} className="flex bg-white hover:bg-zinc-100 border border-zinc-200 text-zinc-700 text-xs font-bold px-4 py-2.5 rounded-xl items-center justify-center gap-2 transition-all shrink-0">
                {carregandoImagem ? <Loader2 className="w-4 h-4 animate-spin text-emerald-700" /> : <Upload className="w-4 h-4 text-zinc-500" />}
                <span>{configAtual.imagemUrl ? 'Fundo Carregado!' : 'Escolher Imagem do PC'}</span>
              </button>
              <input type="text" readOnly placeholder="Nenhum arquivo" value={configAtual.imagemUrl ? "Imagem otimizada com sucesso" : ""} className="w-full p-2.5 bg-zinc-100/50 border border-zinc-200 rounded-xl text-xs font-medium text-zinc-400 pointer-events-none truncate" />
            </div>
          </div>
        </div>
        <div className="flex justify-end pt-2 border-t border-zinc-200/60">
          <button type="button" disabled={salvandoLocal || carregandoImagem} onClick={handleSalvarBannerDireto} className="w-full sm:w-auto bg-zinc-900 text-white hover:bg-emerald-700 px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-colors flex items-center justify-center gap-2 shadow-sm">
            <Save className="w-4 h-4" /> {salvandoLocal ? 'Gravando...' : 'Salvar Configurações do Topo'}
          </button>
        </div>
      </div>

      {/* 🛠️ BLOCO 2: FORMULÁRIO DE CRIAÇÃO / EDIÇÃO DE ITENS DO FAQ */}
      <div className={`border rounded-2xl p-5 space-y-4 transition-all duration-300 ${idEmEdicao ? 'bg-amber-50/40 border-amber-300' : 'bg-zinc-50 border-zinc-200'}`}>
        <div className="flex justify-between items-center">
          <h4 className="text-xs font-black uppercase text-zinc-700 tracking-wide flex items-center gap-1.5">
            {idEmEdicao ? <Edit2 className="w-4 h-4 text-amber-600" /> : <Plus className="w-4 h-4 text-emerald-700" />}
            <span>{idEmEdicao ? 'Editando Pergunta Selecionada' : 'Criar Nova Pergunta no FAQ'}</span>
          </h4>
          {idEmEdicao && (
            <button onClick={() => { setIdEmEdicao(null); setNovo({ pergunta: '', resposta: '' }); }} className="text-[10px] bg-white border border-amber-200 text-amber-800 font-bold uppercase px-2.5 py-1 rounded-lg flex items-center gap-1"><X className="w-3 h-3" /> Cancelar</button>
          )}
        </div>
        
        <div className="space-y-3">
          <div className="space-y-1">
            <label className="text-[9px] font-black uppercase text-zinc-400">Pergunta / Dúvida do Cliente</label>
            <input type="text" placeholder="Ex: Qual a diferença entre a madeira In Natura e a Tratada?" value={novo.pergunta} onChange={e => setNovo({...novo, pergunta: e.target.value})} className="w-full p-2.5 bg-white border rounded-xl text-xs font-bold" />
          </div>
          <div className="space-y-1">
            <label className="text-[9px] font-black uppercase text-zinc-400">Resposta Comercial / Técnica</label>
            <div className="relative">
              <FileText className="absolute left-3 top-3 text-zinc-400 w-3.5 h-3.5" />
              <textarea rows={3} placeholder="Escreva a resposta detalhada de forma limpa e profissional..." value={novo.resposta} onChange={e => setNovo({...novo, resposta: e.target.value})} className="w-full p-2.5 pl-9 bg-white border rounded-xl text-xs resize-none focus:outline-none" />
            </div>
          </div>
        </div>
        <div className="flex justify-end pt-1">
          <button type="button" onClick={handleSalvarFAQ} className={`w-full sm:w-auto px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider text-white ${idEmEdicao ? 'bg-amber-600' : 'bg-zinc-900 hover:bg-emerald-800'}`}>
            <Check className="w-4 h-4 inline mr-1" /> {idEmEdicao ? 'Salvar Alteração' : 'Adicionar Pergunta'}
          </button>
        </div>
      </div>

      {/* 🎨 BLOCO 3: LISTA DE FAQS ATIVOS COM GERENCIAMENTO */}
      <div className="space-y-3">
        <h4 className="text-xs font-black uppercase text-zinc-400 tracking-wider border-b pb-2">Perguntas Publicadas ({faqs.length} Itens)</h4>
        <div className="space-y-2">
          {faqs.map((faq) => (
            <div key={faq.id} className="bg-white border border-zinc-200 rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-zinc-300 shadow-sm transition-all">
              <div className="space-y-1.5 max-w-2xl">
                <h5 className="text-xs font-black font-serif text-zinc-900 tracking-tight flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 bg-emerald-700 rounded-full shrink-0" /> {faq.pergunta}
                </h5>
                <p className="text-[11px] text-zinc-500 font-normal leading-relaxed pl-3">{faq.resposta}</p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button type="button" onClick={() => { setIdEmEdicao(faq.id); setNovo({ pergunta: faq.pergunta, resposta: faq.resposta }); }} className="bg-zinc-50 text-zinc-700 border hover:bg-zinc-900 hover:text-white px-3 py-2 rounded-xl text-[10px] font-black uppercase tracking-wider flex items-center gap-1 transition-all"><Edit2 className="w-3 h-3" /> Editar</button>
                <button type="button" onClick={() => { if (confirm('Remover pergunta?')) { const f = faqs.filter(i => i.id !== faq.id); setFaqs(f); localStorage.setItem('ark_eucalipto_faq', JSON.stringify(f)); } }} className="p-2 text-zinc-300 hover:text-rose-500 hover:bg-rose-50 rounded-xl border border-transparent hover:border-rose-100 transition-all"><Trash2 className="w-4 h-4" /></button>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}