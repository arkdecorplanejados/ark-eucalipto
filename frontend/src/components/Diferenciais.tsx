'use client';

// 🌳 Tipagem para manter o padrão MVC e a segurança do TypeScript
interface Diferencial {
  icone: string;    // Pode ser um emoji (🚛, 🏗️) ou uma classe de ícone
  titulo: string;   // Ex: "Pronta Entrega"
  subtitulo: string; // Ex: "Logística Ágil"
  texto: string;    // Descrição detalhada do card
}

interface DiferenciaisProps {
  diferenciais?: Diferencial[]; // Array vindo do estado global/Firebase
}

export default function Diferenciais({ diferenciais = [] }: DiferenciaisProps) {
  // Se os dados estiverem carregando ou o array vier vazio, o layout não quebra
  if (!diferenciais || diferenciais.length === 0) return null;

  return (
    <section className="bg-gradient-to-b from-stone-100 to-stone-50 py-24 px-6 relative overflow-hidden border-b border-stone-200/50">
      {/* Efeitos visuais de fundo */}
      <div className="absolute inset-0 pointer-events-none opacity-40">
        <div className="absolute top-10 left-10 w-32 h-32 bg-emerald-700/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-10 right-10 w-48 h-48 bg-emerald-900/5 rounded-full blur-3xl animate-pulse duration-4000"></div>
      </div>

      {/* Cabeçalho da Seção */}
      <div className="max-w-7xl mx-auto space-y-3 mb-16 text-center md:text-left relative z-10">
        <div className="flex items-center justify-center md:justify-start gap-3">
          <span className="w-8 h-[1px] bg-emerald-700/60 inline-block"></span>
          <span className="text-[11px] font-medium tracking-[0.2em] uppercase text-emerald-800">
            Diferenciais Ark
          </span>
        </div>
        <h2 className="text-3xl md:text-4xl font-serif font-black text-zinc-950 tracking-tight leading-tight pt-1">
          Eucalipto In Natura: Diferenciais de Impacto para Sua Obra e Indústria
        </h2>
      </div>

      {/* Grid Dinâmico mapeando os diferenciais do Firebase */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 relative z-10">
        {diferenciais.map((item, index) => (
          <div
            key={index}
            className="bg-white border border-stone-200/80 rounded-3xl p-8 shadow-sm hover:shadow-2xl hover:border-emerald-800/30 hover:-translate-y-3 transition-all duration-500 ease-out flex flex-col justify-between group cursor-pointer"
          >
            <div className="space-y-4">
              {/* Ícone ou Emoji Dinâmico */}
              <div className="w-14 h-14 rounded-2xl bg-stone-100 flex items-center justify-center text-2xl text-emerald-800 group-hover:bg-emerald-800 group-hover:text-white group-hover:rotate-6 group-hover:scale-110 transition-all duration-300 shadow-inner">
                {item.icone || "🌲"}
              </div>
              
              <div className="space-y-1">
                {/* Título Dinâmico */}
                <h3 className="text-2xl font-serif font-black text-zinc-900 tracking-tight leading-tight group-hover:text-emerald-950 transition-colors">
                  {item.titulo}
                </h3>
                {/* Subtítulo / Tag Verde Dinâmica */}
                <span className="text-[10px] font-black uppercase tracking-wider text-emerald-600 block">
                  {item.subtitulo}
                </span>
              </div>
              
              {/* Texto Descritivo Dinâmico */}
              <p className="text-xs text-zinc-500 leading-relaxed pt-2">
                {item.texto}
              </p>
            </div>

            {/* Botão de Ação Visual */}
            <div className="pt-6 flex justify-end opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300">
              <span className="text-emerald-700 font-bold text-sm">Saber Mais →</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}