'use client';

import { Phone, Menu, X } from 'lucide-react';

interface HeaderProps {
  config: any;
  whatsappLimpo: string;
  menuAberto: boolean;
  setMenuAberto: (aberto: boolean) => void;
}

export default function Header({ config, whatsappLimpo, menuAberto, setMenuAberto }: HeaderProps) {
  return (
    <header className="bg-white sticky top-0 z-50 border-b border-stone-100 shadow-md">
      <div className="max-w-7xl mx-auto px-6 h-28 flex items-center justify-between gap-4">
        
        {/* LOGO COESÃO CLOUDINARY */}
        <div className="flex-shrink-0">
          <a href="/" className="block transition-transform hover:scale-105 py-2">
            {config?.logoUrl ? (
              <img 
                src={config.logoUrl} 
                alt="Ark Eucalipto" 
                className="h-20 md:h-24 w-auto object-contain max-w-[280px] drop-shadow-md select-none" 
              />
            ) : (
              <div className="flex flex-col">
                <span className="text-2xl font-serif font-black text-emerald-950 tracking-tight leading-none">Ark Eucalipto</span>
                <span className="text-[10px] uppercase font-black tracking-widest text-emerald-600 mt-1">Madeiras In Natura</span>
              </div>
            )}
          </a>
        </div>
        
        {/* NAVEGAÇÃO DESKTOP */}
        <nav className="hidden lg:flex items-center gap-8">
          {(config?.menu || []).map((link: any) => (
            <a 
              key={link.id} 
              href={link.href} 
              className="group relative text-sm font-bold text-zinc-600 hover:text-emerald-900 py-2 block transition-colors"
            >
              {link.label}
              <span className="absolute bottom-0 left-0 w-full h-[2px] bg-emerald-700 scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300" />
            </a>
          ))}
        </nav>

        {/* REDES SOCIAIS E ORÇAMENTO */}
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-4 border-r border-stone-200 pr-6 hidden sm:flex">
            <a href="https://instagram.com/arkeucalipto" target="_blank" rel="noopener noreferrer" className="text-zinc-500 hover:text-emerald-800 transition-all hover:scale-110 p-1">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
            </a>
            <a href="https://facebook.com/arkeucalipto" target="_blank" rel="noopener noreferrer" className="text-zinc-500 hover:text-emerald-800 transition-all hover:scale-110 p-1">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
            </a>
          </div>

          <a 
            href={`https://wa.me/${whatsappLimpo}?text=Olá!%20Gostaria%20de%20solicitar%20um%20orçamento%20de%20eucalipto%20in%20natura.`} 
            target="_blank" 
            rel="noopener noreferrer"
            className="bg-emerald-800 text-white px-6 py-3.5 rounded-xl text-xs font-black uppercase tracking-wider hover:bg-emerald-900 transition-all shadow-sm flex items-center gap-2 whitespace-nowrap hidden sm:flex"
          >
            <Phone className="w-3.5 h-3.5" /> Cotar Agora
          </a>

          <button onClick={() => setMenuAberto(!menuAberto)} className="lg:hidden p-2 text-zinc-700 hover:text-emerald-800 transition-colors focus:outline-none">
            {menuAberto ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* MOBILE PANEL */}
      {menuAberto && (
        <div className="lg:hidden bg-white border-t border-stone-100 px-6 py-6 space-y-4 shadow-inner">
          <nav className="flex flex-col gap-4">
            {(config?.menu || []).map((link: any) => (
              <a key={link.id} href={link.href} onClick={() => setMenuAberto(false)} className="text-base font-bold text-zinc-700 hover:text-emerald-900">
                {link.label}
              </a>
            ))}
          </nav>
          <div className="pt-4 border-t border-stone-100 flex flex-col gap-4">
            <div className="flex gap-4 justify-center py-2">
              <a href="https://instagram.com/arkeucalipto" target="_blank" rel="noopener noreferrer" className="text-zinc-500">Instagram</a>
              <a href="https://facebook.com/arkeucalipto" target="_blank" rel="noopener noreferrer" className="text-zinc-500">Facebook</a>
            </div>
            <a href={`https://wa.me/${whatsappLimpo}?text=Olá!%20Gostaria%20de%20solicitar%20um%20orçamento.`} target="_blank" rel="noopener noreferrer" className="bg-emerald-800 text-white text-center py-4 rounded-xl text-sm font-black uppercase tracking-wider flex items-center justify-center gap-2">
              <Phone className="w-4 h-4" /> Cotar Agora
            </a>
          </div>
        </div>
      )}
    </header>
  );
}