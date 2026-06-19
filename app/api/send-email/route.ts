import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(req: NextRequest) {
  try {
    const { nome, email, tipoProjeto, mensagem } = await req.json();

    const smtpHost = process.env.SMTP_HOST;
    const smtpPort = Number(process.env.SMTP_PORT) || 587;
    const smtpUser = process.env.SMTP_USER;
    const smtpPass = process.env.SMTP_PASS;
    const smtpSecure = process.env.SMTP_SECURE === 'true' || smtpPort === 465;

    if (!smtpHost || !smtpUser || !smtpPass) {
      return NextResponse.json(
        { error: 'Configuração SMTP não foi definida ou está incompleta no arquivo .env.local do servidor.' },
        { status: 400 }
      );
    }

    // Create nodemailer transporter with direct inputs or environment fallbacks
    const transporter = nodemailer.createTransport({
      host: smtpHost,
      port: smtpPort,
      secure: smtpSecure,
      auth: {
        user: smtpUser,
        pass: smtpPass,
      },
      tls: {
        rejectUnauthorized: false // Helps avoid SSL/TLS verification issues on some webhosts
      }
    });

    const destination = process.env.SMTP_TO || smtpUser;
    const isMfa = tipoProjeto === 'Código MFA';

    // Extrai o código de 6 dígitos se presente na mensagem
    const mfaCodeMatch = mensagem.match(/\b\d{6}\b/);
    const mfaCode = mfaCodeMatch ? mfaCodeMatch[0] : '';

    // Send mail with defined transport object
    const info = await transporter.sendMail({
      from: `"${nome}" <${smtpUser}>`, // authorized sender
      replyTo: isMfa ? undefined : email, // reply to the lead's email
      to: isMfa ? email : destination, // send to user's email if MFA, else to landing page inbox
      subject: isMfa 
        ? `[Motriz Engenharia] Código de Acesso MFA: ${mfaCode}`
        : `[Motriz Engenharia] Novo Contato de ${nome} - ${tipoProjeto}`,
      text: mensagem,
      html: isMfa ? `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 24px; border: 1px solid #E2E8F0; border-radius: 8px; background-color: #ffffff; color: #1a202c;">
          <div style="background-color: #2d3f65; padding: 16px; border-radius: 6px; text-align: center; margin-bottom: 24px;">
            <h1 style="color: #ffffff; font-size: 20px; font-weight: bold; margin: 0; letter-spacing: 1px;">MOTRIZ ENGENHARIA</h1>
            <p style="color: #becee0; font-size: 12px; margin: 4px 0 0 0; text-transform: uppercase; font-family: monospace;">Autenticação de Segurança</p>
          </div>
          
          <h2 style="color: #2d3f65; font-size: 16px; font-weight: bold; margin-bottom: 16px; border-bottom: 1px solid #E2E8F0; padding-bottom: 8px;">Código de Verificação MFA</h2>
          
          <p style="font-size: 14px; color: #4a5568; line-height: 1.6;">
            Olá,<br/><br/>
            Foi solicitada uma tentativa de acesso ao Painel Administrativo da Motriz Engenharia. Utilize o código de verificação temporário de dois fatores abaixo para prosseguir:
          </p>
          
          <div style="text-align: center; margin: 32px 0;">
            <div style="display: inline-block; background-color: #f7fafc; border: 1px solid #cbd5e0; padding: 16px 32px; font-size: 28px; font-weight: bold; letter-spacing: 6px; color: #2d3f65; border-radius: 6px; font-family: monospace;">
              ${mfaCode}
            </div>
          </div>
          
          <p style="font-size: 12px; color: #718096; line-height: 1.6;">
            Este código de verificação expira em 5 minutos. Se você não iniciou esta solicitação, desconsidere este e-mail ou entre em contato com a equipe de TI/Suporte.
          </p>
          
          <div style="font-size: 11px; color: #a0aec0; text-align: center; margin-top: 32px; border-top: 1px solid #E2E8F0; padding-top: 16px;">
            Este é um e-mail automático enviado de forma segura pela Motriz Engenharia.
          </div>
        </div>
      ` : `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 24px; border: 1px solid #E2E8F0; border-radius: 8px; background-color: #ffffff; color: #1a202c;">
          <div style="background-color: #2d3f65; padding: 16px; border-radius: 6px; text-align: center; margin-bottom: 24px;">
            <h1 style="color: #ffffff; font-size: 20px; font-weight: bold; margin: 0; letter-spacing: 1px;">MOTRIZ ENGENHARIA</h1>
            <p style="color: #becee0; font-size: 12px; margin: 4px 0 0 0; text-transform: uppercase; font-family: monospace;">Novo Lead Recebido</p>
          </div>
          
          <h2 style="color: #2d3f65; font-size: 16px; font-weight: bold; margin-bottom: 16px; border-bottom: 1px solid #E2E8F0; padding-bottom: 8px;">Dados do Contato</h2>
          
          <table style="width: 100%; border-collapse: collapse; font-size: 13px; margin-bottom: 24px;">
            <tr>
              <td style="padding: 6px 0; color: #718096; font-weight: bold; width: 150px;">Nome do Cliente:</td>
              <td style="padding: 6px 0; color: #2d3748; font-weight: bold;">${nome}</td>
            </tr>
            <tr>
              <td style="padding: 6px 0; color: #718096; font-weight: bold;">E-mail do Cliente:</td>
              <td style="padding: 6px 0; color: #2d3748;"><a href="mailto:${email}" style="color: #3182ce; text-decoration: none;">${email}</a></td>
            </tr>
            <tr>
              <td style="padding: 6px 0; color: #718096; font-weight: bold;">Tipo de Obra/Projeto:</td>
              <td style="padding: 6px 0; color: #eb8f34; font-weight: bold; text-transform: uppercase; font-size: 11px;">${tipoProjeto}</td>
            </tr>
          </table>
 
          <h2 style="color: #2d3f65; font-size: 16px; font-weight: bold; margin-bottom: 12px; border-bottom: 1px solid #E2E8F0; padding-bottom: 8px;">Mensagem Enviada</h2>
          <div style="background-color: #f7fafc; border-left: 4px solid #2d3f65; padding: 16px; border-radius: 0 4px 4px 0; font-style: italic; font-size: 13px; color: #4a5568; line-height: 1.6; margin-bottom: 24px;">
            "${mensagem.replace(/\n/g, '<br/>')}"
          </div>
 
          <div style="font-size: 11px; color: #a0aec0; text-align: center; margin-top: 32px; border-top: 1px solid #E2E8F0; padding-top: 16px;">
            Este e-mail foi disparado automaticamente via SMTP configurado no painel da Motriz Engenharia.<br/>
            Para responder ao cliente, responda diretamente a este e-mail.
          </div>
        </div>
      `,
    });

    return NextResponse.json({ success: true, messageId: info.messageId });
  } catch (error: any) {
    console.error('SMTP sending error:', error);
    return NextResponse.json(
      { error: error?.message || 'Falha ao enviar e-mail. Por favor, verifique suas configurações de SMTP (Host, Porta, Usuário, Senha).' },
      { status: 500 }
    );
  }
}
