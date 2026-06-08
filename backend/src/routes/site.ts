import { Router } from "express";
import multer from "multer";
import { getConfig, updateConfig, uploadImagem } from "../controllers/siteController.js";

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

export default router;