// Патч для обхода проблемы с node:sea на Windows
const fs = require('fs');
const path = require('path');

const externalsFile = path.join(__dirname, 'node_modules', '@expo', 'cli', 'src', 'start', 'server', 'metro', 'externals.ts');

if (fs.existsSync(externalsFile)) {
  let content = fs.readFileSync(externalsFile, 'utf8');
  
  // Заменяем проблемную строку с node:sea на node_sea
  if (content.includes('node:sea')) {
    content = content.replace(/node:sea/g, 'node_sea');
    fs.writeFileSync(externalsFile, content, 'utf8');
    console.log('✓ Патч применен: node:sea заменен на node_sea');
  } else {
    console.log('✓ Файл уже исправлен или не содержит node:sea');
  }
} else {
  console.log('⚠ Файл externals.ts не найден');
}

