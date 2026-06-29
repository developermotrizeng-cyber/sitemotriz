const fs = require('fs');
const path = require('path');

const dumpPath = path.join(__dirname, 'db_content_dump.json');
if (!fs.existsSync(dumpPath)) {
  console.log('Arquivo não encontrado');
  process.exit(1);
}

const data = JSON.parse(fs.readFileSync(dumpPath, 'utf8'));

console.log('=== LISTA DE ARQUIVOS UPADOS ===');
if (data.uploadedFiles) {
  data.uploadedFiles.forEach((file, index) => {
    console.log(`${index}: ID=${file.id}, Nome="${file.name}", Size=${file.size}, Tipo=${file.type}, isBase64=${file.dataUrl.startsWith('data:')}`);
  });
} else {
  console.log('Nenhum arquivo encontrado em uploadedFiles.');
}
