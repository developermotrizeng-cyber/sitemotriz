const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

// Carregar variáveis do .env.local
const envPath = path.join(__dirname, '.env.local');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  envContent.split('\n').forEach(line => {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) return;
    const parts = trimmed.split('=');
    if (parts.length >= 2) {
      const key = parts[0].trim();
      let val = parts.slice(1).join('=').trim();
      if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
        val = val.slice(1, -1);
      }
      process.env[key] = val;
    }
  });
}

async function dump() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const supabase = createClient(supabaseUrl, supabaseAnonKey);

  const { data, error } = await supabase
    .from('site_content')
    .select('content')
    .eq('id', 'motriz_landing_content')
    .maybeSingle();

  if (error) {
    console.error('Erro ao consultar Supabase:', error.message);
    return;
  }

  if (data && data.content) {
    console.log('CONTEÚDO RECUPERADO COM SUCESSO!');
    fs.writeFileSync(
      path.join(__dirname, 'db_content_dump.json'),
      JSON.stringify(data.content, null, 2),
      'utf8'
    );
    console.log('Salvo em db_content_dump.json');
  } else {
    console.log('Nenhum conteúdo encontrado ou tabela vazia.');
  }
}

dump();
