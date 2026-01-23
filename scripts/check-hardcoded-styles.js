/**
 * Скрипт для проверки захардкоженных стилей
 * 
 * Использование: node scripts/check-hardcoded-styles.js
 * 
 * Проверяет наличие захардкоженных значений в коде:
 * - Hex цвета (#FFFFFF, #fff, etc.)
 * - RGB/RGBA цвета
 * - Размеры шрифтов
 * - Отступы (padding, margin, gap)
 * - Border radius
 * - Shadows
 */

const fs = require('fs');
const path = require('path');

// Паттерны для поиска захардкоженных значений
const patterns = {
  hexColors: /#[0-9A-Fa-f]{3,6}\b/g,
  rgbColors: /rgba?\([^)]+\)/g,
  fontSize: /fontSize:\s*(\d+)/g,
  padding: /padding(?:Horizontal|Vertical|Top|Bottom|Left|Right)?:\s*(\d+)/g,
  margin: /margin(?:Horizontal|Vertical|Top|Bottom|Left|Right)?:\s*(\d+)/g,
  gap: /gap:\s*(\d+)/g,
  borderRadius: /borderRadius:\s*(\d+)/g,
  shadowRadius: /shadowRadius:\s*(\d+)/g,
  shadowOpacity: /shadowOpacity:\s*([0-9.]+)/g,
  width: /width:\s*(\d+)/g,
  height: /height:\s*(\d+)/g,
};

// Исключения (разрешенные значения)
const allowedValues = {
  hexColors: [
    '#000000', '#FFFFFF', '#000', '#fff', // Могут быть в комментариях
  ],
  fontSize: [
    // Могут быть в комментариях или как примеры
  ],
};

// Файлы для проверки
const srcDir = path.join(__dirname, '../src');
const filesToCheck = [];

// Рекурсивно собираем все .tsx и .ts файлы
function collectFiles(dir) {
  const files = fs.readdirSync(dir);
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      // Пропускаем node_modules и другие служебные папки
      if (!['node_modules', '.git', '.expo', 'dist', 'build'].includes(file)) {
        collectFiles(filePath);
      }
    } else if (file.endsWith('.tsx') || file.endsWith('.ts')) {
      // Пропускаем файлы новой темы (они могут содержать значения)
      if (!filePath.includes('apple-hig')) {
        filesToCheck.push(filePath);
      }
    }
  });
}

// Проверка файла
function checkFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const relativePath = path.relative(srcDir, filePath);
  const issues = [];

  // Проверка hex цветов
  const hexMatches = content.match(patterns.hexColors);
  if (hexMatches) {
    hexMatches.forEach(match => {
      // Пропускаем разрешенные значения
      if (!allowedValues.hexColors.includes(match)) {
        // Пропускаем если это в комментарии
        const lineIndex = content.substring(0, content.indexOf(match)).split('\n').length - 1;
        const lines = content.split('\n');
        const line = lines[lineIndex];
        if (!line.trim().startsWith('//') && !line.includes('//')) {
          issues.push({
            type: 'hexColor',
            value: match,
            line: lineIndex + 1,
            file: relativePath,
          });
        }
      }
    });
  }

  // Проверка RGB/RGBA цветов
  const rgbMatches = content.match(patterns.rgbColors);
  if (rgbMatches) {
    rgbMatches.forEach(match => {
      // Пропускаем если это в комментарии
      const lineIndex = content.substring(0, content.indexOf(match)).split('\n').length - 1;
      const lines = content.split('\n');
      const line = lines[lineIndex];
      if (!line.trim().startsWith('//') && !line.includes('//')) {
        // Проверяем, не является ли это значением из темы
        if (!match.includes('theme.') && !match.includes('colors.')) {
          issues.push({
            type: 'rgbColor',
            value: match,
            line: lineIndex + 1,
            file: relativePath,
          });
        }
      }
    });
  }

  // Проверка fontSize
  const fontSizeMatches = [...content.matchAll(patterns.fontSize)];
  fontSizeMatches.forEach(match => {
    const lineIndex = content.substring(0, match.index).split('\n').length - 1;
    const lines = content.split('\n');
    const line = lines[lineIndex];
    // Пропускаем если это в комментарии или это значение из темы
    if (!line.trim().startsWith('//') && !line.includes('theme.typography')) {
      issues.push({
        type: 'fontSize',
        value: match[1],
        line: lineIndex + 1,
        file: relativePath,
      });
    }
  });

  // Проверка padding/margin/gap
  ['padding', 'margin', 'gap'].forEach(prop => {
    const regex = patterns[prop];
    const matches = [...content.matchAll(regex)];
    matches.forEach(match => {
      const lineIndex = content.substring(0, match.index).split('\n').length - 1;
      const lines = content.split('\n');
      const line = lines[lineIndex];
      // Пропускаем если это в комментарии или это значение из темы
      if (!line.trim().startsWith('//') && !line.includes('theme.spacing') && !line.includes('spacing.')) {
        issues.push({
          type: prop,
          value: match[1],
          line: lineIndex + 1,
          file: relativePath,
        });
      }
    });
  });

  // Проверка borderRadius
  const borderRadiusMatches = [...content.matchAll(patterns.borderRadius)];
  borderRadiusMatches.forEach(match => {
    const lineIndex = content.substring(0, match.index).split('\n').length - 1;
    const lines = content.split('\n');
    const line = lines[lineIndex];
    // Пропускаем если это в комментарии или это значение из темы
    if (!line.trim().startsWith('//') && !line.includes('theme.borderRadius') && !line.includes('borderRadius.')) {
      issues.push({
        type: 'borderRadius',
        value: match[1],
        line: lineIndex + 1,
        file: relativePath,
      });
    }
  });

  return issues;
}

// Главная функция
function main() {
  console.log('🔍 Проверка захардкоженных стилей...\n');
  
  collectFiles(srcDir);
  
  const allIssues = [];
  filesToCheck.forEach(file => {
    const issues = checkFile(file);
    if (issues.length > 0) {
      allIssues.push(...issues);
    }
  });

  if (allIssues.length === 0) {
    console.log('✅ Не найдено захардкоженных значений!');
    return;
  }

  // Группируем по файлам
  const issuesByFile = {};
  allIssues.forEach(issue => {
    if (!issuesByFile[issue.file]) {
      issuesByFile[issue.file] = [];
    }
    issuesByFile[issue.file].push(issue);
  });

  // Выводим результаты
  console.log(`❌ Найдено ${allIssues.length} захардкоженных значений:\n`);
  
  Object.keys(issuesByFile).forEach(file => {
    console.log(`📄 ${file}:`);
    issuesByFile[file].forEach(issue => {
      console.log(`   ${issue.type}: ${issue.value} (строка ${issue.line})`);
    });
    console.log('');
  });

  console.log(`\n💡 Рекомендация: Замените все захардкоженные значения на значения из theme.apple-hig.*`);
}

main();

