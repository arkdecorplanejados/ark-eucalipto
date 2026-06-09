'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [autorizado, setAutorizado] = useState(false);
  const [sidebarAberta, setSidebarAberta] = useState(true);
  const [usuario, setUsuario] = useState<{ nome: string; email: string } | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('ark_token');
    const userString = localStorage.getItem('ark_user');

    if (!token) {
      router.push('/login');
    } else {
      setAutorizado(true);
      if (userString) {
        setUsuario(JSON.parse(userString));
      }
    }
  }, [router]);

  // 🟢 FUNÇÃO DE SAÍDA SEGURA: Limpa apenas a sessão do administrador
  const handleSairDoSistema = () => {
    localStorage.removeItem('ark_token');
    localStorage.removeItem('ark_user');
    localStorage.removeItem('ark_session');
    localStorage.removeItem('firebase:authUser'); // Proteção para sessões locais do Firebase
    
    router.push('/login');
  };

  if (!autorizado) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center font-medium text-emerald-800">
        Verificando credenciais...
      </div>
    );
  }

  // 🟢 MENUS ATUALIZADOS: Adicionado o link seguro para cadastrar administradores
  const menuItens = [
    {
      nome: 'Painel Geral',
      href: '/dashboard',
      icone: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 3.055A9.003 9.003 0 1020.945 13H11V3.055z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
        </svg>
      ),
    },
    {
      nome: 'Gerenciar Leads',
      href: '/dashboard/leads',
      icone: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
    },
    {
      nome: 'Madeiras e Estoque',
      href: '/dashboard/produtos',
      icone: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
      ),
    },
    {
      nome: 'Gerenciar Site',
      href: '/dashboard/site',
      icone: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
        </svg>
      ),
    },
    {
      nome: 'Cadastrar Admin',
      href: '/dashboard/register',
      icone: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
        </svg>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-stone-50 flex text-zinc-800 transition-all duration-300">
      
      {/* SIDEBAR */}
      <aside 
        className={`bg-emerald-950 text-emerald-300 flex flex-col justify-between fixed h-full border-r border-emerald-900/40 z-20 transition-all duration-300 ${
          sidebarAberta ? 'w-64' : 'w-20'
        }`}
      >
        <div>
          <div className="h-16 flex items-center border-b border-emerald-900/60 px-5 gap-3 overflow-hidden whitespace-nowrap">
            <span className="w-3.5 h-3.5 rounded-full bg-emerald-400 shadow-md shadow-emerald-400/50 flex-shrink-0" />
            {sidebarAberta && (
              <span className="font-serif font-bold text-white tracking-wide text-lg transition-opacity duration-300">
                Ark Eucalipto
              </span>
            )}
          </div>

          <nav className="p-3 space-y-2">
            {menuItens.map((item) => {
              const ativo = pathname === item.href;
              return (
                <a
                  key={item.href}
                  href={item.href}
                  title={!sidebarAberta ? item.nome : ''}
                  className={`flex items-center gap-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 group ${
                    sidebarAberta ? 'px-4' : 'justify-center px-0 mx-2'
                  } ${
                    ativo 
                      ? 'bg-emerald-800 text-white shadow-md shadow-emerald-900/50' 
                      : 'hover:bg-emerald-900/50 hover:text-emerald-100'
                  }`}
                >
                  <span className={`${ativo ? 'text-emerald-300' : 'text-emerald-500 group-hover:text-emerald-400'}`}>
                    {item.icone}
                  </span>
                  
                  {sidebarAberta && (
                    <span className="truncate transition-opacity duration-300">
                      {item.nome}
                    </span>
                  )}
                </a>
              );
            })}
          </nav>
        </div>

        <div className="p-4 border-t border-emerald-900/60 bg-emerald-950/80 overflow-hidden whitespace-nowrap">
          <div className={`flex flex-col ${sidebarAberta ? 'px-2' : 'items-center px-0'}`}>
            {sidebarAberta ? (
              <>
                <p className="text-xs font-semibold text-emerald-100 truncate">
                  {usuario?.nome || 'Administrador'}
                </p>
                <p className="text-[11px] text-emerald-500 truncate mt-0.5">
                  {usuario?.email || 'admin@ark.com'}
                </p>
              </>
            ) : (
              <div className="w-8 h-8 rounded-full bg-emerald-900 flex items-center justify-center font-bold text-xs text-emerald-300 uppercase">
                {(usuario?.nome || 'A').charAt(0)}
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* ÁREA DO CONTEÚDO PRINCIPAL */}
      <div 
        className={`flex-1 flex flex-col transition-all duration-300 ${
          sidebarAberta ? 'pl-64' : 'pl-20'
        }`}
      >
        {/* NAVBAR SUPERIOR */}
        <header className="h-16 bg-white border-b border-stone-200 flex items-center justify-between px-6 sticky top-0 z-10 shadow-sm shadow-stone-100/40">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarAberta(!sidebarAberta)}
              className="p-2 rounded-xl text-emerald-950 hover:bg-emerald-50 active:scale-95 border border-stone-200 hover:border-emerald-100 transition-all duration-200"
              aria-label="Alternar Menu"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {sidebarAberta ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h10M4 18h16" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
            <div className="text-xs text-stone-400 font-medium hidden sm:block">
              Vitória da Conquista - BA
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button 
              type="button"
              onClick={handleSairDoSistema}
              className="text-xs font-bold text-emerald-800 hover:text-white border border-emerald-200 hover:bg-emerald-600 px-4 py-2 rounded-xl transition-all duration-200"
            >
              Sair do Sistema
            </button>
          </div>
        </header>

        {/* CONTEÚDO INTERNO */}
        <main className="p-6 md:p-8 flex-1 animate-fadeIn">
          {children}
        </main>
      </div>
    </div>
  );
}