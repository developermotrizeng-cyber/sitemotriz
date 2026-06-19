import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(req: NextRequest) {
  try {
    const { 
      nome, 
      email, 
      telefone, 
      vaga, 
      pretensao, 
      linkedin, 
      mensagem, 
      curriculoNome, 
      curriculoData,
      curriculoTipo,
      careersEmail
    } = await req.json();

    const smtpHost = process.env.SMTP_HOST;
    const smtpPort = Number(process.env.SMTP_PORT) || 587;
    const smtpUser = process.env.SMTP_USER;
    const smtpPass = process.env.SMTP_PASS;
    const smtpSecure = process.env.SMTP_SECURE === 'true' || smtpPort === 465;

    if (!smtpHost || !smtpUser || !smtpPass) {
      const missing = [];
      if (!smtpHost) missing.push('SMTP_HOST');
      if (!smtpUser) missing.push('SMTP_USER');
      if (!smtpPass) missing.push('SMTP_PASS');
      return NextResponse.json(
        { error: `Configuração SMTP incompleta no servidor. Variáveis faltando: ${missing.join(', ')}` },
        { status: 400 }
      );
    }

    // Create nodemailer transporter
    const transporter = nodemailer.createTransport({
      host: smtpHost,
      port: smtpPort,
      secure: smtpSecure,
      auth: {
        user: smtpUser,
        pass: smtpPass,
      },
      tls: {
        rejectUnauthorized: false
      }
    });

    const destination = careersEmail || process.env.SMTP_TO || smtpUser;

    // Compile attachments array if actual file data is provided
    const attachments = [];
    if (curriculoData && typeof curriculoData === 'string' && curriculoData.includes(';base64,')) {
      try {
        const parts = curriculoData.split(';base64,');
        const base64Content = parts[1];
        const inferredType = parts[0].split(':')[1] || curriculoTipo || 'application/octet-stream';
        attachments.push({
          filename: curriculoNome || 'curriculo.pdf',
          content: base64Content,
          encoding: 'base64',
          contentType: inferredType
        });
      } catch (attachError) {
        console.error('Error compiling email attachments:', attachError);
      }
    }

    const info = await transporter.sendMail({
      from: `"${nome} (Candidato)" <${smtpUser}>`,
      replyTo: email,
      to: destination,
      subject: `[RH Motriz] Novo Currículo Recebido: ${nome} - ${vaga.replace(/_/g, ' ')}`,
      attachments,
      text: `Nova candidatura recebida pelo Trabalhe Conosco:\n\nNome: ${nome}\nE-mail: ${email}\nTelefone: ${telefone}\nCargo: ${vaga.replace(/_/g, ' ')}\nPretensão Salarial: R$ ${pretensao || 'Não informada'}\nLinkedIn/Portfólio: ${linkedin || 'Não informado'}\nArquivo de Currículo: ${curriculoNome || 'Não anexado'}\n\nApresentação:\n${mensagem || 'Sem mensagem'}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 24px; border: 1px solid #E2E8F0; border-radius: 8px; background-color: #ffffff; color: #1a202c;">
          <div style="background-color: #2d3f65; padding: 16px; border-radius: 6px; text-align: center; margin-bottom: 24px;">
            <h1 style="color: #ffffff; font-size: 20px; font-weight: bold; margin: 0; letter-spacing: 1px;">MOTRIZ ENGENHARIA</h1>
            <p style="color: #becee0; font-size: 12px; margin: 4px 0 0 0; text-transform: uppercase; font-family: monospace;">Gestão de Pessoas & Talentos (RH)</p>
          </div>
          
          <h2 style="color: #2d3f65; font-size: 16px; font-weight: bold; margin-bottom: 16px; border-bottom: 1px solid #E2E8F0; padding-bottom: 8px;">Dados do Candidato</h2>
          
          <table style="width: 100%; border-collapse: collapse; font-size: 13px; margin-bottom: 24px;">
            <tr>
              <td style="padding: 6px 0; color: #718096; font-weight: bold; width: 150px;">Nome:</td>
              <td style="padding: 6px 0; color: #2d3748; font-weight: bold;">${nome}</td>
            </tr>
            <tr>
              <td style="padding: 6px 0; color: #718096; font-weight: bold;">E-mail:</td>
              <td style="padding: 6px 0; color: #2d3748;"><a href="mailto:${email}" style="color: #3182ce; text-decoration: none;">${email}</a></td>
            </tr>
            <tr>
              <td style="padding: 6px 0; color: #718096; font-weight: bold;">Telefone:</td>
              <td style="padding: 6px 0; color: #2d3748;">${telefone}</td>
            </tr>
            <tr>
              <td style="padding: 6px 0; color: #718096; font-weight: bold;">Vaga de Interesse:</td>
              <td style="padding: 6px 0; color: #1a4f91; font-weight: bold; text-transform: uppercase; font-size: 11px;">${vaga.replace(/_/g, ' ')}</td>
            </tr>
            <tr>
              <td style="padding: 6px 0; color: #718096; font-weight: bold;">Pretensão Salarial:</td>
              <td style="padding: 6px 0; color: #276749; font-weight: bold;">${pretensao ? `R$ ${pretensao}` : 'Não informada'}</td>
            </tr>
            <tr>
              <td style="padding: 6px 0; color: #718096; font-weight: bold;">LinkedIn/Portfólio:</td>
              <td style="padding: 6px 0; color: #2d3748;">
                ${linkedin ? `<a href="${linkedin}" target="_blank" style="color: #3182ce; text-decoration: none; font-weight: bold;">Ver Perfil ↗</a>` : '<span style="color: #a0aec0;">Não informado</span>'}
              </td>
            </tr>
            <tr>
              <td style="padding: 6px 0; color: #718096; font-weight: bold;">Arquivo de Currículo:</td>
              <td style="padding: 6px 0; color: #2d3748; font-family: monospace; font-size: 12px; color: #e53e3e; font-weight: bold;">
                📄 ${curriculoNome || 'Anexo Virtual'}
              </td>
            </tr>
          </table>

          <h3 style="color: #2d3f65; font-size: 14px; font-weight: bold; margin-bottom: 12px; border-bottom: 1px solid #E2E8F0; padding-bottom: 6px;">Carta de Apresentação / Resumo Profissional</h3>
          <div style="background-color: #f7fafc; border-left: 4px solid #2d3f65; padding: 14px; border-radius: 0 4px 4px 0; font-style: italic; font-size: 13px; color: #4a5568; line-height: 1.6; margin-bottom: 24px;">
            "${mensagem ? mensagem.replace(/\n/g, '<br/>') : 'O candidato não enviou uma mensagem de apresentação.'}"
          </div>

          <p style="font-size: 11px; color: #e53e3e; background-color: #fffaf0; border: 1px dashed #fbd38d; padding: 10px; border-radius: 4px; line-height: 1.4;">
            <strong>Nota do Sistema:</strong> Como se trata de um banco de talentos estático em ambiente de demonstração, o arquivo físico anexado está disponível para análise técnica detalhada no <strong>Portal do Administrador</strong>.
          </p>

          <div style="font-size: 11px; color: #a0aec0; text-align: center; margin-top: 32px; border-top: 1px solid #E2E8F0; padding-top: 16px;">
            Este e-mail foi disparado automaticamente via SMTP configurado no painel da Motriz Engenharia.<br/>
            Para responder ao candidato, responda diretamente a este e-mail do processo seletivo.
          </div>
        </div>
      `,
    });

    return NextResponse.json({ success: true, messageId: info.messageId });
  } catch (error: any) {
    console.error('SMTP sending error for candidacy:', error);
    // Even if email sending fails, we return partial success if it's logged locally,
    // but we can give a descriptive message or fail. Let's return the error so they know it failed.
    return NextResponse.json(
      { error: error?.message || 'Falha ao enviar e-mail automático para o RH. A candidatura continua salva localmente.' },
      { status: 500 }
    );
  }
}
