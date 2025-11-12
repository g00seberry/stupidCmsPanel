Цели

Единый сайт документации в docs/ (и сборка в docs/.vitepress/dist).

Автогенерация:

API/сторы/утилиты из TypeScript-комментариев — через TypeDoc (Markdown).

Компоненты React (props, defaultProps, описания) — через react-docgen-typescript.

Карта страниц/роутинга — скриптом по src/pages и/или react-router.

Автонавигация — сайдбар строится из файловой структуры.

Никогда не протухает — генераторы запускаются в pre-commit и в CI; если забыли сгенерировать — CI «краснеет».

1. Что ставим
   pnpm add -D vitepress typedoc typedoc-plugin-markdown \
    react-docgen-typescript fs-extra globby \
    prettier husky lint-staged

Если у вас npm/yarn, команды аналогичны.

2. Структура docs/
   docs/
   .vitepress/
   config.ts
   index.md
   guides/ # руками пишем гайды/ADR/HowTo
   api/ # автоген Typedoc (не правим вручную)
   components/ # автоген React Props (не правим вручную)
   pages/ # автоген карта страниц/роутинга

3. VitePress: конфиг с авто-сайдбаром
   docs/.vitepress/config.ts
   import { defineConfig } from 'vitepress'
   import { sidebarFromFs } from './sidebarFromFs' // helper ниже

export default defineConfig({
title: 'Project Docs',
description: 'Автодокументация',
srcDir: '../', // чтобы sidebar видел все подпапки внутри docs/
themeConfig: {
nav: [
{ text: 'Гайды', link: '/guides/' },
{ text: 'API', link: '/api/' },
{ text: 'Компоненты', link: '/components/' },
{ text: 'Страницы', link: '/pages/' },
],
sidebar: await sidebarFromFs([
{ base: '/guides', dir: 'docs/guides' },
{ base: '/api', dir: 'docs/api' },
{ base: '/components', dir: 'docs/components' },
{ base: '/pages', dir: 'docs/pages' },
]),
outline: [2, 3],
search: { provider: 'local' },
},
})

docs/.vitepress/sidebarFromFs.ts
import { globby } from 'globby'
import path from 'node:path'
import fs from 'node:fs'

type Entry = { base: string; dir: string }

export async function sidebarFromFs(entries: Entry[]) {
const sidebar: Record<string, any[]> = {}
for (const e of entries) {
const files = await globby(['**/*.md'], { cwd: e.dir })
const groups: Record<string, any[]> = {}
for (const f of files) {
const full = path.join(e.dir, f)
const title = firstHeading(full) ?? path.basename(f, '.md')
const group = path.dirname(f)
groups[group] ??= []
groups[group].push({ text: title, link: `${e.base}/${f.replace(/\.md$/, '')}` })
}
sidebar[e.base] = Object.entries(groups).map(([g, items]) => ({
text: g === '.' ? 'Overview' : g,
items: items.sort((a, b) => a.text.localeCompare(b.text)),
collapsed: false,
}))
}
return sidebar
}

