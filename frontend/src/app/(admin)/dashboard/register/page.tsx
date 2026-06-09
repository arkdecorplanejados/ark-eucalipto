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
    <div className="max-w-xl mx-auto my-12 animate-fadeIn">
      
      {/* CARD CENTRAL ELEGANTE */}
      <div className="bg-white border border-zinc-200 rounded-2xl p-10 shadow-sm">
        
        {/* CABEÇALHO SUTIL E REFINADO */}
        <div className="mb-10 text-center sm:text-left border-b border-zinc-100 pb-6">
          <h2 className="text-2xl font-serif font-medium text-zinc-950 tracking-tight">
            Novo Administrador
          </h2>
          <p className="text-xs text-zinc-400 uppercase tracking-widest mt-1.5 font-medium">
            Infraestrutura de Credenciais de Acesso
          </p>
        </div>

        {erro && (
          <div className="mb-6 bg-rose-50/60 border border-rose-100 text-rose-800 text-xs px-4 py-3 rounded-xl font-medium">
            ⚠️ {erro}
          </div>
        )}

        {sucesso && (
          <div className="mb-6 bg-emerald-50/60 border border-emerald-100 text-emerald-800 text-xs px-4 py-3 rounded-xl font-medium">
            ✅ Credenciais registradas e ativas no banco de dados.
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-6">
          
          {/* INPUT: NOME */}
          <div className="space-y-1.5">
            <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
              Nome Completo do Usuário
            </label>
            <input
              type="text"
              required
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              placeholder="Ex: Fabiano Rocha"
              className="w-full bg-white border border-zinc-200 rounded-xl px-4 py-3 text-xs text-zinc-900 placeholder-zinc-300 transition-all focus:outline-none focus:border-zinc-950 focus:ring-1 focus:ring-zinc-950"
            />
          </div>

          {/* INPUT: EMAIL */}
          <div className="space-y-1.5">
            <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
              E-mail Corporativo
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="colaborador@arkdecor.com.br"
              className="w-full bg-white border border-zinc-200 rounded-xl px-4 py-3 text-xs text-zinc-900 placeholder-zinc-300 transition-all focus:outline-none focus:border-zinc-950 focus:ring-1 focus:ring-zinc-950"
            />
          </div>

          {/* INPUT: SENHA */}
          <div className="space-y-1.5">
            <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
              Chave de Segurança Segura
            </label>
            <input
              type="password"
              required
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              placeholder="••••••••••••"
              className="w-full bg-white border border-zinc-200 rounded-xl px-4 py-3 text-xs text-zinc-900 placeholder-zinc-300 transition-all focus:outline-none focus:border-zinc-950 focus:ring-1 focus:ring-zinc-950"
            />
          </div>

          {/* BOTÃO DE ALTO NÍVEL (FUNDO ESCURO MINIMALISTA) */}
          <div className="pt-4 border-t border-zinc-100 flex justify-end">
            <button
              type="submit"
              disabled={carregando || sucesso}
              className="w-full sm:w-auto min-w-[200px] h-11 bg-zinc-950 hover:bg-zinc-800 disabled:bg-zinc-300 text-white font-bold text-[11px] uppercase tracking-wider rounded-xl shadow-sm transition-all flex items-center justify-center gap-2"
            >
              {carregando ? (
                <span className="animate-pulse">Sincronizando...</span>
              ) : (
                'Confirmar Cadastro'
              )}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}