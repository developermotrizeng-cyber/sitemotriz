const fs = require('fs');
const path = require('path');

const dumpPath = path.join(__dirname, 'db_content_dump.json');
if (!fs.existsSync(dumpPath)) {
  console.log('Arquivo db_content_dump.json não encontrado!');
  process.exit(1);
}

const raw = fs.readFileSync(dumpPath, 'utf8');
const data = JSON.parse(raw);

console.log('=== ANALISANDO TAMANHO DAS CHAVES NO JSON ===');
console.log(`Tamanho total do arquivo: ${(raw.length / (1024 * 1024)).toFixed(2)} MB`);

// Analisar chaves principais
for (const key in data) {
  const content = JSON.stringify(data[key]);
  console.log(`- Chave "${key}": ${(content.length / 1024).toFixed(2)} KB (${(content.length / (1024 * 1024)).toFixed(2)} MB)`);
  
  if (typeof data[key] === 'object' && data[key] !== null) {
    // Analisar subchaves se for objeto
    for (const subkey in data[key]) {
      const subcontent = JSON.stringify(data[key][subkey]);
      if (subcontent.length > 50 * 1024) { // mais de 50 KB
        console.log(`  └ Subchave "${subkey}": ${(subcontent.length / 1024).toFixed(2)} KB (${(subcontent.length / (1024 * 1024)).toFixed(2)} MB)`);
      }
    }
  }
}
