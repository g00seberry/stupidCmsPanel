import fs from 'node:fs/promises';
import path from 'node:path';
import { globby } from 'globby';

/**
 * Преобразует относительные ссылки в абсолютные для VitePress.
 * @param content Содержимое Markdown файла.
 * @param currentDir Текущая директория относительно docs/api.
 * @returns Контент с исправленными ссылками.
 */
const fixLinks = (content: string, currentDir: string): string => {
  // Вычисляем путь относительно docs/api
  const relativePath = path.relative('docs/api', currentDir);
  const depth = relativePath.split(path.sep).filter(p => p !== '.').length;
  
  return content.replace(/\]\(([^)]+\.md)\)/g, (match, link) => {
    // Если ссылка уже абсолютная, оставляем как есть
    if (link.startsWith('/')) {
      return match;
    }
    
    // Обрабатываем относительные ссылки
    let absoluteLink = link;
    
    // Если ссылка начинается с ../, это относительный путь вверх
    if (link.startsWith('../')) {
      const upLevels = (link.match(/\.\.\//g) || []).length;
      const targetDepth = Math.max(0, depth - upLevels);
      const linkPath = link.replace(/\.\.\//g, '');
      const parts: string[] = [];
      for (let i = 0; i < targetDepth; i++) {
        parts.push('..');
      }
      if (linkPath) {
        parts.push(linkPath.replace(/\.md$/, ''));
      }
      absoluteLink = `/api/${parts.join('/')}`;
    } else if (link.startsWith('./')) {
      // Ссылка в текущей директории
      const linkPath = link.replace(/^\.\//, '').replace(/\.md$/, '');
      const dirParts = relativePath.split(path.sep).filter(p => p !== '.');
      absoluteLink = `/api/${[...dirParts, linkPath].join('/')}`;
    } else {
      // Ссылка в текущей директории без ./
      const linkPath = link.replace(/\.md$/, '');
      const dirParts = relativePath.split(path.sep).filter(p => p !== '.');
      absoluteLink = `/api/${[...dirParts, linkPath].join('/')}`;
    }
    
    return `](${absoluteLink})`;
  });
};

/**
 * Создаёт index.md из README.md для указанной директории.
 * @param readmePath Путь к README.md файлу.
 * @param apiDir Базовая директория API (docs/api).
 */
const createIndexFromReadme = async (readmePath: string, apiDir: string) => {
  try {
    const readmeContent = await fs.readFile(readmePath, 'utf8');
    const dir = path.dirname(readmePath);
    const indexPath = path.join(dir, 'index.md');
    
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
    if (title === 'admin' || title.toLowerCase().includes('admin') || title.includes('/')) {
      // Для главного index.md используем специальный заголовок
      const normalizedDir = path.resolve(dir);
      const normalizedApiDir = path.resolve(apiDir);
      if (normalizedDir === normalizedApiDir) {
        title = 'API Документация';
      } else {
        // Пытаемся извлечь название из пути
        const dirName = path.basename(dir);
        // Преобразуем camelCase в читаемый формат
        title = dirName
          .replace(/([A-Z])/g, ' $1')
          .replace(/^./, str => str.toUpperCase())
          .trim();
        
        // Специальные случаи
        if (title.toLowerCase() === 'api auth') {
          title = 'API Авторизация';
        } else if (title.toLowerCase() === 'api post types') {
          title = 'API Типы контента';
        } else if (title.toLowerCase() === 'api utils') {
          title = 'API Утилиты';
        } else if (title.toLowerCase() === 'auth task') {
          title = 'Задачи авторизации';
        } else if (title.toLowerCase() === 'post type editor store') {
          title = 'Стор редактора типов контента';
        } else if (title.toLowerCase() === 'notification service') {
          title = 'Сервис уведомлений';
        } else if (title.toLowerCase() === 'join class names') {
          title = 'Объединение CSS классов';
        }
      }
    }
    
    // Создаём index.md с правильным заголовком и контентом
    let restContent = lines.slice(contentStart).join('\n');
    
    // Удаляем ссылку на родительский README если есть (только строку с ссылкой, не весь текст)
    restContent = restContent.replace(/^\*\*.*?\*\*.*$/gm, ''); // Удаляем строки вида **admin**
    restContent = restContent.replace(/^\*\*\*+.*$/gm, ''); // Удаляем разделители
    restContent = restContent.replace(/^\[.*?\]\(.*?README\.md\).*$/gm, ''); // Удаляем строки со ссылками на README
    
    // Преобразуем ссылки: заменяем README.md на / для index.md
    // Сначала обрабатываем ссылки вида [text](path/README.md)
    restContent = restContent.replace(/\]\(([^)]+)\/README\.md\)/g, (match, linkPath) => {
      // Вычисляем абсолютный путь относительно docs/api
      const relativePath = path.relative(apiDir, dir);
      const targetPath = path.join(relativePath === '.' ? '' : relativePath, linkPath);
      const normalizedPath = targetPath.split(path.sep).filter(p => p).join('/');
      return `](/api/${normalizedPath}/)`;
    });
    
    // Обрабатываем ссылки вида [text](README.md) - это ссылки в текущей директории
    restContent = restContent.replace(/\]\(([^)]*?)README\.md\)/g, (match, linkPath) => {
      if (!linkPath || linkPath === './') {
        // Текущая директория
        const relativePath = path.relative(apiDir, dir);
        const normalizedPath = relativePath === '.' ? '' : relativePath.split(path.sep).filter(p => p).join('/');
        return `](/api/${normalizedPath}/)`;
      }
      return match;
    });
    
    // Исправляем оставшиеся ссылки через fixLinks
    restContent = fixLinks(restContent, dir);
    
    const indexContent = `# ${title}\n\n${restContent.trim()}\n`;
    
    await fs.writeFile(indexPath, indexContent, 'utf8');
    console.log(`Created ${indexPath}`);
  } catch (error) {
    console.warn(`Could not create index.md from ${readmePath}:`, error);
  }
};

/**
 * Создаёт index.md во всех поддиректориях docs/api/ на основе README.md, сгенерированных TypeDoc.
 */
const run = async () => {
  const apiDir = 'docs/api';
  
  // Находим все README.md в docs/api и поддиректориях
  const readmeFiles = await globby(['**/README.md'], { cwd: apiDir });
  
  // Создаём index.md для каждого README.md
  // Важно: сначала обрабатываем главный README.md, чтобы он имел доступ к apiDir
  const mainReadme = readmeFiles.find(f => f === 'README.md');
  const otherReadmes = readmeFiles.filter(f => f !== 'README.md');
  
  if (mainReadme) {
    const readmePath = path.join(apiDir, mainReadme);
    await createIndexFromReadme(readmePath, apiDir);
  }
  
  for (const readmeFile of otherReadmes) {
    const readmePath = path.join(apiDir, readmeFile);
    await createIndexFromReadme(readmePath, apiDir);
  }
  
  console.log(`Created ${readmeFiles.length} index.md files`);
};

run().catch(e => {
  console.error(e);
  process.exit(1);
});

