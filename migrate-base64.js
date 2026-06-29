const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

// 1. Carregar variáveis do .env.local
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

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Supabase credentials missing in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Auxiliar para converter data URL para Buffer
function parseDataUrl(dataUrl) {
  if (!dataUrl || !dataUrl.startsWith('data:')) return null;
  try {
    const matches = dataUrl.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
    if (!matches || matches.length !== 3) return null;
    const mimeType = matches[1];
    const base64Data = matches[2];
    const buffer = Buffer.from(base64Data, 'base64');
    
    let ext = 'png';
    if (mimeType.includes('jpeg') || mimeType.includes('jpg')) ext = 'jpg';
    else if (mimeType.includes('gif')) ext = 'gif';
    else if (mimeType.includes('svg')) ext = 'svg';
    else if (mimeType.includes('webp')) ext = 'webp';

    return { mimeType, buffer, ext };
  } catch (e) {
    console.error('Erro ao fazer parse de data URL:', e);
    return null;
  }
}

// Auxiliar para upload no bucket 'media'
async function uploadToStorage(buffer, mimeType, ext, prefix) {
  const fileName = `public/${prefix}-${Date.now()}-${Math.floor(Math.random() * 1000)}.${ext}`;
  try {
    const { data, error } = await supabase.storage
      .from('media')
      .upload(fileName, buffer, {
        contentType: mimeType,
        cacheControl: '31536000', // 1 ano de cache
        upsert: true
      });

    if (error) {
      console.error(`❌ Erro no upload do arquivo ${fileName}:`, error.message);
      return null;
    }

    const { data: publicUrlData } = supabase.storage
      .from('media')
      .getPublicUrl(fileName);

    if (publicUrlData && publicUrlData.publicUrl) {
      console.log(`✅ Upload realizado: ${fileName} -> ${publicUrlData.publicUrl}`);
      return publicUrlData.publicUrl;
    }
  } catch (e) {
    console.error(`❌ Falha inesperada no upload de ${fileName}:`, e);
  }
  return null;
}

