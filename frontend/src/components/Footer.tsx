'use client';

import { Mail, Phone, MapPin, Trees, ArrowUpRight, ShieldCheck } from 'lucide-react';
import Link from 'next/link';

// ⚙️ INTEGRAÇÃO INTERFACE: Mapeia os dados que virão da API do CMS
interface FooterProps {
  dados?: {
    descricaoSite?: string;
    whatsapp?: string;
    email?: string;
    endereco?: string;
  };
}

export default function Footer({ dados }: FooterProps) {
  const anoAtual = new Date().getFullYear();

  // 🛡️ TRATAMENTO DE FALLBACKS: Garante o funcionamento caso o banco esteja carregando
  const descricao = dados?.descricaoSite || "Soluções sustentáveis em madeira bruta, escoramentos estruturais e biomassa para toda a Bahia. Faturamento direto do produtor com garantia de procedência legal.";
  const whatsappPuro = dados?.whatsapp || "73982365475";
  const emailValido = dados?.email || "contato@arkdecor.com.br";
  const enderecoValido = dados?.endereco || "Vitória da Conquista - BA";

  // 📞 MÁSCARA DINÂMICA: Formata o número vindo limpo do banco para (XX) XXXXX-XXXX
  const formatarWhatsapp = (num: string) => {
    const limpo = num.replace(/\D/g, '');
    if (limpo.length === 11) {
      return `(${limpo.substring(0, 2)}) ${limpo.substring(2, 7)}-${limpo.substring(7)}`;
    }
    return num;
  };

  return (
    <footer className="bg-zinc-950 text-zinc-400 border-t border-zinc-900 antialiased font-sans">
      
      {/* 🌲 SEÇÃO PRINCIPAL DO RODAPÉ */}
      <div className="max-w-7xl mx-auto px-6 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12">
          
          {/* COLUNA 1: LOGO E DESCRIÇÃO DINÂMICA */}
          <div className="md:col-span-4 space-y-4">
            <div className="flex items-center gap-2 text-white font-serif font-black tracking-tight text-lg">
              <div className="w-8 h-8 bg-emerald-950 border border-emerald-800 rounded-lg flex items-center justify-center text-emerald-400 shadow-sm">
                <Trees className="w-4 h-4" />
              </div>
              <span>ARK EUCALIPTO</span>
            </div>
            <p className="text-xs text-zinc-500 leading-relaxed font-normal max-w-sm">
              {descricao}
            </p>
          </div>

          {/* COLUNA 2: NAVEGAÇÃO / LINKS RÁPIDOS */}
          <div className="md:col-span-2 space-y-3">
            <h4 className="text-[10px] font-black uppercase text-zinc-200 tracking-widest border-b border-zinc-900 pb-1.5">
              Navegação
            </h4>
            <ul className="space-y-2 text-xs font-medium">
              {[
                { label: 'Início', href: '/' },
                { label: 'Produtos', href: '/produtos' },
                { label: 'Diferenciais', href: '/diferenciais' },
                { label: 'Dúvidas (FAQ)', href: '/faq' }
              ].map((link, idx) => (
                <li key={idx}>
                  <Link 
                    href={link.href} 
                    className="hover:text-emerald-400 transition-colors inline-flex items-center gap-0.5 group"
                  >
                    {link.label}
                    <ArrowUpRight className="w-2.5 h-2.5 opacity-0 group-hover:opacity-100 transition-opacity text-emerald-500" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* COLUNA 3: CONTATO COMERCIAL DINÂMICO */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="text-[10px] font-black uppercase text-zinc-200 tracking-widest border-b border-zinc-900 pb-1.5">
              Contato Comercial
            </h4>
            <ul className="space-y-2.5 text-xs font-medium">
              <li>
                <a 
                  href={`https://wa.me/55${whatsappPuro.replace(/\D/g, '')}`} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="flex items-start gap-2 hover:text-white transition-colors group"
                >
                  <Phone className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5 group-hover:scale-110 transition-transform" />
                  <div className="space-y-0.5">
                    <span className="block text-[10px] text-zinc-600 font-black uppercase tracking-tight">WhatsApp</span>
                    <span className="text-zinc-300 font-mono">{formatarWhatsapp(whatsappPuro)}</span>
                  </div>
                </a>
              </li>
              <li>
                <a 
                  href={`mailto:${emailValido}`} 
                  className="flex items-start gap-2 hover:text-white transition-colors group"
                >
                  <Mail className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5 group-hover:scale-110 transition-transform" />
                  <div className="space-y-0.5">
                    <span className="block text-[10px] text-zinc-600 font-black uppercase tracking-tight">E-mail</span>
                    <span className="text-zinc-300 font-mono select-all">{emailValido}</span>
                  </div>
                </a>
              </li>
            </ul>
          </div>

          {/* COLUNA 4: ONDE ESTAMOS DINÂMICO */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="text-[10px] font-black uppercase text-zinc-200 tracking-widest border-b border-zinc-900 pb-1.5">
              Onde Estamos
            </h4>
            <div className="flex items-start gap-2 text-xs">
              <MapPin className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <span className="text-zinc-200 font-bold block">{enderecoValido}</span>
                <span className="text-[11px] text-zinc-500 font-normal leading-relaxed block">
                  Atendimento estratégico voltado a Canteiros de Obra, Construtoras e Indústrias da região.
                </span>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* 📑 ASSINATURA INFERIOR E DIREITOS */}
      <div className="border-t border-zinc-900 bg-black/40 py-5 text-[10px] font-medium text-zinc-600 tracking-wide">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-zinc-700" />
            <span>&copy; {anoAtual} Ark Eucalipto. Todos os direitos reservados.</span>
          </div>
          <div className="flex items-center gap-1">
            <span>Desenvolvido por</span>
            <span className="text-zinc-500 font-black tracking-tighter hover:text-emerald-500 transition-colors cursor-pointer">
              Ark Decor Mídia
            </span>
          </div>
        </div>
      </div>

    </footer>
  );
}