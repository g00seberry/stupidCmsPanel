import { globby } from 'globby';
import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';

type Entry = { base: string; dir: string };

/**
 * Строит структуру сайдбара VitePress из файловой системы.
 * @param entries Массив объектов с базовым путём и директорией для сканирования.
 * @returns Объект с ключами-путями и значениями-массивами элементов сайдбара.
 */
export const sidebarFromFs = async (entries: Entry[]) => {
  const sidebar: Record<string, any[]> = {};
  // Путь к директории docs относительно .vitepress
  const __dirname = path.dirname(fileURLToPath(import.meta.url));
  const docsDir = path.resolve(__dirname, '..');
  
  for (const e of entries) {
    const dirPath = path.join(docsDir, e.dir);
    const files = await globby(['**/*.md'], { cwd: dirPath });
    const groups: Record<string, any[]> = {};
    for (const f of files) {
      const full = path.join(dirPath, f);
      const title = firstHeading(full) ?? path.basename(f, '.md');
      const group = path.dirname(f);
      groups[group] ??= [];
      groups[group].push({ text: title, link: `${e.base}/${f.replace(/\.md$/, '')}` });
    }
    sidebar[e.base] = Object.entries(groups).map(([g, items]) => ({
      text: g === '.' ? 'Overview' : g,
      items: items.sort((a, b) => a.text.localeCompare(b.text)),
      collapsed: false,
    }));
  }
  return sidebar;
};

/**
 * Извлекает первый заголовок уровня 1 из Markdown файла.
 * @param file Путь к файлу.
 * @returns Текст заголовка или null, если не найден.
 */
const firstHeading = (file: string): string | null => {
  try {
    const s = fs.readFileSync(file, 'utf8');
    const m = s.match(/^#\s+(.+)$/m);
    return m?.[1]?.trim() ?? null;
  } catch {
    return null;
  }
};

