import { globby } from 'globby';
import fs from 'node:fs/promises';
import path from 'node:path';

/**
 * Генерирует карту страниц приложения из файловой структуры.
 */
const run = async () => {
  const outDir = 'docs/pages';
  await fs.rm(outDir, { recursive: true, force: true });
  await fs.mkdir(outDir, { recursive: true });

  const files = await globby(['src/pages/**/*.{tsx,ts,md,mdx}']);
  const tree: Record<string, string[]> = {};

  for (const f of files) {
    const seg = path.relative('src/pages', f).split(path.sep);
    const dir = seg.slice(0, -1).join('/') || 'root';
    tree[dir] ??= [];
    tree[dir].push(seg.at(-1)!);
  }

  let md = `# Страницы\n\nАвтосгенерировано из \`src/pages\`.\n\n`;

  // Информация о роутах (опционально)
  try {
    const routesContent = await fs.readFile('src/routes.tsx', 'utf8');
    const pageUrlContent = await fs.readFile('src/PageUrl.ts', 'utf8');

    // Простой парсинг PageUrl
    const urlMatches = pageUrlContent.matchAll(/(\w+):\s*['"`]([^'"`]+)['"`]/g);
    const urlMap: Record<string, string> = {};
    for (const match of urlMatches) {
      urlMap[match[1]] = match[2];
    }

    // Простой парсинг routes
    const routeMatches = routesContent.matchAll(/PageUrl\.(\w+)/g);
    const routePages: Record<string, string> = {};
    const routeArray = routesContent.match(/export const routes = \[([\s\S]*?)\];/);
    if (routeArray) {
      const routeLines = routeArray[1].split('\n');
      let currentPath = '';
      for (const line of routeLines) {
        const pathMatch = line.match(/path:\s*PageUrl\.(\w+)/);
        if (pathMatch) {
          currentPath = pathMatch[1];
        }
        const componentMatch = line.match(/(\w+Page)\s*\/>/);
        if (componentMatch && currentPath) {
          routePages[currentPath] = componentMatch[1];
        }
      }
    }

    if (Object.keys(urlMap).length > 0) {
      md += `## Роуты\n\n`;
      md += `| Путь | Компонент |\n`;
      md += `| --- | --- |\n`;
      for (const [key, url] of Object.entries(urlMap).sort()) {
        const component = routePages[key] || '-';
        md += `| \`${url}\` | \`${component}\` |\n`;
      }
      md += `\n`;
    }
  } catch (error) {
    // Игнорируем ошибки парсинга роутов
    console.warn('Could not parse routes:', error);
  }

  // Структура файлов
  md += `## Структура файлов\n\n`;
  for (const [dir, list] of Object.entries(tree).sort()) {
    md += `### ${dir === 'root' ? 'Корень' : dir}\n\n`;
    for (const file of list.sort()) {
      md += `- \`${file}\`\n`;
    }
    md += `\n`;
  }

  await fs.writeFile(path.join(outDir, 'index.md'), md, 'utf8');
};

run().catch(e => {
  console.error(e);
  process.exit(1);
});
