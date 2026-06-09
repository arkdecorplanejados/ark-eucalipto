'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [erro, setErro] = useState('');
  const [carregando, setCarregando] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErro('');
    setCarregando(true);

    try {
      // 🟢 CORREÇÃO: Lê a variável de ambiente da Vercel (Render) ou usa o localhost se estiver testando nativo
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
      
      const resposta = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, senha }),
      });

      // Captura o texto bruto primeiro para evitar quebras silenciosas no Next.js
      const textoBruto = await resposta.text();
      let dados: any = {};

      try {
        dados = JSON.parse(textoBruto);
      } catch (e) {
        if (textoBruto.startsWith('<!DOCTYPE')) {
          throw new Error(`Erro (${resposta.status}): Rota de login inválida ou inacessível no servidor.`);
        }
        throw new Error(textoBruto || 'Resposta inesperada do servidor.');
      }

      if (!resposta.ok) {
        throw new Error(dados.message || 'E-mail ou senha incorretos.');
      }

      // 1. Salva o token customizado retornado pelo seu Firebase Admin
      localStorage.setItem('ark_token', dados.token);
      
      // 2. Salva os dados do usuário administrador logado
      if (dados.usuario) {
        localStorage.setItem('ark_user', JSON.stringify(dados.usuario));
      }

      // 3. Redireciona o administrador para o painel principal
      router.push('/dashboard');

    } catch (err: any) {
      setErro(err.message || 'Não foi possível conectar ao servidor.');
    } finally {
      setCarregando(false);
    }
  };

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-12 bg-zinc-50">
      
      {/* COLUNA DA ESQUERDA: Formulário */}
      <div className="flex flex-col justify-between p-8 sm:p-12 lg:col-span-5 bg-white shadow-xl z-10">
        
        <div>
          <a href="/" className="inline-flex items-center gap-2 text-xs font-medium text-zinc-400 hover:text-emerald-600 transition-colors group">
            <span className="group-hover:-translate-x-1 transition-transform">←</span> Voltar para o site público
          </a>
        </div>

        <div className="w-full max-w-sm mx-auto my-auto">
          <div className="mb-8 text-center lg:text-left">
            <h2 className="text-3xl font-serif font-bold text-zinc-900 tracking-tight">
              Acesso Restrito
            </h2>
            <p className="text-sm text-zinc-500 mt-2">
              Olá! Identifique-se para entrar no sistema.
            </p>
          </div>

          {erro && (
            <div className="mb-6 bg-rose-50 border border-rose-100 text-rose-700 text-sm p-4 rounded-xl font-medium flex items-start gap-3">
              <span>⚠️</span>
              <div>{erro}</div>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            {/* Campo de E-mail */}
            <div>
              <label className="block text-xs font-semibold text-zinc-600 uppercase tracking-wider mb-2">
                E-mail Corporativo
              </label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.206" />
                  </svg>
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@ark.com"
                  className="w-full bg-zinc-50 border border-zinc-200 rounded-xl pl-12 pr-4 py-3.5 text-sm text-zinc-900 placeholder-zinc-400 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all"
                />
              </div>
            </div>

            {/* Campo de Senha */}
            <div>
              <label className="block text-xs font-semibold text-zinc-600 uppercase tracking-wider mb-2">
                Senha de Acesso
              </label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400">
                  <svg xmlns="http://www.w3.org/2000/xl" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 00-2 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <input
                  type={mostrarSenha ? 'text' : 'password'}
                  required
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-zinc-50 border border-zinc-200 rounded-xl pl-12 pr-12 py-3.5 text-sm text-zinc-900 placeholder-zinc-400 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setMostrarSenha(!mostrarSenha)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-emerald-600 text-xs font-semibold"
                >
                  {mostrarSenha ? 'Ocultar' : 'Mostrar'}
                </button>
              </div>
            </div>

            {/* Botão de Entrar */}
            <button
              type="submit"
              disabled={carregando}
              className="w-full h-12 bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 text-white font-bold text-sm rounded-xl shadow-md shadow-emerald-200 transition-all flex items-center justify-center gap-3 mt-2"
            >
              {carregando ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Processando...
                </>
              ) : (
                'ENTRAR NO SISTEMA'
              )}
            </button>
          </form>
        </div>

        <div className="text-xs text-zinc-400 text-center lg:text-left">
          &copy; {new Date().getFullYear()} Ark Eucalipto Admin.
        </div>
      </div>

      {/* COLUNA DA DIREITA: Banner */}
      <div className="hidden lg:flex lg:col-span-7 bg-zinc-950 flex-col justify-between p-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(16,185,129,0.1),transparent_50%)]" />
        
        <div className="relative z-10">
          <span className="text-emerald-500 text-xs font-bold tracking-widest uppercase bg-emerald-950/50 border border-emerald-900/50 px-3 py-1 rounded-full">
            Portal Administrativo
          </span>
        </div>

        <div className="max-w-xl relative z-10">
          <h1 className="text-4xl xl:text-5xl font-serif font-bold text-white leading-tight">
            Madeira de qualidade, gestão de excelência.
          </h1>
          <p className="mt-4 text-zinc-400 leading-relaxed text-sm xl:text-base">
            O painel administrativo Ark permite que você gerencie orçamentos, produtos e configurações de forma rápida e segura.
          </p>
        </div>

        <div className="flex items-center gap-6 relative z-10 text-xs text-zinc-500">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            Sistemas Online
          </div>
          <span>📍 Vitória da Conquista - BA</span>
        </div>
      </div>

    </div>
  );
}