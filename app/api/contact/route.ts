import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { name, email, whatsapp, message } = body;

        // Validate fields
        if (!name || !email || !message) {
            return NextResponse.json(
                { success: false, message: 'Missing required fields' },
                { status: 400 }
            );
        }

        // Configure SMTP transporter
        const transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST || 'mail.rugemtugem.dev',
            port: Number(process.env.SMTP_PORT) || 587,
            secure: false,
            auth: {
                user: process.env.SMTP_USER || 'contato@rugemtugem.dev',
                pass: process.env.SMTP_PASS || '',
            },
            tls: {
                rejectUnauthorized: false,
            },
        });

        // Send email
        await transporter.sendMail({
            from: `"Portfolio Ferrugem" <${process.env.SMTP_USER || 'contato@rugemtugem.dev'}>`,
            to: 'contato@rugemtugem.dev',
            replyTo: email,
            subject: `Nova mensagem do Portfolio - ${name}`,
            html: `
                <div style="font-family: 'Segoe UI', Tahoma, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                    <div style="background: linear-gradient(135deg, #992A2B, #ff6b6b); padding: 20px; border-radius: 12px 12px 0 0;">
                        <h2 style="color: white; margin: 0;">📬 Nova mensagem do Portfolio</h2>
                    </div>
                    <div style="background: #f9fafb; padding: 24px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 12px 12px;">
                        <p style="margin: 0 0 12px;"><strong>👤 Nome:</strong> ${name}</p>
                        <p style="margin: 0 0 12px;"><strong>📧 Email:</strong> <a href="mailto:${email}">${email}</a></p>
                        ${whatsapp ? `<p style="margin: 0 0 12px;"><strong>📱 WhatsApp:</strong> ${whatsapp}</p>` : ''}
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

        return NextResponse.json({
            success: true,
            message: 'Message sent successfully',
        });
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        console.error('Error sending email:', errorMessage);
        return NextResponse.json(
            { success: false, message: `Error sending message: ${errorMessage}` },
            { status: 500 }
        );
    }
}
