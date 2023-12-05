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
    search: {
      provider: "algolia",
      options: {
        appId: "...",
        apiKey: "...",
        indexName: "...",
        locales: {
          root: {
            placeholder: "搜索文档",
            translations: {
              button: {
                buttonText: "搜索文档",
                buttonAriaLabel: "搜索文档",
              },
              modal: {
                searchBox: {
                  resetButtonTitle: "清除查询条件",
                  resetButtonAriaLabel: "清除查询条件",
                  cancelButtonText: "取消",
                  cancelButtonAriaLabel: "取消",
                },
                startScreen: {
                  recentSearchesTitle: "搜索历史",
                  noRecentSearchesText: "没有搜索历史",
                  saveRecentSearchButtonTitle: "保存至搜索历史",
                  removeRecentSearchButtonTitle: "从搜索历史中移除",
                  favoriteSearchesTitle: "收藏",
                  removeFavoriteSearchButtonTitle: "从收藏中移除",
                },
                errorScreen: {
                  titleText: "无法获取结果",
                  helpText: "你可能需要检查你的网络连接",
                },
                footer: {
                  selectText: "选择",
                  navigateText: "切换",
                  closeText: "关闭",
                  searchByText: "搜索提供者",
                },
                noResultsScreen: {
                  noResultsText: "无法找到相关结果",
                  suggestedQueryText: "你可以尝试查询",
                  reportMissingResultsText: "你认为该查询应该有结果？",
                  reportMissingResultsLinkText: "点击反馈",
                },
              },
            },
          },
        },
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
