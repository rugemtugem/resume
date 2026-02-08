import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { name, email, whatsapp, message, to } = body;

        // Log the contact form submission
        console.log('Contact form submission:', {
            name,
            email,
            whatsapp,
            message,
            to
        });

        // TODO: Implement actual email sending service
        // You can use services like:
        // - Resend (https://resend.com)
        // - SendGrid
        // - Nodemailer with SMTP
        // - AWS SES

        // For now, we'll simulate success
        // In production, you would send the email here

        /*
        Example with Resend:
        
        import { Resend } from 'resend';
        const resend = new Resend(process.env.RESEND_API_KEY);

        await resend.emails.send({
            from: 'Portfolio <noreply@yourdomain.com>',
            to: to,
            subject: `Nova mensagem de ${name}`,
            html: `
                <h2>Nova mensagem do formulário de contato</h2>
                <p><strong>Nome:</strong> ${name}</p>
                <p><strong>Email:</strong> ${email}</p>
                <p><strong>WhatsApp:</strong> ${whatsapp}</p>
                <p><strong>Mensagem:</strong></p>
                <p>${message}</p>
            `
        });
        */

        return NextResponse.json({
            success: true,
            message: 'Message received successfully'
        });

    } catch (error) {
        console.error('Error processing contact form:', error);
        return NextResponse.json(
            { success: false, message: 'Error processing request' },
            { status: 500 }
        );
    }
}
