import { Router } from "express";
import multer from "multer";
// ⚙️ Adicionamos 'inscreverNewsletter' na linha de importação abaixo:
import { getConfig, updateConfig, uploadImagem, inscreverNewsletter } from "../controllers/siteController.js";

const router = Router();

// Configura o multer para segurar o arquivo temporariamente na memória RAM
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // Limite de segurança de 5MB por foto
});

// 🌐 GET: Retorna as configurações completas do site
router.get("/config", getConfig);

// 💾 POST: Salva ou mescla novos dados enviados pelo Painel Administrativo
router.post("/config/atualizar", updateConfig);

// 📷 POST: Rota de upload que estava dando 404
router.post("/upload", upload.single("file"), uploadImagem);

// ✉️ O QUE ADICIONAMOS: Rota que o Footer.tsx e o Popup vão chamar para capturar e-mails
router.post("/site/newsletter", inscreverNewsletter);

export default router;