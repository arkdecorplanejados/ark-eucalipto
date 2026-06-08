'use client';

import { useState, useEffect } from 'react';
import { ArrowLeft, ChevronDown, ChevronUp, Phone, HelpCircle } from 'lucide-react';
import Link from 'next/link';

interface FAQItem {
  pergunta: string;
  resposta: string;
}

interface ParallaxConfig {
  titulo: string;
  subtitulo: string;
  imagemUrl: string;
}

export default function FAQPage() {
  const [itemAberto, setItemAberto] = useState<number | null>(null);

  // 🌲 Configurações de fallback inicial alinhadas ao padrão de design do site
  const [configBanner, setConfigBanner] = useState<ParallaxConfig>({
    titulo: "DÚVIDAS FREQUENTES",
    subtitulo: "Esclareça suas principais dúvidas técnicas e comerciais sobre o nosso eucalipto tratado e logística",
    imagemUrl: "https://images.unsplash.com/photo-1448375240586-882707db888b?w=1600&auto=format&fit=crop&q=80"
  });

  // 🔄 CONEXÃO COM O BANCO DE DADOS LOCAL DO CMS
  useEffect(() => {
    const dadosGlobais = localStorage.getItem('ark_eucalipto_config');
    if (dadosGlobais) {
      const parsed = JSON.parse(dadosGlobais);
      // Se você decidir criar uma chave dedicada 'faq' no painel, ele pesca aqui. 
      // Caso contrário, ele herda uma imagem de madeira de cobertura do pátio para não quebrar.
      const faqCms = parsed.parallax?.faq || parsed.parallax?.logistica;
      
      if (faqCms) {
        setConfigBanner({
          titulo: faqCms.titulo?.toUpperCase() || "DÚVIDAS FREQUENTES",
          subtitulo: faqCms.subtitulo || "Esclareça suas principais dúvidas técnicas e comerciais sobre o nosso eucalipto",
          imagemUrl: faqCms.imagemUrl || "https://images.unsplash.com/photo-1448375240586-882707db888b?w=1600&auto=format&fit=crop&q=80"
        });
      }
    }
  }, []);

  const handleSolicitarSuporte = () => {
    const mensagem = encodeURIComponent("Olá! Dei uma olhada nas dúvidas frequentes do site, mas preciso de um suporte personalizado sobre os lotes de eucalipto.");
    window.open(`https://wa.me/5577999999999?text=${mensagem}`, '_blank');
  };

  const listaFaq: FAQItem[] = [
    {
      pergunta: "Qual a durabilidade média do eucalipto tratado em autoclave?",
      resposta: "O eucalipto tratado em autoclave com composto CCA possui uma vida útil estimada superior a 20 anos, mesmo quando em contato direto com o solo, umidade e intempéries. O processo vácuo-pressão imuniza a madeira contra fungos, cupins e brocas."
    },
    {
      pergunta: "Vocês trabalham com entrega direta no pátio ou na obra?",
      resposta: "Sim! Gerenciamos toda a logística de carregamento e transporte estruturado. Realizamos entregas programadas de lotes fechados diretamente na sua propriedade rural, fazenda ou canteiro de obras na região, garantindo o alinhamento seguro da carga."
    },
    {
      pergunta: "Qual a diferença entre a madeira In Natura e a Tratada?",
      resposta: "A madeira In Natura é o eucalipto bruto, excelente para uso temporário e rápido na construção civil, como escoramentos de laje de curto prazo. A madeira Tratada passa pelo tratamento industrial na autoclave, sendo indicada para estruturas permanentes (mourões de cerca, postes, galpões e fundações) devido à sua altíssima resistência e imunidade."
    },
    {
      pergunta: "Como funcionam as formas de pagamento e faturamento de lotes?",
      resposta: "Trabalhamos com opções flexíveis via PIX, transferências bancárias seguras e cartões de crédito/débito. Para empresas de engenharia, construtoras e produtores rurais, oferecemos condições de faturamento direto mediante análise de crédito integrada pelo nosso painel de gestão administrativa."
    }
  ];

  return (
    <div className="bg-white min-h-screen text-zinc-800 antialiased selection:bg-emerald-50 selection:text-emerald-800">
      
      {/* 🌲 BANNER PARALLAX PREMIUM UNIFICADO NO TOPO */}
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

      {/* 🎨 SEÇÃO MÃE: GRID DE FAQ EM ACCORDION SLIM */}
      <div className="max-w-4xl mx-auto px-4 pb-16 pt-12">
        <div className="space-y-3">
          {listaFaq.map((item, index) => {
            const aberto = itemAberto === index;
            return (
              <div 
                key={index}
                className={`border rounded-2xl overflow-hidden transition-all duration-200 ${
                  aberto ? 'bg-zinc-50/70 border-zinc-300 shadow-sm' : 'bg-white border-zinc-200 hover:border-zinc-300'
                }`}
              >
                <button
                  type="button"
                  onClick={() => setItemAberto(aberto ? null : index)}
                  className="w-full p-5 text-left flex items-center justify-between gap-4 focus:outline-none select-none"
                >
                  <span className="text-xs md:text-sm font-black font-serif text-zinc-900 tracking-tight">
                    {item.pergunta}
                  </span>
                  <div className="text-zinc-400 shrink-0">
                    {aberto ? <ChevronUp className="w-4 h-4 text-emerald-700 stroke-[2.5]" /> : <ChevronDown className="w-4 h-4" />}
                  </div>
                </button>

                {aberto && (
                  <div className="px-5 pb-5 text-xs text-zinc-500 leading-relaxed font-normal border-t border-zinc-100/80 pt-4 animate-fadeIn">
                    {item.resposta}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* 📢 CONTAINER CALL TO ACTION INFERIOR */}
        <div className="mt-12 bg-zinc-900 text-white rounded-2xl p-6 md:p-8 border border-zinc-800 flex flex-col md:flex-row items-center justify-between gap-6 shadow-md">
          <div className="space-y-1 text-center md:text-left">
            <h4 className="text-lg font-serif font-black text-emerald-400">Ainda tem alguma dúvida técnica?</h4>
            <p className="text-xs text-zinc-400 font-normal max-w-xl">
              Se você precisa de um dimensionamento de bitola específico ou de um orçamento para grandes volumes, chame o nosso suporte técnico comercial.
            </p>
          </div>
          <button
            type="button"
            onClick={handleSolicitarSuporte}
            className="w-full md:w-auto whitespace-nowrap bg-emerald-700 hover:bg-emerald-800 text-white px-6 py-3 rounded-xl text-xs font-black uppercase tracking-wider transition-colors flex items-center justify-center gap-2 shadow-sm"
          >
            <Phone className="w-4 h-4" /> Suporte no WhatsApp
          </button>
        </div>
      </div>

    </div>
  );
}