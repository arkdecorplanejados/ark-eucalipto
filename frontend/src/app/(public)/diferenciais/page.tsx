'use client';

import { useState, useEffect } from 'react';
import { ArrowLeft, ShieldCheck, Trees, Recycle, Compass, Phone } from 'lucide-react';
import Link from 'next/link';

interface ParallaxConfig {
  titulo: string;
  subtitulo: string;
  imagemUrl: string;
  whatsappCTA?: string; // 🟢 ADICIONADO: Propriedade mapeada do banco
}

export default function DiferenciaisPage() {
  // 🌲 Estado inicial com fallbacks seguros caso o banco ainda não tenha sido populado
  const [configParallax, setConfigParallax] = useState<ParallaxConfig>({
    titulo: "NOSSOS DIFERENCIAIS",
    subtitulo: "A robustez e a tecnologia por trás da nossa madeira tratada",
    imagemUrl: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=1600&auto=format&fit=crop&q=80",
    whatsappCTA: "" // Começa vazio para herdar o padrão
  });

  // 🔄 CONEXÃO EM TEMPO REAL: Puxa o que você editou lá no painel admin
  useEffect(() => {
    const dadosGlobais = localStorage.getItem('ark_eucalipto_config');
    
    if (dadosGlobais) {
      const parsed = JSON.parse(dadosGlobais);
      const logisticaCms = parsed.parallax?.logistica;

      if (logisticaCms) {
        setConfigParallax({
          titulo: logisticaCms.titulo?.toUpperCase() || "NOSSOS DIFERENCIAIS",
          subtitulo: logisticaCms.subtitulo || "A robustez e a tecnologia por trás da nossa madeira tratada",
          imagemUrl: logisticaCms.imagemUrl || "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=1600&auto=format&fit=crop&q=80",
          whatsappCTA: logisticaCms.whatsappCTA || "" // 🟢 CAPTURA O CAMPO DINÂMICO DO ADMIN
        });
      }
    }
  }, []);
  
  // 📡 DIRECIONAMENTO INTELIGENTE DO BOTÃO DE COBRANÇA/ORÇAMENTO
  const handleSolicitarOrcamento = () => {
    const mensagem = encodeURIComponent("Olá! Visitei a página de diferenciais da Ark Eucalipto e gostaria de alinhar um projeto com madeira tratada.");
    const ctaSalvo = configParallax.whatsappCTA?.trim();

    // Se não tiver nada salvo, usa o número padrão de contingência
    if (!ctaSalvo) {
      window.open(`https://wa.me/5577992365475?text=${mensagem}`, '_blank');
      return;
    }

    // Se for um link completo (começa com http), usa direto. Se for só o número, monta a URL nativa
    const urlFinal = ctaSalvo.startsWith('http')
      ? `${ctaSalvo}${ctaSalvo.includes('?') ? '&' : '?'}text=${mensagem}`
      : `https://wa.me/${ctaSalvo.replace(/\D/g, '')}?text=${mensagem}`;

    window.open(urlFinal, '_blank');
  };

  const diferenciais = [
    {
      icon: <ShieldCheck className="w-6 h-6 text-emerald-700" />,
      titulo: "Tratamento em Autoclave (vácuo-pressão)",
      descricao: "Nossa madeira passa pelo processo industrial de autoclave com composto CCA. Isso penetra profundamente nas camadas da madeira, blindando-a contra cupins, brocas, fungos e o apodrecimento precoce causado pela umidade constante do solo."
    },
    {
      icon: <Trees className="w-6 h-6 text-teal-700" />,
      titulo: "Alta Resistência Estrutural",
      descricao: "Selecionamos troncos de eucalipto com excelente alinhamento e conicidade reduzida. Ideal para o estresse de carga em escoramentos de laje, coberturas pesadas, postes operacionais e fundações rurais."
    },
    {
      icon: <Recycle className="w-6 h-6 text-amber-700" />,
      titulo: "Sustentabilidade Homologada",
      descricao: "Toda a nossa matéria-prima é oriunda de florestas plantadas e de reflorestamento 100% legalizado. Oferecemos uma alternativa ecológica de altíssima durabilidade, evitando a pressão sobre matas nativas."
    },
    {
      icon: <Compass className="w-6 h-6 text-zinc-700" />,
      titulo: "Custo-Benefício de Longo Prazo",
      descricao: "Investir em eucalipto tratado reduz drasticamente o custo de manutenção da sua obra ou propriedade rural. Enquanto madeiras comuns apodrecem em poucos anos, nossa madeira tratada resiste por décadas exposta ao sol e chuva."
    }
  ];

  return (
    <div className="bg-white min-h-screen text-zinc-800 antialiased selection:bg-emerald-50 selection:text-emerald-800">
      
      {/* 🌲 BANNER PARALLAX TOTALMENTE DINÂMICO */}
      <div 
        className="relative h-[280px] md:h-[340px] bg-fixed bg-cover bg-center flex items-center justify-center overflow-hidden transition-all duration-500"
        style={{ backgroundImage: `url('${configParallax.imagemUrl}')` }}
      >
        <div className="absolute inset-0 bg-black/50 backdrop-blur-[0.5px]" />
        
        <div className="absolute top-6 left-4 md:left-8 z-10">
          <Link 
            href="/" 
            className="inline-flex items-center gap-1.5 text-xs font-black text-white/90 uppercase tracking-wider hover:text-emerald-400 transition-colors bg-black/20 backdrop-blur-sm px-3 py-2 rounded-xl border border-white/10"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Voltar para o Início
          </Link>
        </div>

        <div className="relative text-center space-y-2 max-w-3xl px-4 animate-fadeIn">
          <h1 className="text-2xl md:text-4xl font-serif font-black text-white uppercase tracking-tight leading-none drop-shadow-md">
            {configParallax.titulo}
          </h1>
          <p className="text-xs md:text-sm text-zinc-200/90 font-medium tracking-wide drop-shadow-sm max-w-xl mx-auto leading-relaxed">
            {configParallax.subtitulo}
          </p>
        </div>
      </div>

      {/* 🎨 GRID DE DIFERENCIAIS */}
      <div className="max-w-7xl mx-auto px-4 pb-16 pt-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {diferenciais.map((item, index) => (
            <div 
              key={index}
              className="bg-zinc-50/50 border border-zinc-200/80 p-6 rounded-2xl flex flex-col justify-between space-y-4 hover:border-zinc-300 hover:bg-white transition-all duration-300 shadow-sm"
            >
              <div className="space-y-3">
                <div className="w-12 h-12 bg-white border border-zinc-200 rounded-xl flex items-center justify-center shadow-sm">
                  {item.icon}
                </div>
                <h3 className="text-base font-serif font-black text-zinc-900 tracking-tight">
                  {item.titulo}
                </h3>
                <p className="text-xs text-zinc-500 font-normal leading-relaxed">
                  {item.descricao}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* 🟢 CALL TO ACTION INTEGRADO AO NOVO LINK DINÂMICO */}
        <div className="mt-12 bg-zinc-900 text-white rounded-2xl p-6 md:p-8 border border-zinc-800 flex flex-col md:flex-row items-center justify-between gap-6 shadow-md">
          <div className="space-y-1 text-center md:text-left">
            <h4 className="text-lg font-serif font-black text-emerald-400">Pronto para construir com segurança?</h4>
            <p className="text-xs text-zinc-400 font-normal max-w-xl">
              Fale com nossa equipe técnica agora mesmo para dimensionar os mourões, estacas ou escoras perfeitas para a sua demanda estrutural.
            </p>
          </div>
          <button
            type="button"
            onClick={handleSolicitarOrcamento}
            className="w-full md:w-auto whitespace-nowrap bg-emerald-700 hover:bg-emerald-800 text-white px-6 py-3 rounded-xl text-xs font-black uppercase tracking-wider transition-colors flex items-center justify-center gap-2 shadow-sm"
          >
            <Phone className="w-4 h-4" /> Alinhar Carga
          </button>
        </div>
      </div>

    </div>
  );
}