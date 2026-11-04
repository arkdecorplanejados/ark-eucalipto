'use client';

import { useState, useMemo } from 'react';
import { Calculator, CheckCircle2, Send, Ruler, Layers, Sparkles } from 'lucide-react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

type TipoProjeto = 'cerca' | 'pergolado' | 'telhado' | 'curral';

interface CalculadoraProps {
  whatsappLimpo?: string;
}

export default function CalculadoraMadeira({ whatsappLimpo = '5577999999999' }: CalculadoraProps) {
  const [tipo, setTipo] = useState<TipoProjeto>('cerca');

  // Parâmetros de Cerca / Curral
  const [metrosLineares, setMetrosLineares] = useState<number>(100);
  const [espacamento, setEspacamento] = useState<number>(2.5);
  const [fiosArame, setFiosArame] = useState<number>(5);

  // Parâmetros de Pergolado / Telhado
  const [largura, setLargura] = useState<number>(4);
  const [comprimento, setComprimento] = useState<number>(6);

  // Dados de captura do Lead
  const [nome, setNome] = useState('');
  const [telefone, setTelefone] = useState('');
  const [cidade, setCidade] = useState('');
  const [enviando, setEnviando] = useState(false);
  const [enviado, setEnviado] = useState(false);

  // 🧮 Motor de cálculo técnico por finalidade
  const resultado = useMemo(() => {
    if (tipo === 'cerca') {
      // Esticadores (mourões mais grossos) a cada 25m + pontas
      const esticadores = Math.max(2, Math.ceil(metrosLineares / 25) + 1);
      const totalPostes = Math.ceil(metrosLineares / espacamento) + 1;
      const mouroesIntermediarios = Math.max(0, totalPostes - esticadores);
      const escoras = esticadores * 2;
      const arameMetros = metrosLineares * fiosArame;
      const rolosArame500m = Math.ceil(arameMetros / 500);

      return {
        titulo: `Cerca Rural (${metrosLineares}m lineares)`,
        itens: [
          { nome: 'Mourões Intermediários (8 a 10cm x 2,20m)', qtd: `${mouroesIntermediarios} un` },
          { nome: 'Mourões Esticadores / Canto (14 a 16cm x 2,50m)', qtd: `${esticadores} un` },
          { nome: 'Escoras / Travesseiros (8 a 10cm x 2,20m)', qtd: `${escoras} un` },
          { nome: `Arame (${fiosArame} fios = ${arameMetros}m totais)`, qtd: `${rolosArame500m} rolo(s) de 500m` },
        ],
      };
    }

    if (tipo === 'curral') {
      // Mourões de curral a cada 2m + réguas horizontais ou cordoalha
      const mouroesCurral = Math.ceil(metrosLineares / 2) + 1;
      const mouraoPorteira = 4;
      const lanceTraves = Math.ceil(metrosLineares / 4) * 5;

      return {
        titulo: `Curral de Manejo (${metrosLineares}m de perímetro)`,
        itens: [
          { nome: 'Palanques Principais (16 a 20cm x 3,00m)', qtd: `${mouroesCurral} un` },
          { nome: 'Mourões de Porteira / Embarcador (20 a 24cm x 3,50m)', qtd: `${mouraoPorteira} un` },
          { nome: 'Traves / Réguas de Fechamento (8 a 10cm x 4,00m)', qtd: `${lanceTraves} un` },
        ],
      };
    }

    if (tipo === 'pergolado') {
      const area = largura * comprimento;
      const colunas = largura > 4 || comprimento > 5 ? 6 : 4;
      const vigasPrincipais = colunas === 6 ? 3 : 2;
      // Caibros de cobertura a cada 50cm
      const caibros = Math.ceil(comprimento / 0.5) + 1;

      return {
        titulo: `Pergolado (${largura}m x ${comprimento}m = ${area}m²)`,
        itens: [
          { nome: 'Colunas de Sustentação (14 a 16cm x 3,00m)', qtd: `${colunas} un` },
          { nome: `Vigas Mestras (14 a 16cm x ${comprimento}m)`, qtd: `${vigasPrincipais} un` },
          { nome: `Caibros / Pérgolas (8 a 10cm x ${largura}m)`, qtd: `${caibros} un` },
        ],
      };
    }

    // Telhado / Galpão
    const areaTelhado = largura * comprimento;
    const tesouras = Math.ceil(comprimento / 3) + 1;
    const caibrosTelhado = Math.ceil(comprimento / 0.6) * 2;
    const ripasMetros = Math.ceil(areaTelhado * 3.2);

    return {
      titulo: `Madeiramento de Telhado / Galpão (${largura}m x ${comprimento}m = ${areaTelhado}m²)`,
      itens: [
        { nome: `Vigas / Linhas Principais (14 a 16cm x ${largura}m)`, qtd: `${tesouras} un` },
        { nome: 'Pontaletes / Escoras de Tesoura (10 a 12cm x 3,00m)', qtd: `${tesouras * 2} un` },
        { nome: `Caibros de Eucalipto (6 a 8cm x ${Math.ceil(largura / 2) + 1}m)`, qtd: `${caibrosTelhado} un` },
        { nome: 'Ripamento estimado (metros lineares)', qtd: `${ripasMetros}m lineares` },
      ],
    };
  }, [tipo, metrosLineares, espacamento, fiosArame, largura, comprimento]);

  // 📡 Registra o Lead na API (para alimentar o Dashboard) e redireciona para o WhatsApp
  const handleSolicitarOrcamento = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nome || !telefone) return;

    setEnviando(true);
    const resumoItens = resultado.itens.map((i) => `${i.qtd} de ${i.nome}`).join(' | ');

    try {
      await fetch(`${API_URL}/api/leads`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nome,
          telefone,
          whatsapp: telefone,
          cidade: cidade || 'Não informada',
          interesse: `${resultado.titulo} — ${resumoItens}`,
          produto: resultado.titulo,
          status: 'Novo (Calculadora)',
          criadoEm: new Date().toISOString(),
        }),
      });
    } catch (err) {
      console.error('Aviso: lead enviado direto ao WhatsApp:', err);
    } finally {
      setEnviando(false);
      setEnviado(true);
    }

    // Monta a mensagem formatada para o WhatsApp da Ark Eucalipto
    const listaFormatada = resultado.itens.map((i) => `• *${i.qtd}* - ${i.nome}`).join('\n');
    const textoWhats =
      `Olá! Fiz uma simulação na *Calculadora da Ark Eucalipto* e gostaria de cotar:\n\n` +
      `*Projeto:* ${resultado.titulo}\n` +
      `*Cliente:* ${nome} (${cidade || 'Região'})\n\n` +
      `*Quantitativo Estimado:*\n${listaFormatada}\n\n` +
      `Podem me passar os valores e disponibilidade de entrega?`;

    const urlWhats = `https://wa.me/${whatsappLimpo}?text=${encodeURIComponent(textoWhats)}`;
    window.open(urlWhats, '_blank');
  };

  return (
    <section id="calculadora" className="py-16 bg-stone-100 border-y border-stone-200">
      <div className="max-w-7xl mx-auto px-6">
        {/* Cabeçalho da Seção */}
        <div className="max-w-2xl mb-10">
          <span className="inline-flex items-center gap-1.5 bg-emerald-900/10 text-emerald-900 text-xs font-black uppercase tracking-widest px-3 py-1 rounded-full">
            <Calculator className="w-3.5 h-3.5" /> Simulador Técnico Instantâneo
          </span>
          <h2 className="text-3xl md:text-4xl font-serif font-black text-zinc-900 mt-3 tracking-tight">
            Calculadora de Eucalipto & Cerca
          </h2>
          <p className="text-sm text-zinc-600 mt-2">
            Descubra em segundos a quantidade exata de mourões, esticadores, vigas e caibros para a sua obra ou propriedade rural.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* COLUNA ESQUERDA: Parâmetros da Obra (7 Colunas) */}
          <div className="lg:col-span-7 bg-white p-6 md:p-8 rounded-2xl border border-stone-200 shadow-sm space-y-6">
            {/* 1. Seleção da Finalidade */}
            <div>
              <label className="block text-xs font-black uppercase tracking-wider text-zinc-500 mb-3">
                1. O que você vai construir?
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {[
                  { id: 'cerca', label: '🌾 Cerca Rural' },
                  { id: 'curral', label: '🐂 Curral' },
                  { id: 'pergolado', label: '🏡 Pergolado' },
                  { id: 'telhado', label: '🏗️ Telhado / Galpão' },
                ].map((aba) => (
                  <button
                    key={aba.id}
                    type="button"
                    onClick={() => setTipo(aba.id as TipoProjeto)}
                    className={`py-3 px-3 rounded-xl text-xs font-black uppercase tracking-wider border transition-all ${
                      tipo === aba.id
                        ? 'bg-emerald-800 text-white border-emerald-800 shadow-sm'
                        : 'bg-stone-50 text-zinc-600 border-stone-200 hover:bg-stone-100'
                    }`}
                  >
                    {aba.label}
                  </button>
                ))}
              </div>
            </div>

            {/* 2. Inputs Dinâmicos conforme a Finalidade */}
            {tipo === 'cerca' || tipo === 'curral' ? (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                <div className={tipo === 'curral' ? 'sm:col-span-3' : ''}>
                  <label className="block text-xs font-bold text-zinc-700 mb-1.5 flex items-center gap-1">
                    <Ruler className="w-3.5 h-3.5 text-emerald-700" />
                    Extensão Total (Metros Lineares)
                  </label>
                  <input
                    type="number"
                    min={10}
                    max={50000}
                    value={metrosLineares}
                    onChange={(e) => setMetrosLineares(Math.max(1, Number(e.target.value)))}
                    className="w-full px-4 py-3 border border-stone-300 rounded-xl text-base font-bold text-zinc-900 focus:outline-none focus:ring-2 focus:ring-emerald-700"
                  />
                </div>

                {tipo === 'cerca' && (
                  <>
                    <div>
                      <label className="block text-xs font-bold text-zinc-700 mb-1.5">
                        Espaçamento entre Mourões
                      </label>
                      <select
                        value={espacamento}
                        onChange={(e) => setEspacamento(Number(e.target.value))}
                        className="w-full px-3 py-3 border border-stone-300 rounded-xl text-sm font-bold text-zinc-900 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-700"
                      >
                        <option value={2}>A cada 2,0 metros (Reforçada)</option>
                        <option value={2.5}>A cada 2,5 metros (Padrão)</option>
                        <option value={3}>A cada 3,0 metros (Econômica)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-zinc-700 mb-1.5">
                        Quantidade de Fios de Arame
                      </label>
                      <select
                        value={fiosArame}
                        onChange={(e) => setFiosArame(Number(e.target.value))}
                        className="w-full px-3 py-3 border border-stone-300 rounded-xl text-sm font-bold text-zinc-900 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-700"
                      >
                        <option value={4}>4 Fios</option>
                        <option value={5}>5 Fios (Padrão Gado)</option>
                        <option value={6}>6 Fios (Divisa / Criação)</option>
                        <option value={8}>8 Fios (Alta Contenção)</option>
                      </select>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div>
                  <label className="block text-xs font-bold text-zinc-700 mb-1.5 flex items-center gap-1">
                    <Ruler className="w-3.5 h-3.5 text-emerald-700" />
                    Largura / Vão (Metros)
                  </label>
                  <input
                    type="number"
                    min={2}
                    max={100}
                    value={largura}
                    onChange={(e) => setLargura(Math.max(1, Number(e.target.value)))}
                    className="w-full px-4 py-3 border border-stone-300 rounded-xl text-base font-bold text-zinc-900 focus:outline-none focus:ring-2 focus:ring-emerald-700"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-zinc-700 mb-1.5 flex items-center gap-1">
                    <Layers className="w-3.5 h-3.5 text-emerald-700" />
                    Comprimento / Profundidade (Metros)
                  </label>
                  <input
                    type="number"
                    min={2}
                    max={200}
                    value={comprimento}
                    onChange={(e) => setComprimento(Math.max(1, Number(e.target.value)))}
                    className="w-full px-4 py-3 border border-stone-300 rounded-xl text-base font-bold text-zinc-900 focus:outline-none focus:ring-2 focus:ring-emerald-700"
                  />
                </div>
              </div>
            )}

            {/* 3. Lista Técnica Gerada Instantaneamente */}
            <div className="bg-emerald-950 text-white p-6 rounded-2xl space-y-4">
              <div className="flex items-center justify-between border-b border-emerald-800/60 pb-3">
                <div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400">
                    Dimensionamento Sugerido
                  </span>
                  <h3 className="text-lg font-serif font-bold text-white">{resultado.titulo}</h3>
                </div>
                <Sparkles className="w-5 h-5 text-emerald-400" />
              </div>

              <div className="space-y-2.5">
                {resultado.itens.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between bg-emerald-900/50 px-4 py-2.5 rounded-xl border border-emerald-800/50 text-sm"
                  >
                    <span className="text-emerald-100 font-medium">{item.nome}</span>
                    <span className="font-black text-emerald-300 whitespace-nowrap ml-3">{item.qtd}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* COLUNA DIREITA: Formulário de Cotação Expressa (5 Colunas) */}
          <div className="lg:col-span-5 bg-white p-6 md:p-8 rounded-2xl border border-stone-200 shadow-sm">
            <h3 className="text-xl font-serif font-black text-zinc-900">
              Receber Preço desta Lista no WhatsApp
            </h3>
            <p className="text-xs text-zinc-500 mt-1 mb-6">
              Envie os seus dados abaixo para receber o orçamento completo com cálculo de frete direto da nossa equipe.
            </p>

            <form onSubmit={handleSolicitarOrcamento} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-zinc-700 mb-1">Seu Nome ou Fazenda/Empresa *</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: João Silva / Fazenda Boa Vista"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  className="w-full px-4 py-3 border border-stone-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-700"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-700 mb-1">Seu WhatsApp com DDD *</label>
                <input
                  type="tel"
                  required
                  placeholder="Ex: (77) 99999-9999"
                  value={telefone}
                  onChange={(e) => setTelefone(e.target.value)}
                  className="w-full px-4 py-3 border border-stone-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-700"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-700 mb-1">Cidade / Região de Entrega</label>
                <input
                  type="text"
                  placeholder="Ex: Vitória da Conquista - BA"
                  value={cidade}
                  onChange={(e) => setCidade(e.target.value)}
                  className="w-full px-4 py-3 border border-stone-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-700"
                />
              </div>

              <button
                type="submit"
                disabled={enviando}
                className="w-full bg-emerald-800 hover:bg-emerald-900 text-white font-black text-xs uppercase tracking-wider py-4 rounded-xl shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <Send className="w-4 h-4" />
                {enviando ? 'Processando...' : 'Cotar Esta Lista no WhatsApp'}
              </button>

              {enviado && (
                <div className="flex items-center gap-2 text-emerald-800 bg-emerald-50 p-3 rounded-xl text-xs font-bold">
                  <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                  Simulação registrada! Abrindo o WhatsApp com o seu pedido...
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}