import fs from 'node:fs/promises';
import path from 'node:path';

/**
 * Создаёт index.md в docs/api/ на основе README.md, сгенерированного TypeDoc.
 */
const run = async () => {
  const apiDir = 'docs/api';
  const readmePath = path.join(apiDir, 'README.md');
  const indexPath = path.join(apiDir, 'index.md');

  try {
    const readmeContent = await fs.readFile(readmePath, 'utf8');
    
    // Извлекаем заголовок и контент из README
    const lines = readmeContent.split('\n');
    let title = 'API Документация';
    let contentStart = 0;
    
    // Ищем заголовок
    for (let i = 0; i < lines.length; i++) {
      if (lines[i].startsWith('# ')) {
        title = lines[i].substring(2).trim();
        contentStart = i + 1;
        break;
      }
    }
    
    // Улучшаем заголовок
    if (title === 'admin' || title.toLowerCase().includes('admin')) {
      title = 'API Документация';
    }
    
    // Создаём index.md с правильным заголовком и контентом
    let restContent = lines.slice(contentStart).join('\n');
    
    // Исправляем относительные ссылки на абсолютные для VitePress
    restContent = restContent.replace(/\]\(([^)]+\.md)\)/g, (match, link) => {
      // Если ссылка уже абсолютная, оставляем как есть
      if (link.startsWith('/')) {
        return match;
      }
      // Преобразуем относительные ссылки в абсолютные
      const absoluteLink = link.startsWith('api/') 
        ? `/${link.replace(/\.md$/, '')}`
        : `/api/${link.replace(/\.md$/, '')}`;
      return `](${absoluteLink})`;
    });
    
    const indexContent = `# ${title}\n\nАвтогенерировано из TypeScript кода с помощью TypeDoc.\n\n${restContent}`;
    
    await fs.writeFile(indexPath, indexContent, 'utf8');
    console.log('Created docs/api/index.md');
  } catch (error) {
    console.warn('Could not create api/index.md:', error);
    // Создаём базовый index.md если README не найден
    const basicIndex = `# API Документация\n\nАвтогенерировано из TypeScript кода с помощью TypeDoc.\n`;
    await fs.writeFile(indexPath, basicIndex, 'utf8');
  }
};

run().catch(e => {
  console.error(e);
  process.exit(1);
});

