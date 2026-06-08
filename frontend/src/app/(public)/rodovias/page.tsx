'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

// 🌳 Tipagem para manter o projeto limpo e evitar o uso de 'any'
interface Produto {
  id: string;
  nome: string;
  categoria: string;
  visivel: boolean;
}

interface ConfigSite {
  whatsapp?: string;
  produtosVitrine?: Produto[];
}

export default function RodoviasPage() {
  const [config, setConfig] = useState<ConfigSite | null>(null);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    // 🚀 Otimização: Usa a variável do .env ou assume o localhost como fallback de desenvolvimento
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
    
    fetch(`${apiUrl}/api/site/config`)
      .then(res => res.json())
      .then(data => {
        setConfig(data);
        setCarregando(false);
      })
      .catch(err => {
        console.error("Erro ao carregar configurações de infraestrutura:", err);
        setCarregando(false);
      });
  }, []);

  if (carregando) {
    return (
      <div className="p-10 text-center font-bold text-emerald-800 bg-stone-50 min-h-screen flex items-center justify-center">
        Carregando Soluções Industriais...
      </div>
    );
  }

  // 🚀 FILTRO SELETIVO: Filtra apenas produtos voltados para engenharia pesada e rodovias
  const produtosInfra = (config?.produtosVitrine || []).filter(
    (p) => p.categoria === 'infraestrutura' && p.visivel
  );

  const whatsappLimpo = config?.whatsapp ? config.whatsapp.replace(/\D/g, '') : '77999999999';

  return (
    <div className="min-h-screen bg-stone-50 text-zinc-800 py-16 px-6">
      <div className="max-w-5xl mx-auto space-y-12">
        
        {/* Header de Autoridade Corporativa */}
        <div className="space-y-4 text-center md:text-left">
          <Link href="/" className="text-xs font-bold text-emerald-800 hover:underline inline-flex items-center gap-1">
            ← Voltar para o Site Comercial
          </Link>
          <h1 className="text-4xl md:text-5xl font-serif font-black text-zinc-950 tracking-tight leading-tight">
            Atendimento a Construtoras e Obras Viárias
          </h1>
          <p className="text-zinc-600 max-w-3xl text-sm md:text-base leading-relaxed">
            Fornecemos estacas de contenção, escoramentos pesados, pontaletes e pilares de eucalipto in natura de alta densidade para engenharia civil. Atendendo Vitória da Conquista e eixos logísticos da Bahia com faturamento direto do produtor, emissão de Nota Fiscal e total conformidade ambiental através do Documento de Origem Florestal (DOF).
          </p>
        </div>

        {/* Diferenciais B2B */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-white p-8 rounded-3xl border border-stone-200/60 shadow-sm">
          <div className="space-y-1">
            <h4 className="font-bold text-zinc-900 text-sm flex items-center gap-2">🚛 Cargas Fechadas</h4>
            <p className="text-xs text-zinc-500 leading-relaxed">Logística pesada e pátio centralizado para entrega contínua em frentes de obra rodoviárias.</p>
          </div>
          <div className="space-y-1">
            <h4 className="font-bold text-zinc-900 text-sm flex items-center gap-2">📜 Rigor Ambiental</h4>
            <p className="text-xs text-zinc-500 leading-relaxed">Segurança jurídica total para construtoras. Todo o volume transportado acompanha o selo do DOF.</p>
          </div>
          <div className="space-y-1">
            <h4 className="font-bold text-zinc-900 text-sm flex items-center gap-2">🏗️ Alta Densidade Mecânica</h4>
            <p className="text-xs text-zinc-500 leading-relaxed">Madeira bruta selecionada na fonte com excelente rigidez mecânica natural, ideal para suportar cargas estruturais.</p>
          </div>
        </div>

        {/* Produtos Específicos de Infraestrutura */}
        <div className="space-y-6">
          <h2 className="text-xl font-serif font-black text-zinc-900 tracking-tight">
            Peças Selecionadas para Engenharia e Infraestrutura
          </h2>
          
          {produtosInfra.length === 0 ? (
            <p className="text-sm text-zinc-400 bg-white p-8 rounded-2xl border border-dashed border-stone-200 text-center">
              Nenhum produto da categoria "infraestrutura" está visível no momento. Ative-os no painel admin.
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {produtosInfra.map((prod) => (
                <div key={prod.id} className="bg-white p-6 rounded-2xl border border-stone-200/60 flex justify-between items-center shadow-sm hover:shadow-md transition-shadow">
                  <div className="space-y-1">
                    <h3 className="font-bold text-zinc-900 text-base">{prod.nome}</h3>
                    <span className="text-[10px] uppercase tracking-wider text-emerald-700 font-bold bg-emerald-50 px-2.5 py-0.5 rounded-md border border-emerald-100">
                      Especificação Bruta
                    </span>
                  </div>
                  <a
                    href={`https://wa.me/${whatsappLimpo}?text=Olá!%20Solicito%20cotação%20corporativa%20B2B%20para%20a%20obra%20viária:%20${encodeURIComponent(prod.nome)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-emerald-800 text-white text-xs font-bold px-5 py-2.5 rounded-xl hover:bg-emerald-900 transition-colors shadow-sm whitespace-nowrap"
                  >
                    Faturamento PJ
                  </a>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}