async function runMigration() {
  console.log('=== MIGRANDO IMAGENS BASE64 PARA SUPABASE STORAGE ===');

  // Buscar conteúdo do banco
  const { data, error } = await supabase
    .from('site_content')
    .select('content')
    .eq('id', 'motriz_landing_content')
    .maybeSingle();

  if (error) {
    console.error('Erro ao ler conteúdo:', error.message);
    return;
  }

  if (!data || !data.content) {
    console.error('Nenhum conteúdo encontrado para migrar.');
    return;
  }

  const content = JSON.parse(JSON.stringify(data.content)); // clone profundo
  let totalUploaded = 0;

  // 1. Migrar Hero Background
  if (content.hero && content.hero.backgroundUrl && content.hero.backgroundUrl.startsWith('data:')) {
    console.log('Migrando imagem do Hero background...');
    const parsed = parseDataUrl(content.hero.backgroundUrl);
    if (parsed) {
      const url = await uploadToStorage(parsed.buffer, parsed.mimeType, parsed.ext, 'hero-bg');
      if (url) {
        content.hero.backgroundUrl = url;
        totalUploaded++;
      }
    }
  }

  // 2. Migrar About Image
  if (content.about && content.about.imageUrl && content.about.imageUrl.startsWith('data:')) {
    console.log('Migrando imagem do About...');
    const parsed = parseDataUrl(content.about.imageUrl);
    if (parsed) {
      const url = await uploadToStorage(parsed.buffer, parsed.mimeType, parsed.ext, 'about-img');
      if (url) {
        content.about.imageUrl = url;
        totalUploaded++;
      }
    }
  }

  // 3. Migrar Specialties Items Images
  if (content.specialties && Array.isArray(content.specialties.items)) {
    console.log('Verificando imagens de especialidades...');
    for (let i = 0; i < content.specialties.items.length; i++) {
      const item = content.specialties.items[i];
      if (item.image && item.image.startsWith('data:')) {
        console.log(`Migrando imagem de especialidade "${item.title}"...`);
        const parsed = parseDataUrl(item.image);
        if (parsed) {
          const url = await uploadToStorage(parsed.buffer, parsed.mimeType, parsed.ext, `spec-${item.id}`);
          if (url) {
            item.image = url;
            totalUploaded++;
          }
        }
      }
      if (Array.isArray(item.images)) {
        for (let j = 0; j < item.images.length; j++) {
          if (item.images[j] && item.images[j].startsWith('data:')) {
            console.log(`Migrando galeria de especialidade "${item.title}" imagem #${j}...`);
            const parsed = parseDataUrl(item.images[j]);
            if (parsed) {
              const url = await uploadToStorage(parsed.buffer, parsed.mimeType, parsed.ext, `spec-gallery-${item.id}`);
              if (url) {
                item.images[j] = url;
                totalUploaded++;
              }
            }
          }
        }
      }
    }
  }

  // 4. Migrar Partners
  if (content.partners && Array.isArray(content.partners.items)) {
    console.log('Verificando logotipos de parceiros...');
    for (let i = 0; i < content.partners.items.length; i++) {
      const item = content.partners.items[i];
      if (item.logoUrl && item.logoUrl.startsWith('data:')) {
        console.log(`Migrando logotipo do parceiro "${item.name}"...`);
        const parsed = parseDataUrl(item.logoUrl);
        if (parsed) {
          const url = await uploadToStorage(parsed.buffer, parsed.mimeType, parsed.ext, `partner-${item.id}`);
          if (url) {
            item.logoUrl = url;
            totalUploaded++;
          }
        }
      }
    }
  }

  // 5. Migrar Portfolio Items
  if (content.portfolio && Array.isArray(content.portfolio.items)) {
    console.log('Verificando imagens do portfolio...');
    for (let i = 0; i < content.portfolio.items.length; i++) {
      const item = content.portfolio.items[i];
      if (item.image && item.image.startsWith('data:')) {
        console.log(`Migrando imagem principal do portfólio "${item.title}"...`);
        const parsed = parseDataUrl(item.image);
        if (parsed) {
          const url = await uploadToStorage(parsed.buffer, parsed.mimeType, parsed.ext, `portfolio-${item.id}`);
          if (url) {
            item.image = url;
            totalUploaded++;
          }
        }
      }
      if (Array.isArray(item.images)) {
        for (let j = 0; j < item.images.length; j++) {
          if (item.images[j] && item.images[j].startsWith('data:')) {
            console.log(`Migrando imagem da galeria do portfólio "${item.title}" #${j}...`);
            const parsed = parseDataUrl(item.images[j]);
            if (parsed) {
              const url = await uploadToStorage(parsed.buffer, parsed.mimeType, parsed.ext, `portfolio-gallery-${item.id}`);
              if (url) {
                item.images[j] = url;
                totalUploaded++;
              }
            }
          }
        }
      }
    }
  }

  // 6. Migrar uploadedFiles biblioteca
  if (content.uploadedFiles && Array.isArray(content.uploadedFiles)) {
    console.log('Verificando biblioteca de mídias...');
    for (let i = 0; i < content.uploadedFiles.length; i++) {
      const file = content.uploadedFiles[i];
      if (file.dataUrl && file.dataUrl.startsWith('data:')) {
        console.log(`Migrando arquivo de biblioteca "${file.name}"...`);
        const parsed = parseDataUrl(file.dataUrl);
        if (parsed) {
          const url = await uploadToStorage(parsed.buffer, parsed.mimeType, parsed.ext, `lib-file-${file.id}`);
          if (url) {
            file.dataUrl = url;
            file.name = `${file.name.replace(' (Compactado local)', '')} (Nuvem)`;
            totalUploaded++;
          }
        }
      }
    }
  }

  if (totalUploaded > 0) {
    console.log(`\nSalvando as alterações no banco de dados Supabase...`);
    const { error: upsertErr } = await supabase
      .from('site_content')
      .upsert({ id: 'motriz_landing_content', content });

    if (upsertErr) {
      console.error('❌ Erro ao salvar alterações no Supabase:', upsertErr.message);
      return;
    }

    console.log('✅ Alterações persistidas no banco com sucesso!');
    console.log(`Total de arquivos base64 migrados: ${totalUploaded}`);

    // Escrever arquivo de backup com o JSON otimizado
    fs.writeFileSync(
      path.join(__dirname, 'optimized_db_content.json'),
      JSON.stringify(content, null, 2),
      'utf8'
    );
    console.log('Cópia otimizada salva em optimized_db_content.json');
    
    // Atualizar lib/defaultData.ts com os novos defaults
    console.log('\nAtualizando o defaultData.ts com o novo conteúdo otimizado...');
    updateDefaultDataFile(content);
  } else {
    console.log('Nenhuma imagem base64 encontrada para migrar.');
  }
}

function updateDefaultDataFile(optimizedContent) {
  const filePath = path.join(__dirname, 'lib', 'defaultData.ts');
  if (!fs.existsSync(filePath)) {
    console.error('lib/defaultData.ts não encontrado!');
    return;
  }

  let code = fs.readFileSync(filePath, 'utf8');
  
  // Localizar a exportação de defaultSiteContent e substituí-la
  const startKeyword = 'export const defaultSiteContent: SiteContent =';
  const startIndex = code.indexOf(startKeyword);
  if (startIndex === -1) {
    console.error('Não foi possível localizar defaultSiteContent no arquivo defaultData.ts');
    return;
  }

  // Pegamos a primeira parte do arquivo (as interfaces)
  const interfacesPart = code.substring(0, startIndex);
  
  // Formatamos o conteúdo otimizado
  const formattedContent = `${startKeyword} ${JSON.stringify(optimizedContent, null, 2)};\n`;
  
  // Sobrescrever o arquivo defaultData.ts
  fs.writeFileSync(filePath, interfacesPart + formattedContent, 'utf8');
  console.log('✅ Arquivo defaultData.ts atualizado com sucesso!');
}

runMigration();
