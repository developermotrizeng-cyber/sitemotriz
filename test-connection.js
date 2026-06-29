const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');
const nodemailer = require('nodemailer');

console.log('=== TESTE DE CONEXÃO DO PROJETO ===\n');

// 1. Carregar variáveis de ambiente do .env.local manualmente
const envPath = path.join(__dirname, '.env.local');
if (fs.existsSync(envPath)) {
  console.log('Carregando variáveis de .env.local...');
  const envContent = fs.readFileSync(envPath, 'utf8');
  envContent.split('\n').forEach(line => {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) return;
    const parts = trimmed.split('=');
    if (parts.length >= 2) {
      const key = parts[0].trim();
      let val = parts.slice(1).join('=').trim();
      // Remover aspas duplas ou simples se existirem
      if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
        val = val.slice(1, -1);
      }
      process.env[key] = val;
    }
  });
} else {
  console.warn('⚠️ Arquivo .env.local não encontrado! Usando variáveis de ambiente existentes.');
}

// 2. Verificar conexão com o Supabase
async function checkSupabase() {
  console.log('\n--- VERIFICANDO SUPABASE ---');
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  console.log('Supabase URL:', supabaseUrl);
  console.log('Chave Anon configurada:', supabaseAnonKey ? 'Sim (mascarada: ' + supabaseAnonKey.substring(0, 5) + '...)' : 'Não');

  if (!supabaseUrl || !supabaseAnonKey) {
    console.error('❌ Configurações do Supabase ausentes no .env.local!');
    return false;
  }

  try {
    const supabase = createClient(supabaseUrl, supabaseAnonKey);
    
    // Tenta ler a tabela site_content
    const { data, error } = await supabase
      .from('site_content')
      .select('id')
      .limit(1);

    if (error) {
      console.error('❌ Erro ao consultar a tabela "site_content":', error.message);
      return false;
    } else {
      console.log('✅ Supabase conectado com sucesso! Tabela "site_content" acessível.');
      console.log('Resultado da consulta:', data);
      return true;
    }
  } catch (err) {
    console.error('❌ Erro inesperado ao conectar ao Supabase:', err.message || err);
    return false;
  }
}

// 3. Verificar conexão com SMTP/Nodemailer
async function checkSMTP() {
  console.log('\n--- VERIFICANDO SMTP / E-MAIL ---');
  const host = process.env.SMTP_HOST;
  const port = process.env.SMTP_PORT;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const secure = process.env.SMTP_SECURE === 'true';

  console.log('SMTP Host:', host);
  console.log('SMTP Port:', port);
  console.log('SMTP User:', user);
  console.log('SMTP Senha configurada:', pass ? 'Sim' : 'Não');
  console.log('SMTP Seguro (SSL/TLS):', secure);

  if (!host || !user || !pass) {
    console.warn('⚠️ Configurações de SMTP incompletas no .env.local. Pulando teste de e-mail.');
    return false;
  }

  try {
    const transporter = nodemailer.createTransport({
      host,
      port: parseInt(port || '587', 10),
      secure,
      auth: {
        user,
        pass,
      },
      connectionTimeout: 5000,
      greetingTimeout: 5000,
    });

    await transporter.verify();
    console.log('✅ Servidor de e-mail SMTP verificado e autenticado com sucesso!');
    return true;
  } catch (err) {
    console.error('❌ Falha na autenticação/conexão com o servidor SMTP:', err.message || err);
    return false;
  }
}

// Executar testes
async function run() {
  const supabaseOk = await checkSupabase();
  const smtpOk = await checkSMTP();
  
  console.log('\n=== RESUMO DOS TESTES ===');
  console.log(`Supabase Database: ${supabaseOk ? '✅ OK' : '❌ FALHOU'}`);
  console.log(`SMTP E-mail Server: ${smtpOk ? '✅ OK' : '❌ FALHOU'}`);
  
  if (supabaseOk && smtpOk) {
    console.log('\n🎉 Todas as conexões do projeto estão OK!');
  } else {
    console.log('\n⚠️ Algumas conexões falharam. Verifique os erros acima ou as credenciais no arquivo .env.local.');
  }
}

run();
