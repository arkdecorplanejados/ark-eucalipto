import { Request, Response } from 'express';
import admin from 'firebase-admin';
import { v2 as cloudinary } from 'cloudinary';

const db = admin.firestore();

// 🌐 1. Busca as configurações com o Firestore e entrega o Fallback de Segurança
export const getConfig = async (req: Request, res: Response): Promise<void> => {
  try {
    const docRef = db.collection('site').doc('config');
    const docSnap = await docRef.get();
    
    let configData = docSnap.exists ? docSnap.data() : null;

    if (!configData) {
      configData = {
        logoUrl: "", 
        whatsapp: "77999999999", 
        email: "contato@arkdecor.com.br",
        endereco: "Vitória da Conquista - BA\nAtendimento a Canteiros de Obra e Indústrias",
        descricaoSite: "Soluções sustentáveis em madeira bruta, escoramentos e biomassa para toda a Bahia. Faturamento direto do produtor.",
        menu: [
          { id: "1", label: "Início", href: "/" },
          { id: "2", label: "Produtos", href: "/produtos" },
          { id: "3", label: "Diferenciais", href: "/diferenciais" },
          { id: "4", label: "Dúvidas", href: "/faq" }
        ],
        slides: [
          {
            titulo: "Ark Eucalipto In Natura",
            subtitulo: "Alta qualidade, rigidez estrutural e sustentabilidade com faturamento direto de Vitória da Conquista.",
            imagem: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?q=80&w=2013&auto=format&fit=crop"
          }
        ],
        diferenciais: [
          { icone: "🚛", titulo: "Pronta Entrega", subtitulo: "Logística Ágil", texto: "Pátio estrategicamente abastecido em Vitória da Conquista. Atendemos demandas imediatas." },
          { icone: "🏗️", titulo: "Alta Densidade", subtitulo: "Escoramento Seguro", texto: "Madeira bruta selecionada na fonte, com excelente rigidez estrutural testada para lajes." },
          { icone: "💰", titulo: "Preço Direto", subtitulo: "Economia Real", texto: "Negociação direto com quem extrai e distribui, garantindo o menor custo por metro linear." },
          { icone: "📄", titulo: "100% Legal", subtitulo: "Documentação Florestal", texto: "Segurança jurídica total. Todo o nosso volume acompanha o Documento de Origem Florestal (DOF)." }
        ],
        setores: [
          { icone: "🌾", titulo: "Agronegócio", subtitulo: "Uso Rural", texto: "Abastecimento para cercamentos, estacas de demarcação e balancins rurais direto do produtor.", linkTexto: "Falar com Especialista Rural" },
          { icone: "🏗️", titulo: "Construção Civil", subtitulo: "Infraestrutura e Obras", texto: "Suporte robusto para escoramento de lajes, pilares temporários e pontaletes com alta resistência.", linkTexto: "Faturamento para Obras" },
          { icone: "🔥", titulo: "Setor Industrial", subtitulo: "Biomassa", texto: "Fornecimento contínuo de lenha de eucalipto selecionada para caldeiras industriais e fornos.", linkTexto: "Contratos de Fornecimento" }
        ],
        parallax: {
          titulo: "Prontidão e Força Bruta para Grandes Demandas",
          subtitulo: "Garantimos volume, regularidade ambiental e agilidade logística para o seu canteiro ou fábrica.",
          imagemUrl: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09"
        },
        faq: [
          { pregunta: "Qual é a diferença prática do Eucalipto In Natura para o Tratado?", resposta: "O eucalipto in natura é a madeira bruta, recém-colhida e sem aditivos químicos. Ele mantém toda a resistência mecânica natural do tronco, sendo a solução com melhor custo-benefício para usos temporários ou estruturais rápidos, como escoramentos de laje, pontaletes rurais e queima industrial (biomassa)." },
          { pregunta: "Como funciona o transporte e a emissão do DOF (Documento de Origem Florestal)?", resposta: "Toda a nossa madeira é extraída de florestas plantadas e regulamentadas. Emitimos e enviamos a carga acompanhada da Nota Fiscal e do DOF impresso e eletrônico. Isso garante total segurança jurídica nas rodovias e conformidade ambiental para construtoras e indústrias parceiras." },
          { pregunta: "Vocês atendem pedidos fracionados ou apenas cargas fechadas?", resposta: "Com nosso pátio logístico centralizado em Vitória da Conquista - BA, conseguimos atender desde o pequeno produtor rural e mestre de obras com volumes fracionados retirados no local, até contratos industriais de fornecimento contínuo de carga fechada (truco ou carreta) entregues na planta." },
          { pregunta: "Qual é a durabilidade estimada da madeira in natura em contato com o solo?", resposta: "A durabilidade depende diretamente da umidade do local e do tipo de aplicação. Para uso aéreo ou escoramento de obras (onde a madeira permanece seca), ela mantém a integridade estrutural por muitos anos. Para contato direto enterrado no solo, sua vida útil é reduzida, sendo recomendada para fins temporários ou cercamentos econômicos." }
        ],
        produtosVitrine: []
      };
    }

    res.status(200).json(configData);
  } catch (error) {
    console.error("Erro ao buscar configurações do site:", error);
    res.status(500).json({ error: "Erro interno no servidor ao carregar o layout." });
  }
};

