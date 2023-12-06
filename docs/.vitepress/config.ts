import { createRequire } from "module";
import { defineConfig, type DefaultTheme } from "vitepress";

const require = createRequire(import.meta.url);
const pkg = require("canvas-mark-board/package.json");
export default defineConfig({
  title: "canvas-mark-board",
  lang: "zh-CN",
  description: "canvas标记画板",
  base: "/canvas-mark-board",
  themeConfig: {
    logo: { src: "/logo.svg", width: 24, height: 24 },
    search: {
      provider: "algolia",
      options: {
        appId: "...",
        apiKey: "...",
        indexName: "...",
      },
    },
    nav: nav(),
    sidebar: {
      "/guide/": [
        {
          text: "介绍",
          items: [
            {
              text: "为什么用canvas-mark-board?",
              link: "/guide/why-canvas-mark-board",
            },
            { text: "开始", link: "/guide/" },
          ],
        },
        {
          text: "使用文档",
          items: [{ text: "事件", link: "/guide/event" }],
        },
      ],
      "/demo/": [
        {
          text: "demo",
          items: [
            {
              text: "js-demo",
              link: "/demo/js-demo",
            },
            {
              text: "vue-demo",
              link: "/demo/vue-demo",
            },
            {
              text: "react-demo",
              link: "/demo/react-demo",
            },
          ],
        },
      ],
    },
    socialLinks: [
      { icon: 'github', link: 'https://github.com/zhuguibiao/canvas-mark-board' }
    ],
  },
});

function nav(): DefaultTheme.NavItem[] {
  return [
    {
      text: "指引",
      link: "/guide/",
      activeMatch: "/guide/",
    },
    {
      text: "例子",
      link: "/demo/",
      activeMatch: "/demo/",
    },
    {
      text: pkg.version,
      items: [
        {
          text: "Changelog",
          link: "https://github.com/zhuguibiao/canvas-mark-board/",
        },
      ],
    },
    
  ];
}
