import { withCustomConfig } from 'react-docgen-typescript';
import { globby } from 'globby';
import fs from 'node:fs/promises';
import path from 'node:path';

const parser = withCustomConfig('tsconfig.json', {
  savePropValueAsString: true,
  shouldExtractLiteralValuesFromEnum: true,
  propFilter: prop => !prop.parent || !/node_modules/.test(prop.parent.fileName),
});

/**
 * Экранирует специальные символы Markdown для безопасного отображения в таблицах.
 * @param s Строка для экранирования.
 * @returns Экранированная строка.
 */
const mdEscape = (s: string): string => {
  return String(s ?? '').replace(/\|/g, '\\|').replace(/\n/g, ' ');
};

/**
 * Генерирует документацию для всех React компонентов.
 */
const run = async () => {
  const outDir = 'docs/components';
  await fs.rm(outDir, { recursive: true, force: true });
  await fs.mkdir(outDir, { recursive: true });

  const files = await globby([
    'src/components/**/*.{ts,tsx}',
    'src/layouts/components/**/*.{ts,tsx}',
  ]);

  if (files.length === 0) {
    console.log('No component files found');
    return;
  }

  const docs = parser.parse(files);

  for (const c of docs) {
    const name = c.displayName || path.parse(c.filePath).name;
    let md = `# ${name}\n\n`;
    if (c.description) {
      md += `${c.description}\n\n`;
    }

    const props = Object.entries(c.props ?? {}).sort(([a], [b]) => a.localeCompare(b));
    if (props.length) {
      md += `## Props\n\n`;
      md += `| Prop | Type | Required | Default | Description |\n`;
      md += `| --- | --- | :--: | --- | --- |\n`;
      for (const [propName, p] of props) {
        const typeName = p.type?.name ?? 'unknown';
        const defaultValue = p.defaultValue?.value ?? '';
        const description = p.description ?? '';
        md += `| \`${propName}\` | \`${mdEscape(typeName)}\` | ${
          p.required ? '✓' : ''
        } | \`${mdEscape(defaultValue)}\` | ${mdEscape(description)} |\n`;
      }
      md += `\n`;
    }

    md += `**Source:** \`${c.filePath}\`\n`;
    await fs.writeFile(path.join(outDir, `${name}.md`), md, 'utf8');
  }

  // индекс
  const indexFiles = await globby(['*.md'], { cwd: outDir });
  const index = indexFiles
    .filter(f => f !== 'index.md')
    .sort()
    .map(f => `- [${path.basename(f, '.md')}](/components/${f.replace('.md', '')})`)
    .join('\n');
  await fs.writeFile(
    path.join(outDir, 'index.md'),
    `# Компоненты\n\nАвтосгенерировано из React компонентов.\n\n${index}\n`,
    'utf8'
  );
};

run().catch(e => {
  console.error(e);
  process.exit(1);
});

