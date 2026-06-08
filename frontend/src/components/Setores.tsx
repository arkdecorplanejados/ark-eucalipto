'use client';

// 🌳 Definindo a estrutura de tipos para garantir segurança jurídica no TypeScript
interface Setor {
  icone: string;
  titulo: string;
  subtitulo?: string; // Caso queira usar o subtitulo no futuro
  texto: string;
  linkTexto: string;
}

interface SetoresProps {
  whatsapp: string;
  setores?: Setor[]; // Recebe o array dinâmico do Firebase
}

export default function Setores({ whatsapp, setores = [] }: SetoresProps) {
  // Caso o Firebase ainda esteja carregando ou venha vazio, ele não quebra a tela
  if (!setores || setores.length === 0) return null;

  // Limpa o número do WhatsApp removendo espaços e caracteres especiais para o link wa.me
  const whatsappLimpo = whatsapp ? whatsapp.replace(/\D/g, '') : '';

  return (
    <section className="bg-white py-24 px-6 border-b border-stone-200/50 relative overflow-hidden">
      {/* Cabeçalho da Seção */}
      <div className="max-w-7xl mx-auto space-y-3 mb-16 text-center md:text-left">
        <div className="flex items-center justify-center md:justify-start gap-3">
          <span className="w-8 h-[1px] bg-emerald-700/60 inline-block"></span>
          <span className="text-[11px] font-medium tracking-[0.2em] uppercase text-emerald-800">
            Soluções Sob Medida
          </span>
        </div>
        <h2 className="text-3xl md:text-4xl font-serif font-black text-zinc-950 tracking-tight leading-tight pt-1">
          Do Campo à Indústria: Atendendo os Principais Setores da Região
        </h2>
        <p className="text-sm text-zinc-500 max-w-2xl">
          Fornecemos madeira bruta com cortes e bitolas selecionadas para garantir máxima eficiência.
        </p>
      </div>

      {/* Grid Dinâmico Alimentado pelo Firebase */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        {setores.map((setor, index) => (
          <div 
            key={index} 
            className="bg-stone-50 border border-stone-200/60 rounded-3xl p-8 flex flex-col justify-between shadow-sm hover:shadow-xl hover:border-emerald-800/20 hover:bg-white transition-all duration-500 group"
          >
            <div className="space-y-5">
              {/* Ícone Dinâmico (🌾, 🏗️, 🔥) */}
              <div className="text-3xl">{setor.icone}</div>
              
              {/* Título do Setor Dinâmico */}
              <h3 className="text-2xl font-serif font-black text-zinc-900 tracking-tight">
                {setor.titulo}
              </h3>
              
              {/* Descrição Dinâmica */}
              <p className="text-xs text-zinc-500 leading-relaxed">
                {setor.texto}
              </p>
            </div>

            {/* Chamada para o WhatsApp com Mensagem Customizada por Setor */}
            <div className="pt-8">
              <a 
                href={`https://wa.me/${whatsappLimpo}?text=Olá,%20gostaria%20de%20um%20orçamento%20de%20eucalipto%20para%20o%20setor%20de%20${encodeURIComponent(setor.titulo)}.`} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-xs font-bold text-emerald-800 group-hover:underline flex items-center gap-1"
              >
                {setor.linkTexto || "Falar com Especialista →"}
              </a>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}