function firstHeading(file: string) {
try {
const s = fs.readFileSync(file, 'utf8')
const m = s.match(/^#\s+(.+)$/m)
return m?.[1]?.trim()
} catch { return null }
}

4. Генерация API из TypeScript (TypeDoc → Markdown)
   typedoc.json
   {
   "entryPoints": ["src/index.ts", "src/**/*.ts", "src/**/*.tsx"],
   "exclude": ["**/*.test.*", "**/__mocks__/**"],
   "plugin": ["typedoc-plugin-markdown"],
   "excludePrivate": true,
   "excludeInternal": true,
   "readme": "none",
   "hideBreadcrumbs": true,
   "categorizeByGroup": false,
   "tsconfig": "tsconfig.json",
   "githubPages": false,
   "categorizeByNamespace": false
   }

Скрипт генерации
pnpm typedoc --options typedoc.json --out docs/api

5. Автодоки по компонентам (props из TS)
   scripts/gen-components-docs.ts
   import { withCustomConfig } from 'react-docgen-typescript'
   import { globby } from 'globby'
   import fs from 'node:fs/promises'
   import path from 'node:path'

const parser = withCustomConfig('tsconfig.json', {
savePropValueAsString: true,
shouldExtractLiteralValuesFromEnum: true,
propFilter: (prop) =>
!prop.parent || !/node_modules/.test(prop.parent.fileName),
})

function mdEscape(s: string) {
return String(s ?? '').replace(/\|/g, '\\|')
}

async function run() {
const outDir = 'docs/components'
await fs.rm(outDir, { recursive: true, force: true })
await fs.mkdir(outDir, { recursive: true })

const files = await globby(['src/components/**/*.{ts,tsx}'])
const docs = parser.parse(files)

for (const c of docs) {
const name = c.displayName || path.parse(c.filePath).name
let md = `# ${name}\n\n`
if (c.description) md += `${c.description}\n\n`

    const props = Object.entries(c.props ?? {}).sort(([a], [b]) =>
      a.localeCompare(b),
    )
    if (props.length) {
      md += `## Props\n\n`
      md += `| Prop | Type | Required | Default | Description |\n`
      md += `| --- | --- | :--: | --- | --- |\n`
      for (const [propName, p] of props) {
        md += `| \`${propName}\` | \`${mdEscape(p.type?.name)}\` | ${
          p.required ? '✓' : ''
        } | \`${mdEscape(p.defaultValue?.value ?? '')}\` | ${
          mdEscape(p.description ?? '')
        } |\n`
      }
      md += `\n`
    }

    // краткая ссылка на исходник
    md += `**Source:** \`${c.filePath}\`\n`
    await fs.writeFile(path.join(outDir, `${name}.md`), md, 'utf8')

}

// индекс
const index = (await globby(['*.md'], { cwd: outDir }))
.sort()
.map(f => `- [${path.basename(f, '.md')}](/components/${f.replace('.md','')})`)
.join('\n')
await fs.writeFile(path.join(outDir, 'index.md'), `# Компоненты\n\n${index}\n`)
}

run().catch(e => { console.error(e); process.exit(1) })

6. Автоген «карты страниц» (роутинг/страницы)
   scripts/gen-pages-docs.ts
   import { globby } from 'globby'
   import fs from 'node:fs/promises'
   import path from 'node:path'

async function run() {
const outDir = 'docs/pages'
await fs.rm(outDir, { recursive: true, force: true })
await fs.mkdir(outDir, { recursive: true })

const files = await globby(['src/pages/**/*.{tsx,ts,md,mdx}'])
const tree: Record<string, string[]> = {}
for (const f of files) {
const seg = path.relative('src/pages', f).split(path.sep)
const dir = seg.slice(0, -1).join('/') || 'root'
tree[dir] ??= []
tree[dir].push(seg.at(-1)!)
}

let md = `# Страницы\n\nАвтосгенерировано из \`src/pages\`.\n\n`  for (const [dir, list] of Object.entries(tree).sort()) {
    md +=`## ${dir}\n\n`
    for (const file of list.sort()) {
      md += `- \`${file}\`\n`    }
    md +=`\n`
}
await fs.writeFile(path.join(outDir, 'index.md'), md, 'utf8')
}

run().catch(e => { console.error(e); process.exit(1) })

Если у вас декларативный роутер (файл routes.tsx), можно дополнительно распарсить его AST (например, @babel/parser) и выводить человекочитаемые пути/метаданные.

7. Скрипты в package.json
   {
   "scripts": {
   "docs:clean": "rimraf docs/api docs/components docs/pages",
   "docs:gen:api": "typedoc --options typedoc.json --out docs/api",
   "docs:gen:components": "tsx scripts/gen-components-docs.ts",
   "docs:gen:pages": "tsx scripts/gen-pages-docs.ts",
   "docs:gen": "pnpm docs:clean && pnpm docs:gen:api && pnpm docs:gen:components && pnpm docs:gen:pages",
   "docs:dev": "vitepress dev docs",
   "docs:build": "pnpm docs:gen && vitepress build docs",
   "docs:preview": "vitepress preview docs"
   },
   "lint-staged": {
   "_.{ts,tsx,md}": [
   "prettier --write"
   ],
   "src/\*\*/_.{ts,tsx}": [
   "pnpm docs:gen",
   "git add docs"
   ]
   }
   }

8. Pre-commit (не даём протухнуть локально)
   pnpm dlx husky init

.husky/pre-commit
#!/usr/bin/env sh
. "$(dirname -- "$0")/\_/husky.sh"

pnpm lint-staged

При каждом коммите генераторы запустятся; изменённые docs/\*\* попадут в коммит.

9. CI защита (если забыли сгенерировать — сборка упадёт)
   .github/workflows/docs.yml
   name: Docs
   on:
   push:
   branches: [ main ]
   pull_request:

jobs:
build-docs:
runs-on: ubuntu-latest
steps: - uses: actions/checkout@v4
with: { fetch-depth: 0 } - uses: actions/setup-node@v4
with: { node-version: 20 } - run: corepack enable - run: pnpm i --frozen-lockfile - run: pnpm docs:gen - name: Ensure docs up-to-date
run: |
git add -N docs
git diff --exit-code -- docs || \
 (echo "::error::Docs are stale. Run 'pnpm docs:gen' and commit changes." && exit 1) - run: pnpm docs:build # (опционально) деплой на GitHub Pages # - uses: peaceiris/actions-gh-pages@v3 # with: # github_token: ${{ secrets.GITHUB_TOKEN }} # publish_dir: docs/.vitepress/dist

10. Главная и разделы (минимальный контент)
    docs/index.md

# Документация проекта

- **Гайды** — процесс, архитектура, ADR, HowTo
- **API** — автоген из TypeScript
- **Компоненты** — автоген из React props
- **Страницы** — автоген из файлов `src/pages`

Внутри guides/ храните обзорные материалы и решения продуктовых кейсов — это единственный «ручной» раздел.

11. Правила стиля для комментариев

Чтобы автодоки были полезны, держите комментарии лаконичными и фактичными:

Используйте TSDoc/JSDoc форматы:

/\*\*

- Возвращает отформатированную сумму для UI.
- @example formatMoney(1234.5) // "1 234,50 ₽"
  \*/
  export const formatMoney = (v: number) => ...

Короткое описание компонента над export const Component....

В сторе: документируйте публичные методы и флаги (pending, error).

12. Почему это «никогда не протухает»

Любое изменение кода → pre-commit генерит docs/\*\* → попадает в коммит.

В PR CI проверяет «без дельты» между исходниками и автодоками.

Навигация сайдбара строится по файловой системе и не требует ручных правок.

Документация — побочный артефакт кода (TypeDoc/Docgen), а не ручные страницы.
