'use client';

import { useState, useEffect, useRef } from 'react';
import { Plus, Trash2, Tag, Image, FileText, Check, Upload, Loader2, Edit2, X, Save, Layout } from 'lucide-react';

interface ProdutoVitrine {
  id: string;
  titulo: string;
  categoria: 'INNATURA' | 'TRATADO' | 'RURAL' | 'LENHA';
  descricao: string;
  imagemUrl: string;
}

interface ParallaxConfig {
  titulo: string;
  subtitulo: string;
  imagemUrl: string;
}

// 🟢 CORRIGIDO: Tipagem flexível na interface para aceitar todas as ramificações de Parallax do CMS
interface ComponenteProps {
  dados: {
    parallax?: {
      logistica?: ParallaxConfig;
      catalogo?: ParallaxConfig;
      faq?: ParallaxConfig;
      [key: string]: any;
    };
  };
  setDados: React.Dispatch<React.SetStateAction<any>>;
}

export default function ProdutosComponent({ dados, setDados }: ComponenteProps) {
  const [produtos, setProdutos] = useState<ProdutoVitrine[]>([]);
  const [carregandoImagem, setCarregandoImagem] = useState(false);
  const [carregandoBanner, setCarregandoBanner] = useState(false);
  const [salvandoLocal, setSalvandoLocal] = useState(false);
  const [idEmEdicao, setIdEmEdicao] = useState<string | null>(null);

  const arquivoInputRef = useRef<HTMLInputElement>(null);
  const bannerInputRef = useRef<HTMLInputElement>(null);

  // Puxa as configurações atuais do banner do catálogo vindo do CMS global da rota mãe
  const configBanner = dados?.parallax?.catalogo || { titulo: 'NOSSO CATÁLOGO', subtitulo: 'Madeira selecionada direto do pátio para a sua estrutura', imagemUrl: '' };

  // 🔄 1. CARREGAMENTO INICIAL E PERSISTÊNCIA NO NAVEGADOR
  useEffect(() => {
    const dadosLocais = localStorage.getItem('ark_eucalipto_produtos');
    if (dadosLocais !== null) {
      setProdutos(JSON.parse(dadosLocais));
    } else {
      const dadosIniciais: ProdutoVitrine[] = [
        { id: 'p1', titulo: 'Escora de Eucalipto In Natura 3m', categoria: 'INNATURA', descricao: 'Material selecionado de alta resistência, ideal para escoramento de lajes e estruturas de concreto na construção civil.', imagemUrl: '' },
        { id: 'p2', titulo: 'Mourão de Eucalipto Autoclavado 2,20m', categoria: 'TRATADO', descricao: 'Madeira tratada em autoclave com CCA, garantindo imunidade contra cupins, brocas e apodrecimento por umidade.', imagemUrl: '' },
        { id: 'p3', titulo: 'Poste de Eucalipto Duplo B Rural', categoria: 'RURAL', descricao: 'Postes robustos para eletrificação rural, estruturação de galpões e cercamentos de grande porte.', imagemUrl: '' },
      ];
      setProdutos(dadosIniciais);
      localStorage.setItem('ark_eucalipto_produtos', JSON.stringify(dadosIniciais));
    }
  }, []);

  const [novo, setNovo] = useState({ titulo: '', categoria: 'INNATURA' as 'INNATURA' | 'TRATADO' | 'RURAL' | 'LENHA', descricao: '', imagemUrl: '' });

  // 🗜️ COMPRESSOR AUTOMÁTICO DE IMAGENS (Evita estouro de limite "entity too large" no Node)
  const comprimirImagem = (base64Str: string, callback: (resultado: string) => void) => {
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
        callback(canvas.toDataURL('image/jpeg', 0.7));
      }
    };
  };

  const handleTratarArquivo = (e: React.ChangeEvent<HTMLInputElement>) => {
    const arquivo = e.target.files?.[0];
    if (!arquivo) return;

    setCarregandoImagem(true);
    const leitor = new FileReader();
    leitor.onloadend = () => {
      comprimirImagem(leitor.result as string, (resultadoCompactado) => {
        setNovo(prev => ({ ...prev, imagemUrl: resultadoCompactado }));
        setCarregandoImagem(false);
      });
    };
    leitor.readAsDataURL(arquivo);
  };

  const handleMudarBanner = (campo: keyof ParallaxConfig, valor: string) => {
    setDados((prev: any) => ({
      ...prev,
      parallax: {
        ...prev?.parallax,
        catalogo: {
          ...prev?.parallax?.catalogo,
          [campo]: valor
        }
      }
    }));
  };

  const handleTratarBanner = (e: React.ChangeEvent<HTMLInputElement>) => {
    const arquivo = e.target.files?.[0];
    if (!arquivo) return;

    setCarregandoBanner(true);
    const leitor = new FileReader();
    leitor.onloadend = () => {
      comprimirImagem(leitor.result as string, (resultadoCompactado) => {
        handleMudarBanner('imagemUrl', resultadoCompactado);
        setCarregandoBanner(false);
      });
    };
    leitor.readAsDataURL(arquivo);
  };

  const handleSalvarBannerDireto = () => {
    setSalvandoLocal(true);
    {/* 🔍 Procure por este bloco perto da linha 145 e ajuste a linha 149: */}
try {
  const configExistente = localStorage.getItem('ark_eucalipto_config') || '{}';
  const objCompleto = JSON.parse(configExistente);

  const dadosAtualizados = {
    ...objCompleto,
    parallax: {
      ...objCompleto?.parallax,
      catalogo: configBanner
    }
  };

  localStorage.setItem('ark_eucalipto_config', JSON.stringify(dadosAtualizados));
  alert('Configurações do Parallax do Catálogo salvas com sucesso! A página pública já reflete a nova foto do topo.');
} catch (error) {
  alert('Erro ao salvar no banco local do navegador.');
} finally { // 🟢 CORRIGIDO AQUI (Substitua "bits" por "finally")
  setSalvandoLocal(false);
}
  };

  const handleSalvarProduto = () => {
    if (!novo.titulo.trim() || !novo.descricao.trim()) {
      return alert('Por favor, preencha ao menos o título e a descrição técnica do produto.');
    }

    let listaAtualizada: ProdutoVitrine[] = [];

    if (idEmEdicao) {
      listaAtualizada = produtos.map(p => 
        p.id === idEmEdicao 
          ? { ...p, titulo: novo.titulo, categoria: novo.categoria, descricao: novo.descricao, imagemUrl: novo.imagemUrl }
          : p
      );
      setIdEmEdicao(null);
    } else {
      const novoItem: ProdutoVitrine = {
        id: `prod_${Date.now()}`,
        titulo: novo.titulo,
        categoria: novo.categoria,
        descricao: novo.descricao,
        imagemUrl: novo.imagemUrl.trim()
      };
      listaAtualizada = [novoItem, ...produtos];
    }

    setProdutos(listaAtualizada);
    localStorage.setItem('ark_eucalipto_produtos', JSON.stringify(listaAtualizada));
    setNovo({ titulo: '', categoria: 'INNATURA', descricao: '', imagemUrl: '' });
  };

  const handlePrepararEdicao = (prod: ProdutoVitrine) => {
    setIdEmEdicao(prod.id);
    setNovo({
      titulo: prod.titulo,
      categoria: prod.categoria,
      descricao: prod.descricao,
      imagemUrl: prod.imagemUrl
    });
    window.scrollTo({ top: 380, behavior: 'smooth' });
  };

  const handleCancelarEdicao = () => {
    setIdEmEdicao(null);
    setNovo({ titulo: '', categoria: 'INNATURA', descricao: '', imagemUrl: '' });
  };

  const handleDeletar = (id: string) => {
    if (confirm('Deseja remover este produto do catálogo da vitrine?')) {
      const listaFiltrada = produtos.filter(p => p.id !== id);
      setProdutos(listaFiltrada);
      localStorage.setItem('ark_eucalipto_produtos', JSON.stringify(listaFiltrada));
      if (idEmEdicao === id) handleCancelarEdicao();
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn text-zinc-800">
      
      {/* CONFIGURAR TOPO PARALLAX */}
      <div className="bg-zinc-50 border border-zinc-200 rounded-2xl p-5 space-y-4">
        <h4 className="text-xs font-black uppercase text-zinc-700 tracking-wide flex items-center gap-1.5">
          <Layout className="w-4 h-4 text-emerald-700" /> Configurar Topo Parallax (Página de Produtos Públicos)
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          <div className="md:col-span-4 space-y-1">
            <label className="text-[9px] font-black uppercase text-zinc-400">Título Principal do Banner</label>
            <input 
              type="text" 
              placeholder="Ex: NOSSO CATÁLOGO" 
              value={configBanner.titulo} 
              onChange={e => handleMudarBanner('titulo', e.target.value)} 
              className="w-full p-2.5 bg-white border rounded-xl text-xs font-bold" 
            />
          </div>
          <div className="md:col-span-8 space-y-1">
            <label className="text-[9px] font-black uppercase text-zinc-400">Subtítulo descritivo / Slogan</label>
            <input 
              type="text" 
              placeholder="Ex: Eucalipto de alta performance e durabilidade estrutural" 
              value={configBanner.subtitulo} 
              onChange={e => handleMudarBanner('subtitulo', e.target.value)} 
              className="w-full p-2.5 bg-white border rounded-xl text-xs font-medium" 
            />
          </div>
          <div className="md:col-span-12 space-y-1">
            <label className="text-[9px] font-black uppercase text-zinc-400">Imagem de Fundo do Parallax</label>
            <div className="flex flex-col sm:flex-row gap-2">
              <input type="file" ref={bannerInputRef} accept="image/*" onChange={handleTratarBanner} className="hidden" />
              <button 
                type="button" 
                disabled={carregandoBanner} 
                onClick={() => bannerInputRef.current?.click()} 
                className="flex bg-white hover:bg-zinc-100 border border-zinc-200 text-zinc-700 text-xs font-bold px-4 py-2.5 rounded-xl items-center justify-center gap-2 transition-all disabled:opacity-50 shrink-0"
              >
                {carregandoBanner ? <Loader2 className="w-4 h-4 animate-spin text-emerald-700" /> : <Upload className="w-4 h-4 text-zinc-500" />}
                <span>{configBanner.imagemUrl ? 'Fundo Carregado!' : 'Escolher Imagem do PC'}</span>
              </button>
              <input type="text" readOnly placeholder="Nenhum arquivo enviado" value={configBanner.imagemUrl ? "Imagem otimizada com sucesso para evitar erros no servidor" : ""} className="w-full p-2.5 bg-zinc-100/50 border border-zinc-200 rounded-xl text-xs font-medium text-zinc-400 pointer-events-none truncate select-none" />
            </div>
          </div>
        </div>
        <div className="flex justify-end pt-2 border-t border-zinc-200/60">
          <button 
            type="button" 
            disabled={salvandoLocal || carregandoBanner} 
            onClick={handleSalvarBannerDireto} 
            className="w-full sm:w-auto bg-zinc-900 text-white hover:bg-emerald-700 px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-colors flex items-center justify-center gap-2 shadow-sm disabled:opacity-50"
          >
            <Save className="w-4 h-4" /> {salvandoLocal ? 'Gravando...' : 'Salvar Configurações do Topo'}
          </button>
        </div>
      </div>

      {/* FORMULÁRIO DE CADASTRO / EDIÇÃO */}
      <div className={`border rounded-2xl p-5 space-y-4 transition-all duration-300 ${idEmEdicao ? 'bg-amber-50/40 border-amber-300 shadow-inner' : 'bg-zinc-50 border-zinc-200'}`}>
        <div className="flex justify-between items-center">
          <h4 className="text-xs font-black uppercase text-zinc-700 tracking-wide flex items-center gap-1.5">
            {idEmEdicao ? (
              <>
                <Edit2 className="w-4 h-4 text-amber-600" />
                <span className="text-amber-800">Editando Produto Selecionado</span>
              </>
            ) : (
              <>
                <Plus className="w-4 h-4 text-emerald-700" /> 
                <span>Cadastrar Produto na Vitrine do Pátio</span>
              </>
            )}
          </h4>
          
          {idEmEdicao && (
            <button 
              onClick={handleCancelarEdicao}
              className="text-[10px] bg-white border border-amber-200 hover:bg-zinc-100 text-amber-800 font-bold uppercase tracking-wider px-2.5 py-1 rounded-lg flex items-center gap-1"
            >
              <X className="w-3 h-3" /> Cancelar Edição
            </button>
          )}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
          <div className="md:col-span-3 space-y-1">
            <label className="text-[9px] font-black uppercase text-zinc-400">Classificação / Tratamento</label>
            <select 
              value={novo.categoria} 
              onChange={e => setNovo({...novo, categoria: e.target.value as any})} 
              className="w-full p-2.5 bg-white border rounded-xl text-xs font-bold text-zinc-700"
            >
              <option value="INNATURA">🌲 In Natura</option>
              <option value="TRATADO">🪵 Tratado (Autoclave)</option>
              <option value="RURAL">🚜 Mourão / Construção</option>
              <option value="LENHA">🔥 Lenha / Biomassa</option>
            </select>
          </div>

          <div className="md:col-span-4 space-y-1">
            <label className="text-[9px] font-black uppercase text-zinc-400">Nome Comercial do Produto</label>
            <input 
              type="text" 
              placeholder="Ex: Mourão Autoclavado 10 a 12cm" 
              value={novo.titulo} 
              onChange={e => setNovo({...novo, titulo: e.target.value})} 
              className="w-full p-2.5 bg-white border rounded-xl text-xs font-bold" 
            />
          </div>

          <div className="md:col-span-5 space-y-1">
            <label className="text-[9px] font-black uppercase text-zinc-400">Foto do Lote / Produto</label>
            <div className="flex gap-2">
              <input type="file" ref={arquivoInputRef} accept="image/*" onChange={handleTratarArquivo} className="hidden" />
              <button
                type="button"
                disabled={carregandoImagem}
                onClick={() => arquivoInputRef.current?.click()}
                className="flex bg-white hover:bg-zinc-100 border border-zinc-200 text-zinc-700 text-xs font-bold px-4 py-2.5 rounded-xl items-center justify-center gap-2 transition-all disabled:opacity-50 shrink-0"
              >
                {carregandoImagem ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-emerald-700" />
                    <span>Lendo...</span>
                  </>
                ) : novo.imagemUrl ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-600" />
                    <span className="text-emerald-700">Foto Escolhida!</span>
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4 text-zinc-500" />
                    <span>Escolher Arquivo</span>
                  </>
                )}
              </button>
              <input type="text" readOnly placeholder="Nenhum arquivo enviado" value={novo.imagemUrl ? "Foto comprimida com sucesso" : ""} className="w-full p-2.5 bg-zinc-100/50 border border-zinc-200 rounded-xl text-xs font-medium text-zinc-400 pointer-events-none truncate" />
            </div>
          </div>

          <div className="md:col-span-12 space-y-1">
            <label className="text-[9px] font-black uppercase text-zinc-400">Especificações Técnicas</label>
            <div className="relative">
              <FileText className="absolute left-3 top-3 text-zinc-400 w-3.5 h-3.5" />
              <textarea 
                rows={2}
                placeholder="Descreva as dimensões, o tipo de tratamento em autoclave e os diferenciais de durabilidade do material..." 
                value={novo.descricao} 
                onChange={e => setNovo({...novo, descricao: e.target.value})} 
                className="w-full p-2.5 pl-9 bg-white border rounded-xl text-xs resize-none focus:outline-none" 
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-1">
          <button 
            type="button" 
            onClick={handleSalvarProduto} 
            className={`w-full sm:w-auto px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-colors flex items-center justify-center gap-2 shadow-sm text-white ${idEmEdicao ? 'bg-amber-600 hover:bg-amber-700' : 'bg-zinc-900 hover:bg-emerald-800'}`}
          >
            <Check className="w-4 h-4" /> {idEmEdicao ? 'Salvar Alterações' : 'Fixar na Vitrine'}
          </button>
        </div>
      </div>

      {/* VITRINE DE PRODUTOS */}
      <div className="space-y-3">
        <h4 className="text-xs font-black uppercase text-zinc-400 tracking-wider border-b pb-2">
          Visualização do Catálogo Ativo ({produtos.length} Materiais)
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {produtos.map((prod) => (
            <div 
              key={prod.id} 
              className={`bg-white border rounded-2xl overflow-hidden shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between group ${idEmEdicao === prod.id ? 'border-amber-400 ring-2 ring-amber-400/20' : 'border-zinc-200'}`}
            >
              <div className="h-44 w-full bg-zinc-50 overflow-hidden relative border-b border-zinc-100 flex items-center justify-center text-zinc-300">
                {prod.imagemUrl ? (
                  <img 
                    src={prod.imagemUrl} 
                    alt={prod.titulo}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="flex flex-col items-center gap-1.5">
                    <Image className="w-6 h-6 stroke-[1.5] text-zinc-400" />
                    <span className="text-[10px] font-bold text-zinc-400 tracking-wide uppercase">Sem foto do lote</span>
                  </div>
                )}
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2.5">
                  {/* 🟢 CORRIGIDO: Mapeamento de texto elegante para todas as categorias no card */}
                  <div>
                    <span className={`text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded border ${
                      prod.categoria === 'INNATURA' ? 'bg-teal-50 text-teal-700 border-teal-100' :
                      prod.categoria === 'TRATADO' ? 'bg-emerald-50 text-emerald-800 border-emerald-100 font-extrabold' :
                      prod.categoria === 'RURAL' ? 'bg-amber-50 text-amber-800 border-amber-100' : 
                      'bg-orange-50 text-orange-800 border-orange-100'
                    }`}>
                      {prod.categoria === 'TRATADO' ? '🪵 TRATADO AUTOCLAVE' : 
                       prod.categoria === 'INNATURA' ? '🌲 IN NATURA' :
                       prod.categoria === 'RURAL' ? '🚜 MOURÃO / CONSTRUÇÃO' : '🔥 LENHA / BIOMASSA'}
                    </span>
                  </div>

                  <h5 className="text-sm font-serif font-black text-zinc-900 leading-tight group-hover:text-emerald-800 transition-colors">
                    {prod.titulo}
                  </h5>
                  
                  <p className="text-[11px] text-zinc-500 font-normal leading-relaxed">
                    {prod.descricao}
                  </p>
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <button 
                    type="button" 
                    onClick={() => handlePrepararEdicao(prod)}
                    className="flex-1 bg-zinc-100 text-zinc-800 hover:bg-zinc-900 hover:text-white py-2.5 rounded-xl text-[10px] font-black uppercase tracking-wider transition-colors flex items-center justify-center gap-1.5"
                  >
                    <Edit2 className="w-3 h-3" /> Editar Item
                  </button>
                  <button 
                    type="button" 
                    onClick={() => handleDeletar(prod.id)}
                    className="p-1.5 text-zinc-300 hover:text-rose-500 hover:bg-rose-50 border border-transparent hover:border-rose-100 rounded-xl transition-all"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}

          {produtos.length === 0 && (
            <div className="col-span-full text-center py-12 text-zinc-400 text-xs font-medium border border-dashed rounded-2xl bg-zinc-50/50">
              Nenhum produto cadastrado na vitrine.
            </div>
          )}
        </div>
      </div>

    </div>
  );
}