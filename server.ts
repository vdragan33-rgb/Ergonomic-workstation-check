import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import nodemailer from "nodemailer";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: "15mb" }));

  // API Health Endpoint
  app.get("/api/health", (_req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  // Gemini Ergonomic Advisor API Route
  app.post("/api/gemini/analyze", async (req, res) => {
    try {
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        return res.status(400).json({
          error: "GEMINI_API_KEY não configurada. Defina a chave nas Definições do projeto."
        });
      }

      const ai = new GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            "User-Agent": "aistudio-build",
          },
        },
      });

      const { prompt, imageBase64, setupType, nonCompliantItems } = req.body;

      const parts: any[] = [];

      if (imageBase64) {
        const cleanBase64 = imageBase64.replace(/^data:image\/\w+;base64,/, "");
        const mimeMatch = imageBase64.match(/^data:(image\/\w+);base64,/);
        const mimeType = mimeMatch ? mimeMatch[1] : "image/jpeg";

        parts.push({
          inlineData: {
            data: cleanBase64,
            mimeType,
          },
        });
      }

      const systemPrompt = `Você é um Perito Especialista em Segurança e Saúde no Trabalho (SST) e Ergonomia em Portugal, prestando consultoria aos colaboradores do IQAS (Instituto Português de Acreditação).
Sua missão é avaliar o posto de trabalho e fornecer recomendações práticas de acordo com a legislação portuguesa:
- Decreto-Lei n.º 349/93 de 22 de Outubro (Equipamentos dotados de visor - EDV)
- Lei n.º 102/2009 (Regime Jurídico da Promoção da Segurança e Saúde no Trabalho)
- Código do Trabalho (Artigos 165.º a 171.º relativos ao Teletrabalho)
- Orientações da ACT (Autoridade para as Condições do Trabalho) e Normas ISO 9241.

Contexto da avaliação:
- Tipo de Posto: ${setupType === 'home' ? 'Teletrabalho (Home Office)' : 'Escritório IQAS (Presencial)'}
- Problemas/Itens Não-Conformes detetados no checklist: ${JSON.stringify(nonCompliantItems || [])}

Estruture a resposta em Português de Portugal com formatação Markdown clara:
1. 🔍 **Diagnóstico Sintético de Risco Ergonómico**
2. 🛠️ **Ações Corretivas Prioritárias (Passo-a-Passo Prático)**
3. 📜 **Fundamentação Legal e Normativa em Portugal** (Citar artigos/leis aplicáveis)
4. 🧘 **Dica de Exercício / Pausa Ativa Personalizada**`;

      parts.push({
        text: `${systemPrompt}\n\nSolicitação do Colaborador: ${prompt || "Analise estes dados de ergonomia e forneça o plano de melhoria técnica."}`
      });

      const response = await ai.models.generateContent({
        model: "gemini-3.6-flash",
        contents: { parts },
      });

      res.json({ result: response.text });
    } catch (err: any) {
      console.error("Erro na API Gemini Ergonomia:", err);
      res.status(500).json({
        error: err.message || "Ocorreu um erro ao processar o parecer ergonómico."
      });
    }
  });

  // Email Analytics & Ergonomic Report API Route
  app.post("/api/send-email", async (req, res) => {
    try {
      const {
        recipients,
        subject,
        employeeName,
        scorePercent,
        riskLevel,
        nonCompliantCount,
        improvementCount,
        compliantCount,
        customMessage,
        reportHtml,
        lang
      } = req.body;

      if (!recipients || (Array.isArray(recipients) && recipients.length === 0)) {
        return res.status(400).json({ error: "No recipient email addresses provided." });
      }

      const emailList = Array.isArray(recipients) ? recipients.join(", ") : recipients;
      const isPt = lang === 'pt';

      const emailSubject = subject || (
        isPt
          ? `[IQAS Ergonomia] Relatório de Avaliação - ${employeeName || 'Geral'}`
          : `[IQAS Ergonomics] Assessment Report - ${employeeName || 'Overall'}`
      );

      const defaultHtml = `
        <div style="font-family: Arial, sans-serif; max-width: 650px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px; background-color: #faf9f6; color: #2d2d2a;">
          <div style="background-color: #4A5D4E; color: #ffffff; padding: 16px 24px; border-radius: 8px 8px 0 0; display: flex; align-items: center; justify-content: space-between;">
            <h2 style="margin: 0; font-size: 18px;">IQAS - Segurança e Saúde no Trabalho</h2>
            <span style="font-size: 12px; background-color: rgba(255,255,255,0.2); padding: 4px 8px; border-radius: 12px;">DL 349/93</span>
          </div>
          <div style="padding: 24px;">
            <h3 style="color: #1a1a17; margin-top: 0;">${isPt ? 'Relatório de Avaliação Ergonómica' : 'Ergonomic Assessment Analytics Report'}</h3>
            ${employeeName ? `<p><strong>${isPt ? 'Colaborador Avaliado' : 'Assessed Employee'}:</strong> ${employeeName}</p>` : ''}
            
            <div style="display: flex; gap: 12px; margin: 20px 0;">
              <div style="flex: 1; background-color: #ffffff; padding: 12px; border-radius: 8px; border: 1px solid #e2e8f0; text-align: center;">
                <div style="font-size: 11px; text-transform: uppercase; color: #71717a;">${isPt ? 'Conformidade' : 'Compliance'}</div>
                <div style="font-size: 24px; font-weight: bold; color: #4A5D4E;">${scorePercent}%</div>
              </div>
              <div style="flex: 1; background-color: #ffffff; padding: 12px; border-radius: 8px; border: 1px solid #e2e8f0; text-align: center;">
                <div style="font-size: 11px; text-transform: uppercase; color: #71717a;">${isPt ? 'Nível de Risco' : 'Risk Level'}</div>
                <div style="font-size: 18px; font-weight: bold; color: ${riskLevel === 'low' ? '#16a34a' : riskLevel === 'medium' ? '#d97706' : '#dc2626'}; text-transform: uppercase;">
                  ${riskLevel === 'low' ? (isPt ? 'Baixo' : 'Low') : riskLevel === 'medium' ? (isPt ? 'Médio' : 'Medium') : (isPt ? 'Elevado' : 'High')}
                </div>
              </div>
            </div>

            ${customMessage ? `
              <div style="background-color: #e2e8f0; padding: 12px; border-radius: 6px; font-style: italic; margin-bottom: 20px;">
                <strong>${isPt ? 'Mensagem do Administrador' : 'Note from App Owner'}:</strong><br/>"${customMessage}"
              </div>
            ` : ''}

            <table style="width: 100%; border-collapse: collapse; font-size: 13px; margin: 16px 0;">
              <tr style="border-bottom: 1px solid #e2e8f0;">
                <td style="padding: 8px 0; font-weight: bold;">${isPt ? 'Itens Conformes' : 'Compliant Items'}:</td>
                <td style="padding: 8px 0; text-align: right; color: #16a34a; font-weight: bold;">${compliantCount}</td>
              </tr>
              <tr style="border-bottom: 1px solid #e2e8f0;">
                <td style="padding: 8px 0; font-weight: bold;">${isPt ? 'Oportunidades de Melhoria' : 'Improvement Needed'}:</td>
                <td style="padding: 8px 0; text-align: right; color: #d97706; font-weight: bold;">${improvementCount}</td>
              </tr>
              <tr style="border-bottom: 1px solid #e2e8f0;">
                <td style="padding: 8px 0; font-weight: bold;">${isPt ? 'Não-Conformidades Detetadas' : 'Non-Compliant Items'}:</td>
                <td style="padding: 8px 0; text-align: right; color: #dc2626; font-weight: bold;">${nonCompliantCount}</td>
              </tr>
            </table>

            ${reportHtml || ''}

            <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 24px 0;" />
            <p style="font-size: 11px; color: #71717a; margin: 0; text-align: center;">
              Enviado automaticamente pela Aplicação IQAS Ergonomia & SST • Cumprimento do Decreto-Lei n.º 349/93
            </p>
          </div>
        </div>
      `;

      let messageId = "";
      let transportUsed = "Mock / Log Preview";

      // If SMTP credentials exist in process.env, attempt real transport
      if (process.env.SMTP_USER && process.env.SMTP_PASS) {
        const transporter = nodemailer.createTransport({
          host: process.env.SMTP_HOST || "smtp.gmail.com",
          port: parseInt(process.env.SMTP_PORT || "587", 10),
          secure: process.env.SMTP_PORT === "465",
          auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
          },
        });

        const info = await transporter.sendMail({
          from: process.env.SMTP_FROM || `"IQAS Ergonomics" <${process.env.SMTP_USER}>`,
          to: emailList,
          subject: emailSubject,
          html: defaultHtml,
        });

        messageId = info.messageId;
        transportUsed = "Live SMTP";
      } else {
        // Log formatted output to server console
        console.log(`\n============================ EMAIL SENT (LOG MODE) ============================`);
        console.log(`To: ${emailList}`);
        console.log(`Subject: ${emailSubject}`);
        console.log(`Employee: ${employeeName || 'All'}`);
        console.log(`Score: ${scorePercent}% | Risk: ${riskLevel}`);
        console.log(`=================================================================================\n`);
        messageId = `log-${Date.now()}`;
      }

      res.json({
        success: true,
        message: isPt
          ? `Relatório enviado com sucesso para ${emailList}!`
          : `Analytics report successfully sent to ${emailList}!`,
        recipients: emailList,
        messageId,
        transportUsed
      });
    } catch (err: any) {
      console.error("Erro no envio de email:", err);
      res.status(500).json({
        error: err.message || "Erro ao enviar o relatório por email."
      });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`IQAS Ergonomics App running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
