import { NextResponse } from 'next/server';

// 🛑 COLOQUE AS SUAS CREDENCIAIS AQUI:
const TELEGRAM_TOKEN = '8692435392:AAGqB3A5UPEMgxkuLLz-GTsm_W7UoICgSTs';
const TELEGRAM_CHAT_ID = '7947658384';

export async function POST(request: Request) {
  try {
    const corpoRequisicao = await request.json();
    const categoria = corpoRequisicao.categoria;

    let setorResponsavel = 'PÁTIO CENTRAL';
    let canalAtendimento = 'Geral';

    switch (categoria) {
      case 'tratado':
        setorResponsavel = 'COMERCIAL - MADEIRA TRATADA PREMIUM';
        canalAtendimento = 'Venda Consultiva / Garantia Autoclave';
        break;
      case 'rural':
        setorResponsavel = 'COMERCIAL - LINHA RURAL BRUTA';
        canalAtendimento = 'Balcão / Produtor Rural';
        break;
      case 'innatura':
        setorResponsavel = 'LOGÍSTICA - CONSTRUÇÃO CIVIL';
        canalAtendimento = 'Cálculo de Cubagem / Engenharia';
        break;
      case 'lenha':
        setorResponsavel = 'DIRETORIA - CONTRATOS INDUSTRIAL';
        canalAtendimento = 'Contratos de Biomassa (Volume)';
        break;
      default:
        setorResponsavel = 'PÁTIO CENTRAL';
        canalAtendimento = 'Triagem Geral';
    }

    const leadRoteado = {
      ...corpoRequisicao,
      setor: setorResponsavel,
      canal: canalAtendimento
    };

    // ⚡ NOVA TECNOLOGIA: Disparo Push em Tempo Real via Telegram
    const mensagemTelegram = `
🌲 *NOVO LEAD CAPTURADO!*
-----------------------------------------
👤 *Cliente:* ${leadRoteado.nome}
🏢 *Empresa:* ${leadRoteado.empresa}
📞 *WhatsApp:* ${leadRoteado.telefone}
📦 *Material:* ${leadRoteado.categoria.toUpperCase()}

🎯 *Destino:* ${leadRoteado.setor}
📢 *Operação:* ${leadRoteado.canal}
📍 *Origem/IP:* ${leadRoteado.origem}

💬 *Mensagem do Cliente:* "${leadRoteado.mensagem || 'Sem observações.'}"
-----------------------------------------
⏱️ _Acesse o painel local para gerenciar._
`;

    // Dispara para a API do Telegram em segundo plano (sem travar o carregamento do site)
    fetch(`https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: TELEGRAM_CHAT_ID,
        text: messagingFormat(mensagemTelegram),
        parse_mode: 'Markdown'
      })
    }).catch(err => console.error("Erro ao disparar Telegram:", err));


    // Log de validação no terminal local
    console.log("=========================================");
    console.log("🌲 LEAD DISTRIBUÍDO E NOTIFICADO VIA PUSH!");
    console.log("Cliente:", leadRoteado.nome);
    console.log("📍 Destino Interno:", leadRoteado.setor);
    console.log("=========================================");

    return NextResponse.json({ 
      success: true, 
      message: "Lead processado e notificado com sucesso!" 
    }, { status: 200 });

  } catch (error) {
    console.error("❌ Erro no motor de distribuição e alerta:", error);
    return NextResponse.json({ error: "Falha interna." }, { status: 500 });
  }
}

// Função auxiliar para limpar quebras de linha estranhas no Markdown do Telegram
function messagingFormat(text: string) {
  return text.trim();
}