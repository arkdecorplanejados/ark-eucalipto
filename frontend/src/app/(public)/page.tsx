'use client';

import { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import Diferenciais from '@/components/Diferenciais';
import Setores from '@/components/Setores';

interface Produto {
  id: string;
  nome: string;
  descricao?: string;
  categoria: string;
  visivel: boolean;
  preco?: string;
}

export default function PublicPage() {
  const [slideAtivo, setSlideAtivo] = useState<number>(0);
  const [config, setConfig] = useState<any>(null);
  const [termoBusca, setTermoBusca] = useState<string>('');
  const [categoriaAtiva, setCategoriaAtiva] = useState<string>('todos');

  // 📡 Carregamento de configurações do pátio
  useEffect(() => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
    fetch(`${apiUrl}/api/site/config`)
      .then((res) => res.json())
      .then((data) => setConfig(data))
      .catch((err) => console.error('Erro ao carregar dados da Home:', err));
  }, []);

  // 🔄 Rotação Automática dos Slides (Troca a cada 5 segundos)
  useEffect(() => {
    if (!config?.slides || config.slides.length <= 1) return;

    const intervalo = setInterval(() => {
      setSlideAtivo((prev) => (prev + 1) % config.slides.length);
    }, 5000);

    return () => clearInterval(intervalo);
  }, [config?.slides]);

  if (!config) {
    return (
      <div className="w-full flex items-center justify-center py-32 bg-stone-50">
        <p className="text-emerald-800 font-medium animate-pulse">Sincronizando pátio...</p>
      </div>
    );
  }

  const whatsappLimpo = config?.whatsapp?.replace(/\D/g, '') || '';
  
  const produtosFiltrados = (config?.produtosVitrine || []).filter((prod: Produto) => {
    const nomeDesc = `${prod.nome} ${prod.descricao || ''}`.toLowerCase();
    const bateTermo = nomeDesc.includes(termoBusca.toLowerCase());
    const bateCat = categoriaAtiva === 'todos' || prod.categoria === categoriaAtiva;
    return prod.visivel && bateCat && bateTermo;
  });

  return (
    <div className="w-full">
      
      {/* 🌳 1. HERO PRINCIPAL COM TRANSIÇÃO EM FADE DINÂMICO */}
     {/* 🌳 1. HERO PRINCIPAL COM TRANSIÇÃO EM FADE DINÂMICO E GRADIENTE SUAVIZADO */}
      <section className="relative bg-emerald-950 text-white py-36 px-6 overflow-hidden h-[540px] flex items-center justify-center">
        
        {/* Renderização de backgrounds sobrepostos para efeito cruzado */}
        {(config?.slides || []).map((slide: any, idx: number) => (
          <div
            key={slide.id || `bg-slide-${idx}`}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out select-none pointer-events-none ${
              idx === slideAtivo ? 'opacity-35' : 'opacity-0'
            }`}
          >
            <div 
              className="absolute inset-0 bg-cover bg-center bg-fixed"
              style={{ backgroundImage: `url(${slide.imagem || 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09'})` }}
            />
          </div>
        ))}
        
       {/* 🎛️ CAMADAS DE CORREÇÃO VISUAL PARA MÁXIMA SUAVIDADE (ANTI-NÉVOA) */}
        <div className="absolute inset-0 bg-stone-950/45 z-10" /> {/* Contraste para leitura do texto */}
        
        {/* Transição ultra diluída e estendida: começa imperceptível e acompanha a escuridão das árvores */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent from-70% via-stone-50/[0.02] via-[68%] via-stone-50/[0.12] via-[76%] via-stone-50/[0.35] via-[84%] via-stone-50/[0.70] via-[92%] to-stone-50 z-10" />
        
        {/* Bloco de Conteúdo com transição interna */}
        <div className="relative max-w-5xl mx-auto text-center space-y-6 z-20">
          <span className="bg-emerald-800/80 text-emerald-200 border border-emerald-600 px-5 py-2 rounded-full text-xs font-black uppercase tracking-widest shadow-sm inline-block">
            Direto do Produtor • Faturamento Direto
          </span>
          
          <div className="min-h-[160px] flex flex-col justify-center">
            <h1 className="text-4xl md:text-6xl font-serif font-black leading-tight max-w-4xl mx-auto text-stone-100 transition-all duration-700">
              {config?.slides?.[slideAtivo]?.titulo || 'Ark Eucalipto In Natura'}
            </h1>
            <p className="text-base md:text-xl text-stone-200 max-w-2xl mx-auto font-normal leading-relaxed mt-4 transition-all duration-700">
              {config?.slides?.[slideAtivo]?.subtitulo || 'Alta qualidade, rigidez estrutural e sustentabilidade com faturamento direto de Vitória da Conquista para toda a Bahia.'}
            </p>
          </div>

          {/* Indicadores do Slide ativo (Bolinhas) */}
          {config?.slides?.length > 1 && (
            <div className="flex justify-center gap-2 pt-6">
              {config.slides.map((_: any, idx: number) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setSlideAtivo(idx)}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    idx === slideAtivo ? 'w-8 bg-emerald-400' : 'w-2 bg-white/40 hover:bg-white/70'
                  }`}
                  aria-label={`Mudar para slide ${idx + 1}`}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* 🚀 2. DIFERENCIAIS */}
      <div className="bg-stone-50">
        <Diferenciais diferenciais={config?.diferenciais} />
      </div>
      {/* 🚛 3. PARALLAX DE LOGÍSTICA (CAMINHÃO DE CARGA) */}
     {/* 🚛 3. PARALLAX DE LOGÍSTICA */}
<section
  className="relative h-[440px] bg-fixed bg-center bg-cover flex items-center justify-center overflow-hidden"
  style={{
    backgroundImage: `url(${
      config?.parallax?.logistica?.imagemUrl ||
      'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?auto=format&fit=crop&q=80&w=1600'
    })`,
  }}
>
  <div className="absolute inset-0 bg-stone-950/75 z-10" />

  <div className="relative z-20 max-w-5xl px-6 text-center text-white space-y-6">
    <h2 className="text-3xl md:text-5xl font-serif font-black tracking-tight uppercase text-stone-100">
      {config?.parallax?.logistica?.titulo ||
        'Logística Pesada e Entrega Programada'}
    </h2>

    <p className="text-sm md:text-base text-stone-300 max-w-2xl mx-auto font-light leading-relaxed">
      {config?.parallax?.logistica?.subtitulo ||
        'Abastecemos canteiros de obras, estruturas rurais e indústrias com faturamento direto da fonte em qualquer região do estado.'}
    </p>
  </div>
</section>

      {/* 🚀 4. SETORES ATENDIDOS */}
      <div className="bg-white">
        <Setores whatsapp={whatsappLimpo} setores={config?.setores} />
      </div>

      {/* 📊 5. MIX DE PRODUTOS ENVOLVIDO EM PARALLAX DE FLORESTA DE EUCALIPTO */}
      <main
  id="catalogo"
  className="relative bg-fixed bg-center bg-cover py-24 px-6 space-y-16 overflow-hidden text-stone-100"
  style={{
    backgroundImage: `url(${
      config?.parallax?.catalogo?.imagemUrl ||
      'https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?auto=format&fit=crop&q=80&w=1600'
    })`,
  }}
>
        {/* Camada escura florestal por cima da imagem para dar contraste bruto nos cards */}
        <div className="absolute inset-0 bg-emerald-950/90 z-10" />
        <div className="absolute inset-0 bg-gradient-to-b from-white via-transparent to-zinc-900/40 opacity-10 z-10" />
        
        <div className="text-center space-y-3 relative z-20">
          <div className="flex items-center justify-center gap-3">
            <span className="w-8 h-[1px] bg-emerald-500 inline-block"></span>
            <span className="text-[11px] font-black tracking-[0.2em] uppercase text-emerald-400">Prontidão de Pátio</span>
            <span className="w-8 h-[1px] bg-emerald-500 inline-block"></span>
          </div>
          <h2 className="text-3xl md:text-5xl font-serif font-black tracking-tight text-white uppercase">
            Nosso Mix de Produtos
          </h2>
          <p className="text-stone-300 max-w-xl mx-auto text-xs md:text-sm leading-relaxed">
            Consulte as especificações brutas disponíveis para retirada imediata no pátio central em Vitória da Conquista ou entrega programada.
          </p>
        </div>

        {/* Barra de Busca */}
        <div className="bg-zinc-900/90 backdrop-blur-sm border border-zinc-800 rounded-3xl p-6 shadow-2xl max-w-4xl mx-auto relative group transition-all duration-300 hover:border-emerald-600/50 z-20">
          <div className="relative">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-4 text-zinc-500 group-focus-within:text-emerald-400 transition-colors" />
            <input 
              type="text" 
              placeholder="Buscar no pátio... (Ex: Mourão, Escora, Lenha)" 
              value={termoBusca} 
              onChange={(e) => setTermoBusca(e.target.value)} 
              className="w-full bg-zinc-950/80 border border-zinc-800 rounded-2xl py-4 pr-5 pl-14 text-xs md:text-sm focus:outline-none focus:border-emerald-600 focus:bg-zinc-950 text-white transition-all font-medium placeholder-zinc-500" 
            />
          </div>
        </div>

        {/* Abas Categorias */}
        <div className="flex flex-wrap justify-center gap-2 max-w-4xl mx-auto relative z-20">
          {[
            { id: 'todos', label: 'Ver Todo o Estoque' },
            { id: 'innatura', label: '🪵 In Natura' },
            { id: 'rural', label: '🌲 Linha Rural' },
            { id: 'lenha', label: '🔥 Biomassa / Lenha' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setCategoriaAtiva(tab.id)}
              className={`px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider border transition-all ${
                categoriaAtiva === tab.id 
                  ? 'bg-emerald-700 border-emerald-500 text-white shadow-lg scale-105' 
                  : 'bg-zinc-900/80 backdrop-blur-sm border-zinc-800 text-stone-300 hover:bg-zinc-800 hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Grid de Cards */}
        <div className="max-w-6xl mx-auto flex justify-center relative z-20">
          {produtosFiltrados.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 w-full">
              {produtosFiltrados.map((prod: any) => (
                <div 
                  key={prod.id} 
                  className="bg-zinc-900/90 backdrop-blur-sm border border-zinc-800/80 rounded-3xl p-8 flex flex-col justify-between shadow-2xl hover:border-emerald-600/40 hover:-translate-y-2 transition-all duration-500 group"
                >
                  <div className="space-y-4">
                    <span className="inline-block bg-zinc-950 text-emerald-400 text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-md border border-zinc-800">
                      {prod.categoria === 'rural' && 'Linha Rural'}
                      {prod.categoria === 'innatura' && 'In Natura'}
                      {prod.categoria === 'lenha' && 'Biomassa / Lenha'}
                      {!['rural', 'innatura', 'lenha'].includes(prod.categoria) && prod.categoria}
                    </span>
                    <h3 className="font-serif font-black text-xl text-white tracking-tight leading-snug group-hover:text-emerald-400 transition-colors">
                      {prod.nome}
                    </h3>
                    <p className="text-xs text-stone-400 leading-relaxed line-clamp-3">
                      {prod.descricao || 'Madeira robusta de alta densidade selecionada diretamente na fonte pautada no manejo sustentável.'}
                    </p>
                  </div>
                  
                  <div className="pt-8 space-y-4">
                    <div className="flex items-baseline gap-2 border-t border-zinc-800 pt-4">
                      <span className="text-[10px] uppercase font-black tracking-wider text-zinc-500">Preço Pátio:</span>
                      <span className="text-emerald-400 font-serif font-black text-lg">{prod.preco || 'Sob Consulta'}</span>
                    </div>
                    <a 
                      href={`https://wa.me/${whatsappLimpo}?text=Olá!%20Gostaria%20de%20solicitar%20um%20orçamento%20para%20o%20material:%20${encodeURIComponent(prod.nome)}`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="w-full bg-emerald-700 text-white text-center py-3.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all duration-300 hover:bg-emerald-800 shadow-md block"
                    >
                      Cotar no WhatsApp
                    </a>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="w-full text-center py-16 text-stone-500 text-sm bg-zinc-900/90 border border-zinc-800 rounded-3xl font-medium shadow-inner">
              Nenhum material encontrado no pátio com os critérios filtrados.
            </div>
          )}
        </div>
      </main>
    </div>
  );
}