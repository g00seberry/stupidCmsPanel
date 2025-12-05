import { defineConfig } from 'vitepress';
import { sidebarFromFs } from './sidebarFromFs';

export default defineConfig({
  title: 'CMS Panel Documentation',
  description: 'Автодокументация проекта',
  themeConfig: {
    nav: [
      { text: 'Гайды', link: '/guides/' },
      { text: 'API', link: '/api/' },
      { text: 'Компоненты', link: '/components/' },
      { text: 'Страницы', link: '/pages/' },
    ],
    sidebar: await sidebarFromFs([
      { base: '/guides', dir: 'guides' },
      { base: '/api', dir: 'api' },
      { base: '/components', dir: 'components' },
      { base: '/pages', dir: 'pages' },
    ]),
    outline: [2, 3],
    search: { provider: 'local' },
  },
});
