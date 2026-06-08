'use client';

import { useState, useEffect } from 'react';
import { Tag, Phone, ArrowLeft, ShieldCheck, Layers, Flame, Trees } from 'lucide-react';
import Link from 'next/link';

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

export default function ProdutosPublicoPage() {
  const [produtos, setProdutos] = useState<ProdutoVitrine[]>([]);
  const [categoriaAtiva, setCategoriaAtiva] = useState<string>('TODOS');
  
  // 🌲 Configurações de fallback inicial para o Parallax do Catálogo
  const [configBanner, setConfigBanner] = useState<ParallaxConfig>({
    titulo: "NOSSO CATÁLOGO",
    subtitulo: "Confira nossa linha completa de eucalipto estrutural in natura, materiais tratados e biomassa de alta performance.",
    imagemUrl: "https://images.unsplash.com/photo-1601597111158-2fceff292cdc?w=1600&auto=format&fit=crop&q=80"
  });

  // 🔄 1. CONEXÃO EM TEMPO REAL COM OS DADOS DINÂMICOS DO CMS
  useEffect(() => {
    // Carrega a lista de produtos cadastrados no pátio
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
    }

    // Carrega as configurações globais do banner parallax do topo
    const dadosGlobais = localStorage.getItem('ark_eucalipto_config');
    if (dadosGlobais) {
      const parsed = JSON.parse(dadosGlobais);
      const catalogoCms = parsed.parallax?.catalogo;

      if (catalogoCms) {
        setConfigBanner({
          titulo: catalogoCms.titulo?.toUpperCase() || "NOSSO CATÁLOGO",
          subtitulo: catalogoCms.subtitulo || "Confira nossa linha completa de eucalipto estrutural in natura, materiais tratados e biomassa",
          imagemUrl: catalogoCms.imagemUrl || "https://images.unsplash.com/photo-1601597111158-2fceff292cdc?w=1600&auto=format&fit=crop&q=80"
        });
      }
    }
  }, []);

  // 📞 DIRECIONAMENTO DO WHATSAPP COM TEXTO DINÂMICO
  const handleSolicitarCotacao = (nomeProduto: string) => {
    const mensagem = encodeURIComponent(`Olá! Gostaria de solicitar um orçamento e checar a disponibilidade do lote para o produto: ${nomeProduto}.`);
    window.open(`https://wa.me/5577999999999?text=${mensagem}`, '_blank'); // 👈 Substitua pelo seu número institucional
  };

  // 🎛️ FILTRAGEM DINÂMICA DE BOTÕES
  const produtosFiltrados = produtos.filter(p => {
    if (categoriaAtiva === 'TODOS') return true;
    return p.categoria === categoriaAtiva;
  });

  return (
    <div className="bg-white min-h-screen text-zinc-800 antialiased selection:bg-emerald-50 selection:text-emerald-800">
      
      {/* 🌲 BANNER PARALLAX PREMIUM DINÂMICO NO TOPO */}
      <div 
        className="relative h-[280px] md:h-[340px] bg-fixed bg-cover bg-center flex items-center justify-center overflow-hidden transition-all duration-500"
        style={{ backgroundImage: `url('${configBanner.imagemUrl}')` }}
      >
        <div className="absolute inset-0 bg-black/55 backdrop-blur-[0.5px]" />
        
        <div className="absolute top-6 left-4 md:left-8 z-10">
          <Link 
            href="/" 
            className="inline-flex items-center gap-1.5 text-xs font-black text-white/90 uppercase tracking-wider hover:text-emerald-400 transition-colors bg-black/20 backdrop-blur-sm px-3 py-2 rounded-xl border border-white/10"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Voltar para o Início
          </Link>
        </div>

        <div className="relative text-center space-y-2 max-w-3xl px-4 animate-fadeIn">
          <h1 className="text-2xl md:text-4xl font-serif font-black text-white uppercase tracking-tight leading-none drop-shadow-sm">
            {configBanner.titulo}
          </h1>
          <p className="text-xs md:text-sm text-zinc-200/90 font-medium tracking-wide drop-shadow-sm max-w-xl mx-auto leading-relaxed">
            {configBanner.subtitulo}
          </p>
        </div>
      </div>

      {/* 🎚️ NAVEGAÇÃO / FILTROS ELEGANTES (Estilo E-commerce Premium) */}
      <div className="max-w-7xl mx-auto px-4 pt-8 pb-4">
        <div className="flex gap-2 overflow-x-auto pb-2 pt-2 scrollbar-none border-b border-zinc-100">
          {[
            { id: 'TODOS', label: '📦 Todos os Materiais' },
            { id: 'TRATADO', label: '🪵 Tratado Autoclave' },
            { id: 'INNATURA', label: '🌲 In Natura' },
            { id: 'RURAL', label: '🚜 Mourão / Obra' },
            { id: 'LENHA', label: '🔥 Lenha / Biomassa' }
          ].map(cat => (
            <button
              key={cat.id}
              onClick={() => setCategoriaAtiva(cat.id)}
              className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider whitespace-nowrap transition-all border ${
                categoriaAtiva === cat.id
                  ? 'bg-zinc-900 border-zinc-900 text-white shadow-sm'
                  : 'bg-zinc-50 border-zinc-200 text-zinc-500 hover:text-zinc-800'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* 🎨 SEÇÃO MÃE: GRID DE CARDS PREMIUM PÚBLICO */}
      <div className="max-w-7xl mx-auto px-4 pb-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {produtosFiltrados.map((prod) => (
            <div 
              key={prod.id} 
              className="bg-white border border-zinc-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between group"
            >
              {/* 🖼️ Espaço para Foto Carregada ou Placeholder Elegante */}
              <div className="h-52 w-full bg-zinc-50 overflow-hidden relative border-b border-zinc-100 flex items-center justify-center text-zinc-300 select-none">
                {prod.imagemUrl ? (
                  <img 
                    src={prod.imagemUrl} 
                    alt={prod.titulo}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="flex flex-col items-center gap-2">
                    <Layers className="w-7 h-7 stroke-[1.2] text-zinc-300" />
                    <span className="text-[9px] font-black text-zinc-400 tracking-widest uppercase">Ark Eucalipto</span>
                  </div>
                )}
              </div>

              {/* Corpo de Informações do Card */}
              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2.5">
                  {/* Categorização Visual com Cores Estilizadas */}
                  <div>
                    <span className={`text-[9px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded border inline-flex items-center gap-1 ${
                      prod.categoria === 'INNATURA' ? 'bg-teal-50 text-teal-700 border-teal-100' :
                      prod.categoria === 'TRATADO' ? 'bg-emerald-50 text-emerald-800 border-emerald-100 font-black' :
                      prod.categoria === 'RURAL' ? 'bg-amber-50 text-amber-800 border-amber-100' : 
                      'bg-orange-50 text-orange-800 border-orange-100'
                    }`}>
                      {prod.categoria === 'TRATADO' && <ShieldCheck className="w-3 h-3 text-emerald-600 stroke-[2.5]" />}
                      {prod.categoria === 'INNATURA' && <Trees className="w-3 h-3 text-teal-600" />}
                      {prod.categoria === 'LENHA' && <Flame className="w-3 h-3 text-orange-600" />}
                      {prod.categoria === 'TRATADO' ? 'Tratado Autoclave' : prod.categoria}
                    </span>
                  </div>

                  {/* Título Serifado Premium */}
                  <h3 className="text-base font-serif font-black text-zinc-900 leading-tight group-hover:text-emerald-800 transition-colors">
                    {prod.titulo}
                  </h3>
                  
                  {/* Descrição Comercial fluída */}
                  <p className="text-xs text-zinc-500 font-normal leading-relaxed">
                    {prod.descricao}
                  </p>
                </div>

                {/* 📞 BOTÃO COM ACIONAMENTO DE LINK DO WHATSAPP COM TEXTO DINÂMICO */}
                <div className="pt-2">
                  <button 
                    type="button" 
                    onClick={() => handleSolicitarCotacao(prod.titulo)}
                    className="w-full bg-zinc-900 text-white hover:bg-emerald-700 py-3 rounded-xl text-xs font-black uppercase tracking-wider transition-colors flex items-center justify-center gap-2 shadow-sm"
                  >
                    <Phone className="w-3.5 h-3.5" /> Solicitar Cotação
                  </button>
                </div>
              </div>
            </div>
          ))}

          {/* Estado Vazio de Busca / Filtro */}
          {produtosFiltrados.length === 0 && (
            <div className="col-span-full text-center py-16 text-zinc-400 text-xs font-medium border border-dashed rounded-3xl bg-zinc-50/50">
              Nenhum material disponível nesta categoria no momento. Entre em contato para encomendas.
            </div>
          )}
        </div>
      </div>

    </div>
  );
}