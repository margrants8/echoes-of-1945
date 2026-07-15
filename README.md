# Echoes of 1945

> 二战纪念与战后秩序展示站点 · 开源内容协作

## 项目简介

**Echoes of 1945** 是一个以内容为核心、开源协作驱动的历史纪念静态站点，覆盖：

- 二战主要战役与时间线
- 战败国战后条约执行情况（数据可视化）
- 战后国际秩序重建（联合国、冷战格局）
- 人物档案

## 技术栈

| 层级 | 选型 |
|---|---|
| 框架 | Astro 4.x |
| 交互 | Alpine.js 3.x |
| 数据可视化 | D3.js（按需引入） |
| 样式 | 原生 CSS Variables |

## 快速开始

```bash
npm install
npm run dev      # 开发服务器 localhost:4321
npm run build    # 构建
npm run preview  # 本地预览构建产物
```

## 参与贡献

只需编写 Markdown，无需懂代码。详见 [CONTRIBUTING.md](./CONTRIBUTING.md)。

```
新增战役：src/content/events/YYYY-事件名.md
新增人物：src/content/people/姓名拼音.md
新增专题：src/content/aftermath/主题名.md
```

## 部署

- **主部署**：GitHub Pages（合并到 `main` 自动触发）
- **PR 预览**：每个 PR 自动构建检查

## 许可

内容采用 [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/deed.zh) 授权。代码采用 MIT 许可。
