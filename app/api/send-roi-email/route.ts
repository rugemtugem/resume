import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      nome, 
      email, 
      pdfBase64,
      custoMensal,
      economia70,
      roi12meses
    } = body;

    // Remove the data URI prefix if present (e.g. "data:application/pdf;base64,...")
    const base64Data = pdfBase64.replace(/^data:application\/pdf;base64,/, "");

    // Buffer da string Base64 do PDF (Gerado pelo Client-Side)
    const pdfBuffer = Buffer.from(base64Data, 'base64');

    // Configuração do Transporte SMTP
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.example.com',
      port: Number(process.env.SMTP_PORT) || 465,
      secure: Number(process.env.SMTP_PORT) === 465, // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USER || 'contato@seusite.com',
        pass: process.env.SMTP_PASS || 'suasenha',
      },
    });

    // Enviar por email com Nodemailer
    await transporter.sendMail({
      from: process.env.SMTP_FROM || '"Fábio Soares" <contato@rugemtugem.dev>',
      to: email, 
      subject: `${nome}, sua análise de ROI está pronta!`,
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
          <h2>Olá, ${nome}!</h2>
          <p>Sua análise executiva e personalizada de ROI + Plano de Automação está pronta.</p>
          <div style="background-color: #f7fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p><strong>🔥 Resumo do seu Vazamento Operacional:</strong></p>
            <ul style="list-style-type: none; padding-left: 0;">
              <li style="margin-bottom: 10px;">❌ Você está perdendo <b>${custoMensal}</b> por mês em processos manuais (incluindo custo de oportunidade).</li>
              <li style="margin-bottom: 10px;">✅ Seu potencial de economia é de <b>${economia70}</b> por mês com a automação de 80% disso.</li>
              <li>🚀 Com um investimento médio de mercado, seu ROI estimado é de <b>+${roi12meses}% em 12 meses</b>.</li>
            </ul>
          </div>
          <p>Veja o relatório estratégico detalhado de 6 páginas em anexo a este e-mail.</p>
          <hr style="border: none; border-top: 1px solid #eaeaea; margin: 30px 0;" />
          <p style="font-size: 18px; font-weight: bold;">Pare de perder dinheiro hoje mesmo.</p>
          <p>Ofereço um bate-papo inicial de 30 minutos, 100% gratuito e sem compromisso, para traçar o mapa mental dos seus principais gargalos.</p>
          <p>
            <a href="https://wa.me/5511986514401?text=Oi%20F%C3%A1bio!%20Li%20seu%20relat%C3%B3rio%20de%20ROI%20e%20quero%20agendar%20os%2030%20minutos%20gratuitos." style="display: inline-block; background-color: #48bb78; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; margin-top: 10px;">
              Agendar Mentoria Rápida (WhatsApp)
            </a>
          </p>
          <br>
          <p style="font-size: 13px; color: #718096; margin-top: 40px;">
            Fábio Soares | Tech Lead & Especialista em Automação<br>
            rugemtugem.dev
          </p>
        </div>
      `,
      attachments: [
        {
          filename: `Analise-ROI-${nome.replace(/\s/g, '-')}.pdf`,
          content: pdfBuffer,
          contentType: 'application/pdf'
        }
      ]
    });

    return NextResponse.json({ 
      success: true, 
      message: 'PDF enviado com sucesso via SMTP!' 
    });

  } catch (error) {
    console.error('Erro ao enviar email via SMTP:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Erro ao enviar o relatório SMTP. Verifique as credenciais.' 
    }, { status: 500 });
  }
}
