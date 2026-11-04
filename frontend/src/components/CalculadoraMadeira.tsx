'use client';

import { useState, useMemo } from 'react';
import {
  Calculator,
  CheckCircle2,
  Ruler,
  Layers,
  Sparkles,
  FileDown,
  MessageCircle,
  RotateCcw,
  FileText,
  ShieldCheck,
} from 'lucide-react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

type TipoProjeto = 'cerca' | 'pergolado' | 'telhado' | 'curral';

interface CalculadoraProps {
  whatsappLimpo?: string;
}

export default function CalculadoraMadeira({ whatsappLimpo = '5577992365475' }: CalculadoraProps) {
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

  // Estado da Proposta Gerada
  const [protocoloGerado, setProtocoloGerado] = useState<string | null>(null);
  const [dataEmissao, setDataEmissao] = useState<string>('');

  // Garante que o número de WhatsApp sempre tenha o DDI 55 do Brasil
  const whatsappFormatado = useMemo(() => {
    const apenasDigitos = (whatsappLimpo || '').replace(/\D/g, '');
    if (!apenasDigitos) return '5577992365475';
    return apenasDigitos.startsWith('55') ? apenasDigitos : `55${apenasDigitos}`;
  }, [whatsappLimpo]);

  // 🧮 Motor de cálculo técnico por finalidade
  const resultado = useMemo(() => {
    if (tipo === 'cerca') {
      const esticadores = Math.max(2, Math.ceil(metrosLineares / 25) + 1);
      const totalPostes = Math.ceil(metrosLineares / espacamento) + 1;
      const mouroesIntermediarios = Math.max(0, totalPostes - esticadores);
      const escoras = esticadores * 2;
      const arameMetros = metrosLineares * fiosArame;
      const rolosArame500m = Math.ceil(arameMetros / 500);

      return {
        titulo: `Cerca Rural (${metrosLineares}m lineares)`,
        especificacao: `Espaçamento a cada ${espacamento}m • ${fiosArame} fios de arame`,
        itens: [
          { codigo: 'EUC-M01', nome: 'Mourões Intermediários', bitola: '8 a 10cm x 2,20m', qtd: `${mouroesIntermediarios} un` },
          { codigo: 'EUC-E02', nome: 'Mourões Esticadores / Canto', bitola: '14 a 16cm x 2,50m', qtd: `${esticadores} un` },
          { codigo: 'EUC-T03', nome: 'Escoras / Travesseiros', bitola: '8 a 10cm x 2,20m', qtd: `${escoras} un` },
          { codigo: 'ARM-500', nome: `Arame (${arameMetros}m lineares totais)`, bitola: 'Rolo 500m', qtd: `${rolosArame500m} rl` },
        ],
      };
    }

    if (tipo === 'curral') {
      const mouroesCurral = Math.ceil(metrosLineares / 2) + 1;
      const mouraoPorteira = 4;
      const lanceTraves = Math.ceil(metrosLineares / 4) * 5;

      return {
        titulo: `Curral de Manejo (${metrosLineares}m de perímetro)`,
        especificacao: 'Estrutura reforçada para contenção bovina • Palanques a cada 2,0m',
        itens: [
          { codigo: 'EUC-P01', nome: 'Palanques Principais de Curral', bitola: '16 a 20cm x 3,00m', qtd: `${mouroesCurral} un` },
          { codigo: 'EUC-P02', nome: 'Mourões de Porteira / Embarcador', bitola: '20 a 24cm x 3,50m', qtd: `${mouraoPorteira} un` },
          { codigo: 'EUC-R03', nome: 'Traves / Réguas de Fechamento', bitola: '8 a 10cm x 4,00m', qtd: `${lanceTraves} un` },
        ],
      };
    }

    if (tipo === 'pergolado') {
      const area = largura * comprimento;
      const colunas = largura > 4 || comprimento > 5 ? 6 : 4;
      const vigasPrincipais = colunas === 6 ? 3 : 2;
      const caibros = Math.ceil(comprimento / 0.5) + 1;

      return {
        titulo: `Pergolado Estrutural (${largura}m x ${comprimento}m = ${area}m²)`,
        especificacao: `Área coberta de ${area}m² • Espaçamento entre caibros de 50cm`,
        itens: [
          { codigo: 'EUC-C01', nome: 'Colunas de Sustentação', bitola: '14 a 16cm x 3,00m', qtd: `${colunas} un` },
          { codigo: 'EUC-V02', nome: 'Vigas Mestras Principais', bitola: `14 a 16cm x ${comprimento}m`, qtd: `${vigasPrincipais} un` },
          { codigo: 'EUC-B03', nome: 'Caibros / Pérgolas Superiores', bitola: `8 a 10cm x ${largura}m`, qtd: `${caibros} un` },
        ],
      };
    }

    const areaTelhado = largura * comprimento;
    const tesouras = Math.ceil(comprimento / 3) + 1;
    const caibrosTelhado = Math.ceil(comprimento / 0.6) * 2;
    const ripasMetros = Math.ceil(areaTelhado * 3.2);

    return {
      titulo: `Telhado / Galpão (${largura}m x ${comprimento}m = ${areaTelhado}m²)`,
      especificacao: `Área estrutural de ${areaTelhado}m² • Vão livre de ${largura}m`,
      itens: [
        { codigo: 'EUC-L01', nome: 'Vigas / Linhas Principais', bitola: `14 a 16cm x ${largura}m`, qtd: `${tesouras} un` },
        { codigo: 'EUC-S02', nome: 'Pontaletes / Escoras de Tesoura', bitola: '10 a 12cm x 3,00m', qtd: `${tesouras * 2} un` },
        { codigo: 'EUC-C03', nome: 'Caibros de Eucalipto', bitola: `6 a 8cm x ${Math.ceil(largura / 2) + 1}m`, qtd: `${caibrosTelhado} un` },
        { codigo: 'EUC-R04', nome: 'Ripamento Estimado', bitola: 'Metros Lineares', qtd: `${ripasMetros}m` },
      ],
    };
  }, [tipo, metrosLineares, espacamento, fiosArame, largura, comprimento]);

  // 📡 Salva o Lead com Protocolo no Painel Administrativo e exibe a Tela de Proposta
  const handleGerarProposta = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nome || !telefone) return;

    setEnviando(true);
    const numRandom = Math.floor(1000 + Math.random() * 9000);
    const novoProtocolo = `ARK-${numRandom}`;
    const agora = new Date();
    const dataFormatada = agora.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

    const resumoItens = resultado.itens.map((i) => `${i.qtd} ${i.nome} (${i.bitola})`).join(' | ');

    try {
      await fetch(`${API_URL}/api/leads`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          protocolo: novoProtocolo,
          nome,
          telefone,
          whatsapp: telefone,
          cidade: cidade || 'Não informada',
          interesse: `[#${novoProtocolo}] ${resultado.titulo} — ${resumoItens}`,
          produto: resultado.titulo,
          itensCalculados: resultado.itens,
          status: 'Proposta Gerada',
          criadoEm: agora.toISOString(),
        }),
      });
    } catch (err) {
      console.error('Aviso ao sincronizar lead:', err);
    } finally {
      setDataEmissao(dataFormatada);
      setProtocoloGerado(novoProtocolo);
      setEnviando(false);
    }
  };

  // 📄 Gera o Documento Técnico Timbrado da Ark Eucalipto para salvar em PDF / Imprimir
  const handleBaixarPDF = () => {
    const janelaPrint = window.open('', '_blank', 'width=900,height=800');
    if (!janelaPrint) return;

    const linhasTabela = resultado.itens
      .map(
        (item, idx) => `
        <tr style="border-bottom: 1px solid #e5e7eb; background: ${idx % 2 === 0 ? '#ffffff' : '#f9fafb'};">
          <td style="padding: 12px; font-family: monospace; font-size: 12px; color: #065f46; font-weight: bold;">${item.codigo}</td>
          <td style="padding: 12px; font-size: 13px; color: #18181b; font-weight: 600;">${item.nome}</td>
          <td style="padding: 12px; font-size: 13px; color: #52525b;">${item.bitola}</td>
          <td style="padding: 12px; font-size: 14px; color: #064e3b; font-weight: 800; text-align: right;">${item.qtd}</td>
        </tr>
      `
      )
      .join('');

    const htmlDocumento = `
      <!DOCTYPE html>
      <html lang="pt-BR">
      <head>
        <meta charset="UTF-8" />
        <title>Proposta Técnica #${protocoloGerado} - Ark Eucalipto</title>
        <style>
          @page { size: A4; margin: 18mm; }
          body { font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #18181b; margin: 0; padding: 0; line-height: 1.5; }
          .header { display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 3px solid #064e3b; padding-bottom: 16px; margin-bottom: 24px; }
          .brand-title { font-size: 26px; font-weight: 900; color: #064e3b; margin: 0; letter-spacing: -0.5px; }
          .brand-sub { font-size: 11px; text-transform: uppercase; letter-spacing: 2px; color: #047857; font-weight: 800; margin-top: 2px; }
          .protocol-box { text-align: right; background: #ecfdf5; border: 1px solid #a7f3d0; padding: 10px 16px; border-radius: 8px; }
          .protocol-label { font-size: 10px; text-transform: uppercase; color: #047857; font-weight: 800; letter-spacing: 1px; }
          .protocol-num { font-size: 18px; font-weight: 900; color: #064e3b; margin-top: 2px; }
          .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; padding: 16px; margin-bottom: 24px; font-size: 13px; }
          .info-label { font-size: 10px; text-transform: uppercase; color: #64748b; font-weight: 700; display: block; }
          .info-val { font-weight: 700; color: #0f172a; font-size: 14px; }
          table { width: 100%; border-collapse: collapse; margin-top: 12px; border: 1px solid #e5e7eb; border-radius: 8px; overflow: hidden; }
          th { background: #064e3b; color: #ffffff; text-transform: uppercase; font-size: 11px; letter-spacing: 1px; padding: 12px; text-align: left; }
          .footer { margin-top: 36px; padding-top: 16px; border-top: 1px solid #e5e7eb; font-size: 12px; color: #64748b; display: flex; justify-content: space-between; }
        </style>
      </head>
      <body>
        <div class="header">
          <div>
            <h1 class="brand-title">ARK EUCALIPTO</h1>
            <div class="brand-sub">Madeiras In Natura • Faturamento Direto</div>
            <div style="font-size: 12px; color: #52525b; margin-top: 6px;">
              Vitória da Conquista - Bahia | www.arkeucalipto.com.br
            </div>
          </div>
          <div class="protocol-box">
            <div class="protocol-label">Protocolo de Cotação</div>
            <div class="protocol-num">#${protocoloGerado}</div>
            <div style="font-size: 11px; color: #52525b; margin-top: 2px;">Emitido em ${dataEmissao}</div>
          </div>
        </div>

        <div class="info-grid">
          <div>
            <span class="info-label">Cliente / Propriedade</span>
            <span class="info-val">${nome}</span>
          </div>
          <div>
            <span class="info-label">WhatsApp de Contato</span>
            <span class="info-val">${telefone}</span>
          </div>
          <div>
            <span class="info-label">Cidade / Destino de Entrega</span>
            <span class="info-val">${cidade || 'A confirmar com consultor'}</span>
          </div>
          <div>
            <span class="info-label">Finalidade do Projeto</span>
            <span class="info-val">${resultado.titulo}</span>
          </div>
        </div>

        <h3 style="margin: 0 0 4px 0; font-size: 16px; color: #064e3b;">MEMORIAL QUANTITATIVO DE MADEIRAMENTO</h3>
        <p style="margin: 0 0 12px 0; font-size: 12px; color: #64748b;">${resultado.especificacao}</p>

        <table>
          <thead>
            <tr>
              <th>Código</th>
              <th>Descrição do Material</th>
              <th>Bitola / Comprimento</th>
              <th style="text-align: right;">Quantitativo</th>
            </tr>
          </thead>
          <tbody>
            ${linhasTabela}
          </tbody>
        </table>

        <div style="margin-top: 24px; background: #f0fdf4; border: 1px solid #bbf7d0; padding: 14px; border-radius: 8px; font-size: 12px; color: #166534;">
          <strong>Próximo Passo:</strong> Esta lista técnica já foi registrada na central comercial da <strong>Ark Eucalipto</strong> sob o protocolo <strong>#${protocoloGerado}</strong>. Nossa equipe calculará a cubagem e o valor do frete para a sua localização.
        </div>

        <div class="footer">
          <span>Ark Eucalipto — Vitória da Conquista, BA</span>
          <span>Protocolo Oficial #${protocoloGerado}</span>
        </div>

        <script>
          window.onload = function() {
            setTimeout(function() { window.print(); }, 250);
          };
        </script>
      </body>
      </html>
    `;

    janelaPrint.document.open();
    janelaPrint.document.write(htmlDocumento);
    janelaPrint.document.close();
  };

  // 💬 Mensagem curta e profissional com apenas 1 linha + Protocolo
  const urlWhatsAppProtocolo = useMemo(() => {
    if (!protocoloGerado) return '#';
    const msgCurta = `Olá! Gerei a lista técnica *Protocolo #${protocoloGerado}* (${resultado.titulo}) no site da Ark Eucalipto em nome de *${nome}* e gostaria de confirmar os valores e o frete.`;
    return `https://wa.me/${whatsappFormatado}?text=${encodeURIComponent(msgCurta)}`;
  }, [protocoloGerado, resultado.titulo, nome, whatsappFormatado]);

  return (
    <section id="calculadora" className="py-20 bg-stone-100 border-y border-stone-200">
      <div className="max-w-7xl mx-auto px-6">
        {/* Cabeçalho da Seção */}
        <div className="max-w-2xl mb-10">
          <span className="inline-flex items-center gap-1.5 bg-emerald-900/10 text-emerald-900 text-xs font-black uppercase tracking-widest px-3 py-1 rounded-full">
            <Calculator className="w-3.5 h-3.5" /> Dimensionamento Técnico Online
          </span>
          <h2 className="text-3xl md:text-4xl font-serif font-black text-zinc-900 mt-3 tracking-tight">
            Calculadora de Eucalipto & Cerca
          </h2>
          <p className="text-sm text-zinc-600 mt-2">
            Simule na hora o quantitativo ideal de mourões, esticadores, vigas e caibros e emita a sua folha técnica em PDF.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* COLUNA ESQUERDA: Parâmetros da Obra (7 Colunas) */}
          <div className="lg:col-span-7 bg-white p-6 md:p-8 rounded-2xl border border-stone-200 shadow-sm space-y-6">
            <div>
              <label className="block text-xs font-black uppercase tracking-wider text-zinc-500 mb-3">
                1. Selecione a finalidade da estrutura
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
                    onClick={() => {
                      setTipo(aba.id as TipoProjeto);
                      setProtocoloGerado(null);
                    }}
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
                    onChange={(e) => {
                      setMetrosLineares(Math.max(1, Number(e.target.value)));
                      setProtocoloGerado(null);
                    }}
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
                        onChange={(e) => {
                          setEspacamento(Number(e.target.value));
                          setProtocoloGerado(null);
                        }}
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
                        onChange={(e) => {
                          setFiosArame(Number(e.target.value));
                          setProtocoloGerado(null);
                        }}
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
                    onChange={(e) => {
                      setLargura(Math.max(1, Number(e.target.value)));
                      setProtocoloGerado(null);
                    }}
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
                    onChange={(e) => {
                      setComprimento(Math.max(1, Number(e.target.value)));
                      setProtocoloGerado(null);
                    }}
                    className="w-full px-4 py-3 border border-stone-300 rounded-xl text-base font-bold text-zinc-900 focus:outline-none focus:ring-2 focus:ring-emerald-700"
                  />
                </div>
              </div>
            )}

            {/* Prévia da Lista Técnica */}
            <div className="bg-emerald-950 text-white p-6 rounded-2xl space-y-4">
              <div className="flex items-center justify-between border-b border-emerald-800/60 pb-3">
                <div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400">
                    Memorial Quantitativo Estimado
                  </span>
                  <h3 className="text-lg font-serif font-bold text-white">{resultado.titulo}</h3>
                  <p className="text-xs text-emerald-300/80">{resultado.especificacao}</p>
                </div>
                <Sparkles className="w-5 h-5 text-emerald-400 flex-shrink-0" />
              </div>

              <div className="space-y-2.5">
                {resultado.itens.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between bg-emerald-900/50 px-4 py-3 rounded-xl border border-emerald-800/50 text-sm"
                  >
                    <div>
                      <span className="text-white font-bold block">{item.nome}</span>
                      <span className="text-xs text-emerald-300/90">Bitola: {item.bitola}</span>
                    </div>
                    <span className="font-black text-emerald-300 text-base whitespace-nowrap ml-3 bg-emerald-950/80 px-3 py-1 rounded-lg border border-emerald-800">
                      {item.qtd}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* COLUNA DIREITA: Alterna entre Formulário e Cartão de Proposta Oficial (5 Colunas) */}
          <div className="lg:col-span-5">
            {!protocoloGerado ? (
              <div className="bg-white p-6 md:p-8 rounded-2xl border border-stone-200 shadow-sm">
                <div className="inline-flex items-center gap-1.5 text-emerald-800 bg-emerald-50 px-3 py-1 rounded-lg text-[11px] font-black uppercase tracking-wider mb-3">
                  <FileText className="w-3.5 h-3.5" /> Emissão de Proposta & PDF
                </div>
                <h3 className="text-xl font-serif font-black text-zinc-900">
                  Gerar Folha Técnica + Cotação
                </h3>
                <p className="text-xs text-zinc-500 mt-1 mb-6">
                  Informe os seus dados para emitir o documento em PDF timbrado da Ark Eucalipto e registrar seu protocolo de cotação.
                </p>

                <form onSubmit={handleGerarProposta} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-zinc-700 mb-1">
                      Seu Nome ou Fazenda/Empresa *
                    </label>
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
                    <label className="block text-xs font-bold text-zinc-700 mb-1">
                      Seu WhatsApp com DDD *
                    </label>
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
                    <label className="block text-xs font-bold text-zinc-700 mb-1">
                      Cidade / Região de Entrega
                    </label>
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
                    className="w-full bg-emerald-800 hover:bg-emerald-900 text-white font-black text-xs uppercase tracking-wider py-4 rounded-xl shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
                  >
                    <FileDown className="w-4 h-4" />
                    {enviando ? 'Emitindo Protocolo...' : 'Gerar Proposta Técnica & PDF'}
                  </button>
                </form>
              </div>
            ) : (
              /* 🏆 CARTÃO DE PROPOSTA OFICIAL GERADA NO PRÓPRIO SITE */
              <div className="bg-white rounded-2xl border-2 border-emerald-700 shadow-xl overflow-hidden animate-fadeIn">
                <div className="bg-emerald-900 text-white p-6">
                  <div className="flex items-center justify-between">
                    <span className="inline-flex items-center gap-1.5 text-[11px] font-black uppercase tracking-widest text-emerald-300">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Solicitação Registrada
                    </span>
                    <span className="bg-emerald-950 text-emerald-300 border border-emerald-700 px-3 py-1 rounded-lg font-mono text-xs font-black">
                      #{protocoloGerado}
                    </span>
                  </div>
                  <h3 className="text-xl font-serif font-black mt-2">
                    Proposta Técnica Emitida!
                  </h3>
                  <p className="text-xs text-emerald-100/90 mt-1">
                    Nossa equipe já recebeu os quantitativos da sua obra em nosso painel central.
                  </p>
                </div>

                <div className="p-6 space-y-5">
                  {/* Resumo dos Dados do Protocolo */}
                  <div className="bg-stone-50 p-4 rounded-xl border border-stone-200 space-y-2 text-xs">
                    <div className="flex justify-between">
                      <span className="text-zinc-500 font-semibold">Cliente:</span>
                      <span className="text-zinc-900 font-bold">{nome}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-zinc-500 font-semibold">WhatsApp:</span>
                      <span className="text-zinc-900 font-bold">{telefone}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-zinc-500 font-semibold">Projeto:</span>
                      <span className="text-emerald-900 font-bold text-right">{resultado.titulo}</span>
                    </div>
                  </div>

                  {/* Ação 1: Baixar PDF Timbrado */}
                  <button
                    type="button"
                    onClick={handleBaixarPDF}
                    className="w-full bg-zinc-900 hover:bg-zinc-800 text-white font-black text-xs uppercase tracking-wider py-4 px-4 rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <FileDown className="w-4 h-4 text-emerald-400" />
                    Baixar Lista Técnica em PDF Timbrado
                  </button>

                  {/* Ação 2: Enviar apenas o código de Protocolo no WhatsApp (Opcional, 1 linha limpa) */}
                  <a
                    href={urlWhatsAppProtocolo}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full bg-emerald-700 hover:bg-emerald-800 text-white font-black text-xs uppercase tracking-wider py-3.5 px-4 rounded-xl transition-all flex items-center justify-center gap-2 text-center"
                  >
                    <MessageCircle className="w-4 h-4" />
                    Priorizar Atendimento (#{protocoloGerado})
                  </a>

                  <div className="flex items-start gap-2 text-[11px] text-zinc-500 bg-emerald-50/60 p-3 rounded-xl border border-emerald-100">
                    <ShieldCheck className="w-4 h-4 text-emerald-700 flex-shrink-0 mt-0.5" />
                    <span>
                      <strong>Fique tranquilo:</strong> Mesmo que você não abra o WhatsApp agora, nosso consultor entrará em contato pelo número <strong>{telefone}</strong> com os valores e frete.
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => setProtocoloGerado(null)}
                    className="w-full text-zinc-500 hover:text-zinc-800 text-xs font-bold py-2 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" /> Fazer nova simulação
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}