import { NextResponse } from 'next/server';

const TELEGRAM_TOKEN = '8692435392:AAGqB3A5UPEMgxkuLLz-GTsm_W7UoICgSTs';
const TELEGRAM_CHAT_ID = '7947658384';

export async function POST(request: Request) {
  try {
    const corpoRequisicao = await request.json();
    const { nome, empresa, telefone, categoria, mensagem, origem, email } = corpoRequisicao;

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

    // 🟢 1. Gravação no Back-end (Firebase)
    try {
      const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
      const dbResponse = await fetch(`${backendUrl}/api/leads`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          companyName: empresa || nome,
          segment: (categoria || 'GERAL').toUpperCase(),
          contactName: nome,
          phone: telefone,
          email: email || null,
          location: origem || 'Vitória da Conquista - BA',
          aiScore: 90,
          aiJustification: `Lead vindo do formulário do site.`
        })
      });
      
      console.log("✈️ Resposta do Banco de Dados Status:", dbResponse.status);
    } catch (dbErr) {
      console.error("❌ ERRO NO BACKEND/FIREBASE:", dbErr);
    }

    // ⚡ 2. Envio para o Telegram com tratamento rigoroso
    const mensagemTelegram = `🌲 NOVO LEAD CAPTURADO!\n\n👤 Cliente: ${nome || 'Não informado'}\n🏢 Empresa: ${empresa || 'Não Informada'}\n📞 WhatsApp: ${telefone || 'Não informado'}\n📦 Material: ${(categoria || 'Geral').toUpperCase()}\n\n🎯 Destino: ${setorResponsavel}\n📢 Operação: ${canalAtendimento}\n📍 Origem: ${origem || 'Site'}\n\n💬 Mensagem: ${mensagem || 'Sem observações.'}`;

    try {
      const telResponse = await fetch(`https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: TELEGRAM_CHAT_ID,
          text: mensagemTelegram,
          parse_mode: 'Markdown'
        })
      });

      const telData = await telResponse.json();
      if (!telData.ok) {
        console.error("❌ O TELEGRAM REJEITOU A MENSAGEM:", telData);
      } else {
        console.log("✅ TELEGRAM RESPONDEU: Mensagem enviada com sucesso!");
      }
    } catch (telErr) {
      console.error("❌ FALHA DE REDE AO CONECTAR NO TELEGRAM:", telErr);
    }

    return NextResponse.json({ success: true }, { status: 200 });

  } catch (error) {
    console.error("❌ ERRO CRÍTICO NA ROTA:", error);
    return NextResponse.json({ error: "Falha interna." }, { status: 500 });
  }
}