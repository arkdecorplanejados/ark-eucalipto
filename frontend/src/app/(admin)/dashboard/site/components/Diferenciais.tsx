'use client';

import { useState, useRef } from 'react';
import { Layout, Check, Upload, Loader2, Eye, Save } from 'lucide-react';

interface ParallaxConfig {
  titulo: string;
  subtitulo: string;
  imagemUrl: string;
}

interface ComponenteProps {
  dados: {
    parallax: {
      logistica: ParallaxConfig;
      catalogo: ParallaxConfig;
    };
  };
  setDados: React.Dispatch<React.SetStateAction<any>>;
}

export default function GerenciarDiferenciais({ dados, setDados }: ComponenteProps) {
  const [carregandoImagem, setCarregandoImagem] = useState(false);
  const [salvandoLocal, setSalvandoLocal] = useState(false);
  
  // 📝 REFERÊNCIA DO INPUT DE ARQUIVO OCULTO
  const arquivoInputRef = useRef<HTMLInputElement>(null);

  const configAtual = dados?.parallax?.logistica || { titulo: '', subtitulo: '', imagemUrl: '' };

  const handleMudarCampo = (campo: keyof ParallaxConfig, valor: string) => {
    setDados((prev: any) => ({
      ...prev,
      parallax: {
        ...prev?.parallax,
        logistica: {
          ...prev?.parallax?.logistica,
          [campo]: valor
        }
      }
    }));
  };

  // 🗜️ COMPRESSOR AUTOMÁTICO DE IMAGENS PARA EVITAR ERROS DE TAMANHO DO PAYLOAD
  const comprimirERedimensionar = (base64Str: string) => {
    const img = new window.Image();
    img.src = base64Str;
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const MAX_WIDTH = 1200; // Resolução otimizada para web
      let width = img.width;
      let height = img.height;

      if (width > MAX_WIDTH) {
        height = Math.round((height * MAX_WIDTH) / width);
        width = MAX_WIDTH;
      }

      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      
      ctx.drawImage(img, 0, 0, width, height);

      // Salva como JPEG com 70% de qualidade para ficar leve e estável
      const novoBase64 = canvas.toDataURL('image/jpeg', 0.7);
      
      handleMudarCampo('imagemUrl', novoBase64);
      setCarregandoImagem(false);
    };
  };

  // 📂 ABRE A JANELA DO COMPUTADOR E DISPARA A LEITURA DO ARQUIVO
  const handleTratarArquivo = (e: React.ChangeEvent<HTMLInputElement>) => {
    const arquivo = e.target.files?.[0];
    if (!arquivo) return;

    setCarregandoImagem(true);

    const leitor = new FileReader();
    leitor.onloadend = () => {
      comprimirERedimensionar(leitor.result as string);
    };
    leitor.readAsDataURL(arquivo);
  };

  // 💾 SALVAMENTO DIRETOR E IMEDIATO NO LOCALSTORAGE DO SITE
  const handleSalvarDireto = () => {
    setSalvandoLocal(true);
    
    try {
      const configExistente = localStorage.getItem('ark_eucalipto_config') || '{}';
      const objCompleto = JSON.parse(configExistente);

      const dadosAtualizados = {
        ...objCompleto,
        parallax: {
          ...objCompleto?.parallax,
          logistica: configAtual
        }
      };

      localStorage.setItem('ark_eucalipto_config', JSON.stringify(dadosAtualizados));
      alert('Configurações do Parallax salvas com sucesso! A página pública já está atualizada.');
    } catch (error) {
      alert('Erro ao salvar no banco local do navegador. Verifique o arquivo.');
    } finally {
      setSalvandoLocal(false);
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn text-zinc-800">
      
      {/* 🛠️ FORMULÁRIO DE CONFIGURAÇÃO */}
      <div className="bg-zinc-50 border border-zinc-200 rounded-2xl p-5 space-y-4">
        <h4 className="text-xs font-black uppercase text-zinc-700 tracking-wide flex items-center gap-1.5">
          <Layout className="w-4 h-4 text-emerald-700" /> Configurar Topo Parallax (Diferenciais)
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          
          <div className="md:col-span-4 space-y-1">
            <label className="text-[9px] font-black uppercase text-zinc-400">Título Principal do Banner</label>
            <input 
              type="text" 
              placeholder="Ex: NOSSOS DIFERENCIAIS" 
              value={configAtual.titulo} 
              onChange={e => handleMudarCampo('titulo', e.target.value)} 
              className="w-full p-2.5 bg-white border rounded-xl text-xs font-bold" 
            />
          </div>

          <div className="md:col-span-8 space-y-1">
            <label className="text-[9px] font-black uppercase text-zinc-400">Subtítulo descritivo / Slogan</label>
            <input 
              type="text" 
              placeholder="Ex: A robustez e a tecnologia por trás da nossa madeira tratada" 
              value={configAtual.subtitulo} 
              onChange={e => handleMudarCampo('subtitulo', e.target.value)} 
              className="w-full p-2.5 bg-white border rounded-xl text-xs font-medium" 
            />
          </div>

          {/* ☁️ COMPONENTE DE UPLOAD LOCAL RECUPERADO COM SUCESSO */}
          <div className="md:col-span-12 space-y-1">
            <label className="text-[9px] font-black uppercase text-zinc-400">Imagem de Fundo do Parallax</label>
            <div className="flex flex-col sm:flex-row gap-2">
              
              {/* INPUT INTEGRADO INVISÍVEL */}
              <input 
                type="file"
                ref={arquivoInputRef}
                accept="image/*"
                onChange={handleTratarArquivo}
                className="hidden" 
              />

              {/* Botão de disparo visual da janela do sistema */}
              <button
                type="button"
                disabled={carregandoImagem}
                onClick={() => {
                  if (arquivoInputRef.current) {
                    arquivoInputRef.current.value = '';
                    arquivoInputRef.current.click();
                  }
                }}
                className="flex bg-white hover:bg-zinc-100 border border-zinc-200 text-zinc-700 text-xs font-bold px-4 py-2.5 rounded-xl items-center justify-center gap-2 transition-all disabled:opacity-50 shrink-0"
              >
                {carregandoImagem ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-emerald-700" />
                    <span>Otimizando Imagem...</span>
                  </>
                ) : configAtual.imagemUrl ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-600" />
                    <span className="text-emerald-700">Fundo Carregado!</span>
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4 text-zinc-500" />
                    <span>Escolher Imagem do PC</span>
                  </>
                )}
              </button>

              <input 
                type="text" 
                readOnly
                placeholder="Nenhum arquivo enviado" 
                value={configAtual.imagemUrl ? "Imagem otimizada na memória para prevenir erros de tamanho" : ""} 
                className="w-full p-2.5 bg-zinc-100/50 border border-zinc-200 rounded-xl text-xs font-medium text-zinc-400 pointer-events-none truncate select-none" 
              />
            </div>
          </div>
        </div>

        {/* 💾 BOTÃO INTERNO DE SALVAMENTO */}
        <div className="flex justify-end pt-2 border-t border-zinc-200/60">
          <button
            type="button"
            disabled={salvandoLocal || carregandoImagem}
            onClick={handleSalvarDireto}
            className="w-full sm:w-auto bg-zinc-900 text-white hover:bg-emerald-700 px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-colors flex items-center justify-center gap-2 shadow-sm disabled:opacity-50"
          >
            <Save className="w-4 h-4" /> 
            {salvandoLocal ? 'Gravando...' : 'Salvar Configurações do Topo'}
          </button>
        </div>
      </div>

      {/* 👁️ PRÉ-VISUALIZAÇÃO EM TEMPO REAL */}
      <div className="space-y-2">
        <h5 className="text-xs font-black uppercase text-zinc-400 tracking-wider flex items-center gap-1">
          <Eye className="w-3.5 h-3.5" /> Pré-Visualização do Topo no Site
        </h5>
        
        <div 
          className="relative h-44 bg-cover bg-center rounded-2xl overflow-hidden flex items-center justify-center border shadow-sm transition-all duration-300"
          style={{ backgroundImage: `url('${configAtual.imagemUrl || 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=500'}')` }}
        >
          <div className="absolute inset-0 bg-black/50 backdrop-blur-[0.5px]" />
          <div className="relative text-center space-y-1.5 p-4 max-w-xl">
            <h2 className="text-base md:text-xl font-serif font-black text-white uppercase tracking-tight leading-none">
              {configAtual.titulo || "NOSSOS DIFERENCIAIS"}
            </h2>
            <p className="text-[10px] md:text-xs text-zinc-200 font-normal leading-relaxed truncate">
              {configAtual.subtitulo || "A robustez e a tecnologia por trás da nossa madeira tratada"}
            </p>
          </div>
        </div>
      </div>

    </div>
  );
}