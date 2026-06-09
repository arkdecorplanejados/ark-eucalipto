'use client';

import { useState } from 'react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export default function RegisterPage() {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const [sucesso, setSucesso] = useState(false);
  const [carregando, setCarregando] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setErro('');
    setCarregando(true);

    try {
      const resposta = await fetch(`${API_URL}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nome, email, senha }),
      });

      const textoBruto = await resposta.text();
      let dados: any = {};

      try {
        dados = JSON.parse(textoBruto);
      } catch (e) {
        if (textoBruto.startsWith('<!DOCTYPE')) {
          throw new Error(`Erro (${resposta.status}): Rota inválida.`);
        }
        throw new Error(textoBruto || 'Resposta inesperada do servidor.');
      }

      if (!resposta.ok) {
        throw new Error(dados.message || 'Erro ao cadastrar administrador.');
      }

      setSucesso(true);

      setTimeout(() => {
        setNome('');
        setEmail('');
        setSenha('');
        setSucesso(false);
      }, 3000);

    } catch (err: any) {
      setErro(err.message || 'Não foi possível conectar ao servidor.');
    } finally {
      setCarregando(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto my-6 bg-white border border-zinc-150 rounded-2xl shadow-sm overflow-hidden grid grid-cols-1 md:grid-cols-12 min-h-[580px] animate-fadeIn">
      
      {/* PAINEL ESQUERDO: ASSINATURA VISUAL CONCEITUAL */}
      <div className="md:col-span-4 bg-zinc-950 p-8 flex flex-col justify-between relative overflow-hidden border-r border-zinc-900">
        {/* Efeito de luz sutil ao fundo */}
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-zinc-900 via-transparent to-transparent opacity-50 pointer-events-none" />
        
        <div className="relative z-10">
          <span className="w-2 h-2 rounded-full bg-emerald-400 block shadow-sm shadow-emerald-400/50" />
        </div>

        <div className="relative z-10 space-y-2">
          <h2 className="text-3xl font-serif font-light text-zinc-100 tracking-tight leading-none">
            Ark <br /><span className="text-zinc-500 font-sans text-xs font-bold uppercase tracking-widest block mt-2">Segurança Central</span>
          </h2>
          <p className="text-[11px] text-zinc-400 font-medium max-w-[200px] pt-4 border-t border-zinc-900 leading-relaxed">
            Módulo restrito para expansão de credenciais e controle analítico de acessos institucionais.
          </p>
        </div>

        <div className="relative z-10">
          <p className="text-[9px] font-mono text-zinc-600 uppercase tracking-widest">
            SYSTEM v2.0 // PROTECTED
          </p>
        </div>
      </div>

      {/* PAINEL DIREITO: FORMULÁRIO MINIMALISTA DE ALTA PRECISÃO */}
      <div className="md:col-span-8 p-10 lg:p-14 flex flex-col justify-center bg-zinc-50/30">
        
        <div className="max-w-md w-full mx-auto space-y-8">
          
          <div>
            <span className="text-[10px] font-black uppercase text-emerald-700 tracking-widest bg-emerald-50 px-2.5 py-1 rounded-md">
              Acesso Restrito
            </span>
            <h3 className="text-2xl font-serif font-medium text-zinc-900 tracking-tight mt-4">
              Registrar Nova Credencial
            </h3>
          </div>

          {erro && (
            <div className="bg-rose-50 border-l-2 border-rose-500 text-rose-800 text-xs p-3.5 rounded-r-xl font-medium transition-all">
              {erro}
            </div>
          )}

          {sucesso && (
            <div className="bg-emerald-50 border-l-2 border-emerald-500 text-emerald-950 text-xs p-3.5 rounded-r-xl font-medium transition-all">
              Administrador autenticado e salvo com sucesso no ecossistema.
            </div>
          )}

          <form onSubmit={handleRegister} className="space-y-6">
            
            {/* CAMPO 1 */}
            <div className="space-y-1.5 group">
              <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-widest group-focus-within:text-zinc-950 transition-colors">
                Nome do Integrante
              </label>
              <input
                type="text"
                required
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                placeholder="Ex: Fabiano Souza"
                className="w-full bg-white border border-zinc-200 rounded-xl px-4 py-3 text-xs text-zinc-900 placeholder-zinc-300 transition-all focus:outline-none focus:border-zinc-950 focus:ring-4 focus:ring-zinc-950/5 font-medium"
              />
            </div>

            {/* CAMPO 2 */}
            <div className="space-y-1.5 group">
              <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-widest group-focus-within:text-zinc-950 transition-colors">
                E-mail de Autenticação
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="nome@arkdecor.com.br"
                className="w-full bg-white border border-zinc-200 rounded-xl px-4 py-3 text-xs text-zinc-900 placeholder-zinc-300 transition-all focus:outline-none focus:border-zinc-950 focus:ring-4 focus:ring-zinc-950/5 font-medium"
              />
            </div>

            {/* CAMPO 3 */}
            <div className="space-y-1.5 group">
              <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-widest group-focus-within:text-zinc-950 transition-colors">
                Chave de Acesso Criptografada
              </label>
              <input
                type="password"
                required
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                placeholder="••••••••••••"
                className="w-full bg-white border border-zinc-200 rounded-xl px-4 py-3 text-xs text-zinc-900 placeholder-zinc-300 transition-all focus:outline-none focus:border-zinc-950 focus:ring-4 focus:ring-zinc-950/5 font-medium"
              />
            </div>

            {/* CONEXÃO E ENVIO */}
            <div className="pt-4 flex items-center justify-between border-t border-zinc-100">
              <span className="text-[11px] text-zinc-400 font-medium hidden sm:inline">
                Ação monitorada via Firebase Auth
              </span>
              <button
                type="submit"
                disabled={carregando || sucesso}
                className="w-full sm:w-auto min-w-[180px] h-11 bg-zinc-950 hover:bg-zinc-800 disabled:bg-zinc-300 text-white font-bold text-[11px] uppercase tracking-wider rounded-xl shadow-sm transition-all flex items-center justify-center gap-2"
              >
                {carregando ? (
                  <span className="animate-pulse">Sincronizando pátio...</span>
                ) : (
                  'Criar Nova Conta'
                )}
              </button>
            </div>

          </form>
        </div>

      </div>
    </div>
  );
}