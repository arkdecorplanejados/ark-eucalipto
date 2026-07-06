'use client';

import Link from 'next/link';
import { ArrowLeft, ShieldCheck, Lock, Eye } from 'lucide-react';

export default function PoliticaPrivacidadePage() {
  const dataAtual = new Date().toLocaleDateString('pt-BR', { year: 'numeric', month: 'long' });

  return (
    <div className="min-h-screen bg-stone-50 text-zinc-800 py-16 px-6 antialiased selection:bg-emerald-50 selection:text-emerald-900">
      <div className="max-w-3xl mx-auto space-y-12">
        
        {/* Voltar */}
        <div>
          <Link 
            href="/" 
            className="text-xs font-black uppercase tracking-wider text-emerald-800 hover:text-emerald-900 inline-flex items-center gap-1 transition-colors"
          >
            ← Voltar para o Início
          </Link>
        </div>

        {/* Cabeçalho */}
        <div className="space-y-4 border-b border-stone-200 pb-8">
          <div className="flex items-center gap-3 text-emerald-800">
            <ShieldCheck className="w-8 h-8 shrink-0" />
            <h1 className="text-3xl md:text-4xl font-serif font-black text-zinc-950 tracking-tight leading-tight">
              Política de Privacidade
            </h1>
          </div>
          <p className="text-xs text-zinc-400 font-medium uppercase tracking-wider">
            Atualizado em: {dataAtual}
          </p>
        </div>

        {/* Conteúdo Institucional */}
        <div className="space-y-8 text-sm md:text-base leading-relaxed font-normal text-zinc-600">
          
          <section className="space-y-3">
            <h2 className="text-xl font-serif font-black text-zinc-900 tracking-tight flex items-center gap-2">
              <Lock className="w-4 h-4 text-emerald-700" /> 1. Compromisso com a Segurança
            </h2>
            <p>
              A Ark Eucalipto tem o compromisso de proteger a privacidade e os dados pessoais de clientes, construtoras, parceiros e visitantes do site. Esta política descreve como coletamos, armazenamos e tratamos as suas informações em total conformidade com a Lei Geral de Proteção de Dados (LGPD).
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-serif font-black text-zinc-900 tracking-tight flex items-center gap-2">
              <Eye className="w-4 h-4 text-emerald-700" /> 2. Coleta de Dados e Finalidade
            </h2>
            <p>
              Coletamos informações básicas fornecidas voluntariamente por você através dos nossos canais de atendimento ou formulários comerciais:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-xs md:text-sm">
              <li><strong>Dados de Contato:</strong> Nome, e-mail e telefone informados para cotações e faturamento PJ de cargas ou materiais do pátio.</li>
              <li><strong>Newsletter:</strong> Seu e-mail corporativo ou pessoal para envio exclusivo de tabelas de preços de eucalipto tratado e informativos de novos lotes.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-serif font-black text-zinc-900 tracking-tight flex items-center gap-2">
              🦖 3. Compartilhamento e Armazenamento
            </h2>
            <p>
              Não vendemos, trocamos ou transferimos seus dados pessoais para terceiros. Todas as informações coletadas para orçamentos ou faturamento são armazenadas em ambientes digitais seguros e protegidos, utilizadas estritamente para o alinhamento logístico e operacional de pedidos.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-serif font-black text-zinc-900 tracking-tight flex items-center gap-2">
              ⚖️ 4. Seus Direitos
            </h2>
            <p>
              Você possui o direito de, a qualquer momento, solicitar o acesso, retificação, atualização ou exclusão definitiva dos seus dados armazenados em nosso banco, bastando entrar em contato direto com a nossa equipe de atendimento técnico institucional através dos canais oficiais do site.
            </p>
          </section>

        </div>

        {/* Nota Rodapé */}
        <div className="bg-white p-6 rounded-2xl border border-stone-200/60 text-center text-xs text-zinc-400">
          Este documento foi projetado em conformidade com as diretrizes de transparência e segurança jurídica da Ark Eucalipto.
        </div>

      </div>
    </div>
  );
}