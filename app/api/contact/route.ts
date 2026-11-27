import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { contarLead } from '@/lib/blog-views';
import { banco } from '@/lib/db';

const ORIGENS: Record<string, string> = {
    instagram: 'Instagram',
    google: 'Google',
    ia: 'IA (ChatGPT, Perplexity e outras)',
    indicacao: 'Indicação',
    linkedin: 'LinkedIn',
    outro: 'Outro',
};

/** Evita que o texto digitado vire HTML no e-mail. */
function escapar(valor: unknown): string {
    return String(valor ?? '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
}

/** Tira quebras de linha e caracteres de controle. É o que impede alguém de "injetar" cabeçalhos ou comandos no e-mail. */
const semControle = (texto: string) => texto.replace(/[\u0000-\u001f\u007f]+/g, ' ').trim();

/** O pedido precisa vir do próprio site. Outro site não consegue usar o formulário pelo navegador de um visitante. */
function vemDoProprioSite(request: Request): boolean {
    const origem = request.headers.get('origin');
    if (!origem) return true; // navegadores sempre mandam em POST; ferramentas de linha de comando não, e para elas valem os limites
    try {
        const pedido = new URL(origem).host;
        const site = request.headers.get('x-forwarded-host') || request.headers.get('host') || '';
        const oficial = new URL(process.env.SITE_URL || 'https://rugemtugem.dev').host;
        return pedido === site || pedido === oficial || pedido === `www.${oficial}`;
    } catch {
        return false;
    }
}

/** No máximo 5 mensagens por hora vindas do mesmo endereço e 40 por hora no total. Sem banco, o formulário segue funcionando. */
function passouDoLimite(request: Request): boolean {
    try {
        const db = banco();
        if (!db) return false;
        const ip = ((request.headers.get('x-forwarded-for') || '').split(',').pop()?.trim() || request.headers.get('x-real-ip') || 'local').slice(0, 64);
        const desde = new Date(Date.now() - 3600e3).toISOString();
        db.prepare('DELETE FROM contato_tentativa WHERE em < ?').run(desde);
        const { n } = db.prepare('SELECT COUNT(*) AS n FROM contato_tentativa WHERE ip = ?').get(ip) as { n: number };
        const { total } = db.prepare('SELECT COUNT(*) AS total FROM contato_tentativa').get() as { total: number };
        if (n >= 5 || total >= 40) return true;
        db.prepare('INSERT INTO contato_tentativa (ip, em) VALUES (?, ?)').run(ip, new Date().toISOString());
        return false;
    } catch {
        return false;
    }
}

export async function POST(request: Request) {
    try {
        // Uma mensagem de contato cabe com folga em 20 KB. Corpo maior é recusado antes de ser lido.
        if (Number(request.headers.get('content-length') || 0) > 20_000) {
            return NextResponse.json({ success: false, message: 'Message too large' }, { status: 413 });
        }
        if (!vemDoProprioSite(request)) {
            return NextResponse.json({ success: false, message: 'Forbidden' }, { status: 403 });
        }
        const body = await request.json();
        if (typeof body !== 'object' || body === null) {
            return NextResponse.json({ success: false, message: 'Missing required fields' }, { status: 400 });
        }
        // Campo-armadilha: fica escondido no formulário, então só robô preenche. A resposta é a de sucesso, para o robô não insistir.
        if (String(body.site ?? '') !== '') {
            return NextResponse.json({ success: true, message: 'Message sent successfully' });
        }
        const whatsapp = semControle(String(body.whatsapp ?? '')).slice(0, 30);
        const nomeCru = semControle(String(body.name ?? '')).slice(0, 100);
        const name = escapar(nomeCru);
        const emailCru = String(body.email ?? '').trim().slice(0, 254);
        const email = escapar(emailCru);
        const mensagemCrua = String(body.message ?? '').replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]+/g, ' ').trim().slice(0, 2000);
        const message = escapar(mensagemCrua);
        // Só as origens da lista entram: "constructor" e afins não são chaves dela.
        const chaveDaOrigem = String(body.origem);
        const origem = Object.hasOwn(ORIGENS, chaveDaOrigem) ? ORIGENS[chaveDaOrigem] : '';

        // Validate fields
        const emailValido = /^[A-Za-z0-9._%+-]{1,64}@[A-Za-z0-9.-]{1,180}\.[A-Za-z]{2,24}$/.test(emailCru);
        const whatsappValido = whatsapp === '' || (/^[0-9+() .-]+$/.test(whatsapp) && whatsapp.replace(/\D/g, '').length >= 10 && whatsapp.replace(/\D/g, '').length <= 15);
        if (nomeCru.length < 2 || mensagemCrua.length < 10 || !origem || !emailValido || !whatsappValido) {
            return NextResponse.json(
                { success: false, message: 'Missing required fields' },
                { status: 400 }
            );
        }
        if (passouDoLimite(request)) {
            return NextResponse.json({ success: false, message: 'Too many messages. Try again later.' }, { status: 429 });
        }

        // Configure SMTP transporter
        const porta = Number(process.env.SMTP_PORT) || 587;
        const transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST || 'mail.rugemtugem.dev',
            port: porta,
            // Porta 465 já começa cifrada. Nas outras, a conexão só segue se o servidor aceitar cifrar (sem isso alguém no caminho poderia tirar a cifra).
            secure: porta === 465,
            requireTLS: porta !== 465,
            auth: {
                user: process.env.SMTP_USER || 'contato@rugemtugem.dev',
                pass: process.env.SMTP_PASS || '',
            },
            tls: {
                // O servidor de e-mail usa hoje um certificado assinado por ele mesmo. Quando tiver um certificado de verdade,
                // ligue a conferência com SMTP_VALIDAR_CERTIFICADO=sim.
                rejectUnauthorized: process.env.SMTP_VALIDAR_CERTIFICADO === 'sim',
            },
        });

        // Send email
        await transporter.sendMail({
            from: `"Site Rugemtugem" <${process.env.SMTP_USER || 'contato@rugemtugem.dev'}>`,
            to: 'contato@rugemtugem.dev',
            replyTo: emailCru,
            subject: `Nova mensagem do site - ${nomeCru.slice(0, 80)}`,
            html: `
                <div style="font-family: 'Segoe UI', Tahoma, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                    <div style="background: linear-gradient(135deg, #992A2B, #ff6b6b); padding: 20px; border-radius: 12px 12px 0 0;">
                        <h2 style="color: white; margin: 0;">📬 Nova mensagem do site</h2>
                    </div>
                    <div style="background: #f9fafb; padding: 24px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 12px 12px;">
                        <p style="margin: 0 0 12px;"><strong>👤 Nome:</strong> ${name}</p>
                        <p style="margin: 0 0 12px;"><strong>📧 Email:</strong> <a href="mailto:${email}">${email}</a></p>
                        ${whatsapp ? `<p style="margin: 0 0 12px;"><strong>📱 WhatsApp:</strong> ${escapar(whatsapp)}</p>` : ''}
                        <p style="margin: 0 0 12px;"><strong>🧭 Como nos conheceu:</strong> ${origem}</p>
                        <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 16px 0;">
                        <p style="margin: 0 0 8px;"><strong>💬 Mensagem:</strong></p>
                        <div style="background: white; padding: 16px; border-radius: 8px; border: 1px solid #e5e7eb; white-space: pre-wrap;">${message}</div>
                    </div>
                    <p style="text-align: center; color: #9ca3af; font-size: 12px; margin-top: 16px;">
                        Enviado via rugemtugem.dev
                    </p>
                </div>
            `,
        });

        // O e-mail saiu: soma o pedido ao painel de métricas (só a contagem e o canal marcado).
        contarLead(chaveDaOrigem);

        return NextResponse.json({
            success: true,
            message: 'Message sent successfully',
        });
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        console.error('Error sending email:', errorMessage);
        return NextResponse.json(
            // O detalhe do erro fica só no registro do servidor: ele traz endereço e resposta do servidor de e-mail.
            { success: false, message: 'Error sending message' },
            { status: 500 }
        );
    }
}
