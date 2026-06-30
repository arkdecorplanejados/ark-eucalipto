import { NextResponse } from 'next/server';

// 🛑 CREDENCIAIS DO TELEGRAM:
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

    // 🟢 CONEXÃO REAL COM O BACK-END (Gravação no Firebase Firestore)
    // Envia os dados limpos seguindo o padrão que criamos na API do Back-end (porta 3001)
    try {
      const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
      await fetch(`${backendUrl}/api/leads`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          companyName: leadRoteado.empresa || leadRoteado.nome, // Se não tiver empresa cadastrada, usa o nome do contato
          segment: (leadRoteado.categoria || 'GERAL').toUpperCase(),
          contactName: leadRoteado.nome,
          phone: leadRoteado.telefone,
          email: leadRoteado.email || null,
          location: leadRoteado.origem || 'Vitória da Conquista - BA',
          aiScore: 90, // Como vem do site real, score alto padrão
          aiJustification: `Lead qualificado vindo do formulário da Vitrine do Site. Interesse em: ${leadRoteado.categoria}.`
        })
      });
      console.log("💾 Lead gravado com sucesso no Firebase via Back-end!");
    } catch (dbErr) {
      console.error("❌ Erro ao enviar lead para o back-end:", dbErr);
      // Mantém a execução para não travar o fluxo do cliente nem o Telegram se o back off-line
    }

    // ⚡ Disparo Push em Tempo Real via Telegram
    const mensagemTelegram = `
🌲 *NOVO LEAD CAPTURADO!*
-----------------------------------------
👤 *Cliente:* ${leadRoteado.nome}
🏢 *Empresa:* ${leadRoteado.empresa || 'Não Informada'}
📞 *WhatsApp:* ${leadRoteado.telefone}
📦 *Material:* ${(leadRoteado.categoria || 'Geral').toUpperCase()}

🎯 *Destino:* ${leadRoteado.setor}
📢 *Operação:* ${leadRoteado.canal}
📍 *Origem/IP:* ${leadRoteado.origem || 'Site'}

💬 *Mensagem do Cliente:* "${leadRoteado.mensagem || 'Sem observações.'}"
-----------------------------------------
⏱️ _Acesse o painel local para gerenciar._
`;

    // Dispara para a API do Telegram em segundo plano
    fetch(`https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: TELEGRAM_CHAT_ID,
        text: messagingFormat(mensagemTelegram),
        parse_mode: 'Markdown'
      })
    }).catch(err => console.error("Erro ao disparar Telegram:", err));

    // Log de validação no terminal local do Next.js
    console.log("=========================================");
    console.log("🌲 LEAD DISTRIBUÍDO, NOTIFICADO E SALVO!");
    console.log("Cliente:", leadRoteado.nome);
    console.log("📍 Destino Interno:", leadRoteado.setor);
    console.log("=========================================");

    return NextResponse.json({ 
      success: true, 
      message: "Lead processado, salvo e notificado com sucesso!" 
    }, { status: 200 });

  } catch (error) {
    console.error("❌ Erro no motor de distribuição e alerta:", error);
    return NextResponse.json({ error: "Falha interna." }, { status: 500 });
  }
}

function messagingFormat(text: string) {
  return text.trim();
}