// 💾 2. Salva ou Atualiza os dados enviados do painel administrativo no Firestore
export const updateConfig = async (req: Request, res: Response): Promise<void | Response> => {
  try {
    const novosDados = req.body;
    
    if (!novosDados.diferenciais || !novosDados.setores || !novosDados.faq) {
      return res.status(400).json({ error: "Dados incompletos para atualização do layout." });
    }

    await db.collection('site').doc('config').set(novosDados, { merge: true });

    res.status(200).json({ message: "Layout da Ark Eucalipto updated com sucesso no Firebase!" });
  } catch (error) {
    console.error("Erro ao salvar dados do site:", error);
    res.status(500).json({ error: "Erro interno ao atualizar configurações no Firestore." });
  }
};

// 📷 3. NOVO MOTOR CLOUDINARY: Envia a imagem de forma binária via Stream
export const uploadImagem = async (req: Request, res: Response): Promise<void | Response> => {
  try {
    const file = req.file;

    if (!file) {
      return res.status(400).json({ error: "Nenhum arquivo de imagem foi enviado." });
    }

    if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
      return res.status(500).json({ error: "Credenciais do Cloudinary ausentes no arquivo .env." });
    }

    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });

    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: 'ark-eucalipto',
        resource_type: 'image'
      },
      (error, result) => {
        if (error || !result) {
          console.error("Erro no upload do Cloudinary:", error);
          return res.status(500).json({ error: "Falha ao enviar arquivo para o servidor do Cloudinary." });
        }

        return res.status(200).json({ url: result.secure_url });
      }
    );

    uploadStream.end(file.buffer);

  } catch (error) {
    console.error("Erro no método uploadImagem:", error);
    return res.status(500).json({ error: "Erro interno ao processar upload de imagem." });
  }
};

// 🟢 4. NEWSLETTER CONTROLLER: Captura leads, valida duplicidade e salva no Firestore
export const inscreverNewsletter = async (req: Request, res: Response): Promise<void | Response> => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: "O campo e-mail é obrigatório." });
    }

    const emailTratado = email.trim().toLowerCase();
    const newsletterRef = db.collection('newsletter');

    // 🔍 Anti-duplicidade: Verifica usando o padrão do firebase-admin se o e-mail já existe
    const querySnapshot = await newsletterRef.where('email', '==', emailTratado).get();

    if (!querySnapshot.empty) {
      return res.status(200).json({ message: "Este e-mail já está cadastrado no informativo da Ark." });
    }

    // 💾 Gravação oficial utilizando o FieldValue do admin para o carimbo de data do servidor
    await newsletterRef.add({
      email: emailTratado,
      dataInscricao: admin.firestore.FieldValue.serverTimestamp()
    });

    return res.status(201).json({ message: "Inscrição realizada com sucesso!" });

  } catch (error) {
    console.error("Erro interno no método inscreverNewsletter:", error);
    return res.status(500).json({ error: "Erro interno no servidor ao salvar cadastro da newsletter." });
  }
};