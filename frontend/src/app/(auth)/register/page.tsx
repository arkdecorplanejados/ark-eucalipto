'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function RegisterPage() {
  const router = useRouter();

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
      const resposta = await fetch('http://localhost:3001/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nome,
          email,
          senha
        }),
      });

      // 🚀 Captura o texto bruto primeiro para evitar quebras se o servidor responder HTML
      const textoBruto = await resposta.text();
      let dados: any = {};

      try {
        dados = JSON.parse(textoBruto);
      } catch (e) {
        // Se não for JSON, o servidor provavelmente enviou um erro HTML bruto
        if (textoBruto.startsWith('<!DOCTYPE')) {
          throw new Error(`Erro (${resposta.status}): Rota inválida ou indisponível no servidor.`);
        }
        throw new Error(textoBruto || 'Resposta inesperada do servidor.');
      }

      if (!resposta.ok) {
        throw new Error(dados.message || 'Erro ao cadastrar administrador.');
      }

      setSucesso(true);

      setTimeout(() => {
        router.push('/login');
      }, 2000);

    } catch (err: any) {
      setErro(err.message || 'Não foi possível conectar ao servidor.');
    } finally {
      setCarregando(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-50 px-4">
      <div className="max-w-md w-full bg-white border border-zinc-200 rounded-2xl p-8 shadow-sm">
        
        <div className="text-center mb-8">
          <h2 className="text-2xl font-serif font-bold text-zinc-900 tracking-tight">
            Criar Administrator
          </h2>
          <p className="text-sm text-zinc-500 mt-2">
            Cadastre o usuário mestre do sistema Ark
          </p>
        </div>

        {erro && (
          <div className="mb-4 bg-rose-50 border border-rose-100 text-rose-700 text-sm p-4 rounded-xl font-medium whitespace-pre-line">
            ⚠️ {erro}
          </div>
        )}

        {sucesso && (
          <div className="mb-4 bg-emerald-50 border border-emerald-100 text-emerald-700 text-sm p-4 rounded-xl font-medium">
            ✅ Administrador criado com sucesso! Redirecionando...
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-5">
          <div>
            <label className="block text-xs font-semibold text-zinc-600 uppercase tracking-wider mb-2">
              Nome Completo
            </label>
            <input
              type="text"
              required
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              placeholder="Fabiano Rocha"
              className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3.5 text-sm text-zinc-900 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-600 uppercase tracking-wider mb-2">
              E-mail de Acesso
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@ark.com"
              className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3.5 text-sm text-zinc-900 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-600 uppercase tracking-wider mb-2">
              Senha Segura
            </label>
            <input
              type="password"
              required
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3.5 text-sm text-zinc-900 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all"
            />
          </div>

          <button
            type="submit"
            disabled={carregando || sucesso}
            className="w-full h-12 bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 text-white font-bold text-sm rounded-xl shadow-md shadow-emerald-200 transition-all flex items-center justify-center gap-3 mt-2"
          >
            {carregando ? 'Salvando no Banco...' : 'CADASTRAR ADMINISTRADOR'}
          </button>
        </form>
      </div>
    </div>
  );
}