# Echoes of 1945 — 技术方案文档

> 二战纪念与战后秩序展示站点
> 版本：v1.0 | 状态：设计阶段

---

## 目录

1. [项目概述](#1-项目概述)
2. [技术栈选型](#2-技术栈选型)
3. [仓库结构](#3-仓库结构)
4. [内容模型设计](#4-内容模型设计)
5. [页面结构与路由](#5-页面结构与路由)
6. [核心模块设计](#6-核心模块设计)
7. [视觉设计系统](#7-视觉设计系统)
8. [GitHub 协作流程](#8-github-协作流程)
9. [CI/CD 部署方案](#9-cicd-部署方案)
10. [性能与 SEO](#10-性能与-seo)
11. [扩展路线图](#11-扩展路线图)

---

## 1. 项目概述

### 1.1 目标

构建一个以**内容为核心、开源协作驱动**的历史纪念站点，覆盖：

- 二战主要战役与时间线
- 战败国战后条约执行情况（数据可视化）
- 战后国际秩序重建（联合国、冷战格局、马歇尔计划）
- 人物档案与历史照片

### 1.2 核心原则

- **内容优先**：设计服务于叙事，不抢戏
- **开源协作**：贡献者只需写 Markdown，无需懂代码
- **零运维成本**：纯静态，合并即上线
- **历史严肃性**：数据有来源，争议有标注，不做娱乐化处理

### 1.3 非目标

- 不做实时数据（无需后端）
- 不做用户账号系统
- 不做评论系统（避免历史虚无主义内容）

---

## 2. 技术栈选型

| 层级 | 选型 | 理由 |
|---|---|---|
| 静态站框架 | **Astro 4.x** | 零 JS 默认输出；Content Collections 原生支持；MDX 支持在 Markdown 中嵌组件 |
| 交互层 | **Alpine.js 3.x** | 极轻量（15KB）；适合展开/收起/Tab 切换等简单交互 |
| 数据可视化 | **D3.js**（按需引入） | 点阵图、时间轴定制图表；仅在需要的页面加载 |
| 地图 | **Leaflet.js + Stamen Toner** | 复古地图底图；轻量；无 API Key |
| 样式 | **原生 CSS（CSS Variables）** | 无框架依赖；设计系统用变量统一管理 |
| 图标 | **Lucide（SVG inline）** | 轻量；无字体文件依赖 |

**开发工具链：**
```
Node.js 20 LTS
npm（lockfile 提交入库）
prettier + astro prettier plugin
```

**部署目标：**
- 主部署：GitHub Pages（免费，零运维）
- PR 预览：Cloudflare Pages（每个 PR 自动生成预览链接）

---

## 3. 仓库结构

```
echoes-of-1945/
├── src/
│   ├── content/                    ← 贡献者核心区域，只改这里
│   │   ├── config.ts               ← Content Collections Schema 定义
│   │   ├── events/                 ← 战役/事件，每个 .md 一条
│   │   ├── people/                 ← 人物档案
│   │   ├── aftermath/              ← 战后秩序专题
│   │   └── settlements/            ← 战败国条约执行数据（JSON）
│   │       ├── germany.json
│   │       ├── japan.json
│   │       └── italy.json
│   ├── pages/
│   │   ├── index.astro             ← 首页（竖向时间轴）
│   │   ├── events/[slug].astro
│   │   ├── people/[slug].astro
│   │   ├── aftermath/[slug].astro
│   │   ├── settlements/index.astro ← 战败国数据可视化
│   │   └── gallery/index.astro
│   ├── components/
│   │   ├── layout/
│   │   ├── timeline/
│   │   ├── settlements/            ← CountryCard / ClauseBar / CompareView
│   │   ├── people/
│   │   └── shared/                 ← Tag / SourceCitation / PhotoFrame
│   ├── styles/
│   │   ├── global.css
│   │   └── typography.css
│   └── utils/
│       ├── dates.ts
│       └── settlements.ts
├── public/
│   └── images/
│       ├── events/
│       ├── people/
│       └── gallery/
├── .github/
│   ├── workflows/
│   │   ├── deploy.yml
│   │   └── pr-check.yml
│   ├── ISSUE_TEMPLATE/
│   └── pull_request_template.md
├── astro.config.mjs
├── CONTRIBUTING.md
└── README.md
```

---

## 4. 内容模型设计

### 4.1 Content Collections Schema

```typescript
// src/content/config.ts
import { defineCollection, z } from 'astro:content';

const events = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    titleEn: z.string().optional(),
    date: z.string(),
    dateEnd: z.string().optional(),
    location: z.string(),
    coordinates: z.tuple([z.number(), z.number()]).optional(),
    theater: z.enum(['europe', 'pacific', 'africa', 'other']),
    tags: z.array(z.string()),
    cover: z.string().optional(),
    coverCaption: z.string().optional(),
    significance: z.enum(['minor', 'major', 'turning-point']),
    casualties: z.object({
      allies: z.number().optional(),
      axis: z.number().optional(),
      civilian: z.number().optional(),
    }).optional(),
    sources: z.array(z.object({
      title: z.string(),
      url: z.string().optional(),
      author: z.string().optional(),
    })).optional(),
  }),
});

const people = defineCollection({
  type: 'content',
  schema: z.object({
    name: z.string(),
    nameEn: z.string().optional(),
    born: z.string(),
    died: z.string().optional(),
    nationality: z.string(),
    role: z.string(),
    side: z.enum(['allies', 'axis', 'neutral']),
    photo: z.string().optional(),
    tags: z.array(z.string()),
    relatedEvents: z.array(z.string()).optional(),
  }),
});

const aftermath = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    date: z.string(),
    category: z.enum(['institution', 'treaty', 'reconstruction', 'coldwar']),
    cover: z.string().optional(),
    tags: z.array(z.string()),
    sources: z.array(z.object({
      title: z.string(),
      url: z.string().optional(),
    })).optional(),
  }),
});

export const collections = { events, people, aftermath };
```

### 4.2 战败国条约数据模型（JSON）

`status` 枚举说明：

| 值 | 含义 | 颜色 |
|---|---|---|
| `executed` | 完全执行（不可逆） | 深红 `#5C1A1A` |
| `partial` | 部分执行或后来松动 | 暗金 `#C4A050` |
| `not-executed` | 未执行 | 中灰 `#888` |
| `disputed` | 至今存在争议 | 橙红 `#C45A1A`（加 ⚠ 标记） |

```json
// src/content/settlements/germany.json
{
  "country": "germany",
  "displayName": "德意志",
  "treaty": "波茨坦协定（1945）/ 对德最终解决条约（1990）",
  "occupationEnd": "1955",
  "sovereigntyRestored": "1990",
  "overallCompliance": 0.78,
  "clauses": [
    {
      "id": "territorial-east-prussia",
      "category": "territorial",
      "label": "东普鲁士割让",
      "status": "executed",
      "executedYear": 1945,
      "reversedAt": null,
      "disputed": false,
      "complianceScore": 1.0,
      "note": "北部划归苏联（今俄罗斯加里宁格勒州），南部划归波兰",
      "sources": [{ "title": "波茨坦协定第五条" }]
    },
    {
      "id": "military-rearmament",
      "category": "military",
      "label": "军事限制 / 联邦国防军重建",
      "status": "partial",
      "executedYear": 1955,
      "reversedAt": 1955,
      "disputed": false,
      "complianceScore": 0.6,
      "note": "冷战背景下，西方允许西德重新武装并加入NATO，上限50万人。核武器禁止至今有效。"
    },
    {
      "id": "reparations-israel",
      "category": "reparations",
      "label": "对以色列战争赔偿",
      "status": "executed",
      "executedYear": 1965,
      "complianceScore": 1.0,
      "note": "1952年《卢森堡协议》，德国向以色列支付约30亿马克，1965年完成"
    },
    {
      "id": "reparations-poland",
      "category": "reparations",
      "label": "对波兰赔偿",
      "status": "disputed",
      "executedYear": null,
      "disputed": true,
      "complianceScore": 0.3,
      "note": "波兰于2022年再次提出约1.3万亿美元索赔，德国拒绝，争议至今未解决"
    },
    {
      "id": "denazification",
      "category": "judicial",
      "label": "去纳粹化 / 纽伦堡审判",
      "status": "partial",
      "executedYear": 1946,
      "complianceScore": 0.7,
      "note": "纽伦堡主审判1946年完成，但大量中下层纳粹成员未受审判，冷战后部分人员被重新启用"
    }
  ]
}
```

### 4.3 内容文件示例（events/）

```markdown
---
title: 诺曼底登陆
titleEn: D-Day / Operation Overlord
date: "1944-06-06"
dateEnd: "1944-08-25"
location: 法国诺曼底海岸
coordinates: [49.3668, -0.5491]
theater: europe
tags: [盟军, 法国, 登陆战, 转折点]
cover: /images/events/d-day-omaha-beach.jpg
coverCaption: "奥马哈海滩，1944年6月6日。摄影：Robert Capa / Magnum Photos"
significance: turning-point
casualties:
  allies: 10000
  axis: 4000
  civilian: 3000
sources:
  - title: "Overlord: D-Day and the Battle for Normandy"
    author: Max Hastings
---

1944年6月6日凌晨，盟军发动代号"霸王行动"（Operation Overlord）…
```

---

## 5. 页面结构与路由

### 5.1 路由总览

```
/                           首页（时间轴叙事）
/events/                    战役事件列表（可按战区/年份筛选）
/events/[slug]/             战役详情
/people/                    人物档案列表
/people/[slug]/             人物详情
/aftermath/                 战后秩序专题列表
/aftermath/[slug]/          专题详情
/settlements/               战败国条约执行可视化
/gallery/                   历史照片墙
/timeline/                  完整时间轴（全局视图）
```

### 5.2 首页 Section 划分

```
Section 1: Hero
  全屏背景（历史照片，黑白+颗粒感）
  站名 + 一句话定位 + 滚动引导

Section 2: 战争爆发（1939）
  年份装饰大字 + 背景叙述 + 关键事件卡片×3

Section 3: 战局演变（1940-1943）
  左右交替布局 + 地图标注关键战役

Section 4: 转折点（1943-1944）
  斯大林格勒 / 中途岛 / 诺曼底
  全宽照片 + 伤亡数字点阵图（D3）

Section 5: 终战（1945）
  欧洲战场 + 太平洋战场 两节点并排

Section 6: 战后清算（核心模块）← 战败国条约可视化
  三国卡片 + 展开详情 + 跨国对比

Section 7: 新秩序（1945-1955）
  联合国 / 冷战开端 / 马歇尔计划

Footer: 参与贡献入口 + 参考资料说明
```

---

## 6. 核心模块设计

### 6.1 战败国条约可视化

#### 组件层级

```
SettlementsPage
└── CountrySelector（德 / 日 / 意 Tab）
    ├── CountryOverview（条约信息、执行总评分）
    ├── ClauseList
    │   └── ClauseBar × N
    │       └── ClauseDetail（展开面板，Alpine.js 控制）
    └── CompareToggle → CompareView（跨国对比）
```

#### ClauseBar 核心实现

```astro
---
// src/components/settlements/ClauseBar.astro
interface Props {
  clause: {
    label: string;
    status: 'executed' | 'partial' | 'not-executed' | 'disputed';
    complianceScore: number;
    executedYear: number | null;
    disputed: boolean;
    note: string;
  }
}
const { clause } = Astro.props;
const colorMap = {
  executed:     'var(--color-executed)',
  partial:      'var(--color-partial)',
  'not-executed': 'var(--color-not-executed)',
  disputed:     'var(--color-disputed)',
};
---

<div class="clause-bar" x-data="{ open: false }">
  <div class="clause-header" @click="open = !open">
    <span class="clause-label">
      {clause.disputed && <span class="warn-icon">⚠</span>}
      {clause.label}
    </span>
    <span class="clause-year">{clause.executedYear ?? '未完成'}</span>
    <div class="progress-track">
      <div
        class="progress-fill"
        style={`width:${clause.complianceScore*100}%;background:${colorMap[clause.status]}`}
      />
    </div>
  </div>
  <div class="clause-detail" x-show="open" x-transition>
    <p>{clause.note}</p>
  </div>
</div>
```

#### 跨国对比视图

用户切换"对比模式"时，同一条款维度横向展示三国进度条：

```
维度可选：军事限制 / 赔款 / 领土 / 司法清算

德国  ████████████████░░  注释说明
日本  ██████████████████  注释说明
意大利████████░░░░░░░░░░  注释说明

时间轴：1945 ──── 1950 ──── 1955 ──── 1960 ──── 今
              ↑            ↑
           占领结束      西德重新武装
```

### 6.2 时间轴组件

```astro
// TimelineEvent.astro 支持两种模式
// mode="compact"  → 首页嵌入
// mode="full"     → /timeline 全局页面
```

滚动动画：`IntersectionObserver` + CSS `@keyframes`，不引入动画库。

```javascript
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) entry.target.classList.add('visible');
  });
}, { threshold: 0.15 });
document.querySelectorAll('.timeline-event').forEach(el => observer.observe(el));
```

### 6.3 历史照片组件

```astro
// src/components/shared/PhotoFrame.astro
---
interface Props {
  src: string;
  alt: string;
  caption?: string;
  size?: 'full' | 'half' | 'third';
}
---
<figure class={`photo-frame photo-frame--${Astro.props.size ?? 'full'}`}>
  <img src={Astro.props.src} alt={Astro.props.alt} loading="lazy" />
  {Astro.props.caption && <figcaption>{Astro.props.caption}</figcaption>}
</figure>

<style>
.photo-frame img {
  filter: grayscale(100%) contrast(1.08) brightness(0.92);
  border: 1px solid var(--color-border);
  box-shadow: 2px 2px 8px rgba(0,0,0,0.15), inset 0 0 20px rgba(0,0,0,0.05);
}
figcaption {
  font-family: var(--font-mono);
  font-size: 0.75rem;
  color: var(--color-text-muted);
  margin-top: 0.5rem;
}
</style>
```

---

## 7. 视觉设计系统

### 7.1 CSS 变量（Design Tokens）

```css
/* src/styles/global.css */
:root {
  /* 色彩 */
  --color-bg:              #F5F0E8;  /* 旧纸张 */
  --color-bg-elevated:     #EDE8DC;  /* 卡片背景 */
  --color-text:            #1A1A18;  /* 主文字，暖黑 */
  --color-text-muted:      #6B6355;  /* 次要文字 */
  --color-accent:          #8B1A1A;  /* 深红，强调 */
  --color-border:          #C4B99A;
  --color-year-decor:      #C4B99A;  /* 年份装饰大字 */

  /* 条约状态色 */
  --color-executed:        #5C1A1A;
  --color-partial:         #C4A050;
  --color-not-executed:    #888880;
  --color-disputed:        #C45A1A;

  /* 字体 */
  --font-serif:  'Playfair Display', 'Noto Serif SC', Georgia, serif;
  --font-body:   'Lora', 'Noto Serif SC', Georgia, serif;
  --font-mono:   'IBM Plex Mono', 'Courier New', monospace;

  /* 间距（8px grid） */
  --space-1: 0.5rem;  --space-2: 1rem;   --space-3: 1.5rem;
  --space-4: 2rem;    --space-6: 3rem;   --space-8: 4rem;
  --space-12: 6rem;   --space-16: 8rem;

  /* 容器 */
  --container-text: 680px;
  --container-wide: 1100px;
}

/* 深色模式 */
@media (prefers-color-scheme: dark) {
  :root {
    --color-bg:           #0D0D0B;
    --color-bg-elevated:  #161612;
    --color-text:         #E8E0D0;
    --color-text-muted:   #9A8E7A;
    --color-accent:       #C4A882;  /* 铜金色 */
    --color-border:       #2A2820;
    --color-year-decor:   #2A2820;
  }
}
```

### 7.2 字体与排版

```html
<!-- Google Fonts -->
<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700;900&family=Lora:ital,wght@0,400;0,600;1,400&family=IBM+Plex+Mono:wght@400;500&family=Noto+Serif+SC:wght@400;600;700&display=swap" rel="stylesheet">
```

```css
/* 正文阅读 */
article {
  max-width: var(--container-text);
  margin: 0 auto;
  font-family: var(--font-body);
  font-size: clamp(1rem, 1.5vw, 1.125rem);
  line-height: 1.85;
}

/* 标题层级 */
h1 { font-size: clamp(2.5rem, 6vw, 5rem);   font-weight: 900; }
h2 { font-size: clamp(1.75rem, 3vw, 2.5rem); font-weight: 700; }
h3 { font-size: clamp(1.25rem, 2vw, 1.75rem); font-weight: 600; }

/* 年份装饰大字 */
.year-display {
  font-size: clamp(5rem, 15vw, 12rem);
  font-weight: 900;
  color: var(--color-year-decor);
  line-height: 0.85;
  letter-spacing: -0.03em;
  user-select: none;
}

/* 引用块 */
blockquote {
  border-left: 3px solid var(--color-accent);
  padding: var(--space-2) var(--space-3);
  font-style: italic;
  color: var(--color-text-muted);
}

/* 数据大字（伤亡数字等） */
.stat-number {
  font-family: var(--font-mono);
  font-size: clamp(2rem, 5vw, 4rem);
  font-weight: 700;
  color: var(--color-accent);
}
```

### 7.3 设计原则总结

- **不用纯白背景**：旧纸张色 `#F5F0E8` 是最低成本拉开历史气质的手段
- **不用渐变**：破坏质感
- **黑白照片保持黑白**：不做 AI 上色，保持历史真实感
- **交互要慢、有重量感**：过渡动画 300-400ms，缓动用 `ease-in-out`
- **数据可视化用点阵图**：不用饼图/柱状图，视觉冲击更真实

---

## 8. GitHub 协作流程

### 8.1 贡献者工作流

```
fork 仓库
  → 新建分支（如 add-event-stalingrad）
  → 在 src/content/events/ 新建 .md 文件
  → 填写 frontmatter（参考 CONTRIBUTING.md 模板）
  → 提 PR
  → CI 自动构建检查
      ✅ 通过 → 维护者 Review 内容质量
      ❌ 失败 → 要求贡献者修改
  → 合并到 main
  → Actions 自动部署（约 1-2 分钟）
  → 上线 ✨
```

### 8.2 PR 模板（`.github/pull_request_template.md`）

```markdown
## 贡献类型
- [ ] 新增事件/战役
- [ ] 新增人物档案
- [ ] 新增战后专题
- [ ] 更新条约数据
- [ ] 修正错误

## 内容描述

## 数据来源（至少一条可查证来源）
1.

## 自查清单
- [ ] frontmatter 字段填写完整
- [ ] 图片已放入 public/images/ 对应目录（如有）
- [ ] 来源已在文中或 frontmatter 标注
- [ ] 本地 npm run build 构建通过
```

### 8.3 内容质量守门

CI 构建失败自动阻止合并：
- frontmatter 字段缺失或类型错误 → Astro Schema 校验报错
- 引用不存在的图片路径 → 构建警告（可配置为报错）
- 链接失效检查 → 接入 `lychee` 工具（可选）

---

## 9. CI/CD 部署方案

### 9.1 主部署（GitHub Pages）

```yaml
# .github/workflows/deploy.yml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: pages
  cancel-in-progress: false

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm
      - run: npm ci
      - run: npm run build
        env:
          SITE: https://your-org.github.io
          BASE: /echoes-of-1945
      - uses: actions/upload-pages-artifact@v3
        with:
          path: ./dist

  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - uses: actions/deploy-pages@v4
        id: deployment
```

### 9.2 PR 构建检查

```yaml
# .github/workflows/pr-check.yml
name: PR Build Check

on:
  pull_request:
    branches: [main]

jobs:
  build-check:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm
      - run: npm ci
      - run: npm run build
      # PR 只检查构建，不部署
```

### 9.3 PR 预览（Cloudflare Pages，可选）

```yaml
# 追加到 pr-check.yml
      - name: Deploy Preview to Cloudflare Pages
        uses: cloudflare/pages-action@v1
        with:
          apiToken: ${{ secrets.CF_API_TOKEN }}
          accountId: ${{ secrets.CF_ACCOUNT_ID }}
          projectName: echoes-of-1945
          directory: dist
          gitHubToken: ${{ secrets.GITHUB_TOKEN }}
# 自动在 PR 评论中添加预览链接，如：
# pr-42.echoes-of-1945.pages.dev
```

Cloudflare Pages 每月 500 次免费构建，开源项目完全够用。

### 9.4 astro.config.mjs

```javascript
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://your-org.github.io',
  base: '/echoes-of-1945',
  integrations: [mdx(), sitemap()],
  image: {
    service: { entrypoint: 'astro/assets/services/sharp' },
  },
});
```

---

## 10. 性能与 SEO

### 10.1 性能目标

| 指标 | 目标 |
|---|---|
| Lighthouse Performance | ≥ 95 |
| LCP | < 2.5s |
| CLS | < 0.1 |
| 首屏 JS | < 50KB（不含 D3） |
| 图片格式 | WebP，有 JPG fallback |

### 10.2 图片优化

```astro
import { Image } from 'astro:assets';
<Image src={cover} alt={title} width={1200} height={675}
       format="webp" quality={80} loading="lazy" />
```

- 首屏关键图片加 `loading="eager"` + `fetchpriority="high"`
- 历史照片已是黑白，WebP 压缩率高

### 10.3 D3.js 按需加载

```astro
<!-- 只在 /settlements 和 /timeline 页面加载 D3 -->
<script>
  const { renderDotMatrix } = await import('../utils/d3-charts.js');
  renderDotMatrix('#casualties-chart', data);
</script>
```

### 10.4 SEO 配置

```astro
<!-- BaseLayout.astro -->
<meta name="description" content={description} />
<meta property="og:title" content={title} />
<meta property="og:image" content={ogImage} />
<link rel="canonical" href={canonicalUrl} />
<script type="application/ld+json" set:html={JSON.stringify({
  "@context": "https://schema.org",
  "@type": "HistoricalEvent",
  "name": title,
  "startDate": date,
  "location": location,
})} />
```

---

## 11. 扩展路线图

### v1.0（MVP）

- [ ] 首页竖向时间轴（1939-1955）
- [ ] 战败国条约执行可视化（德/日/意）
- [ ] 核心战役详情页（20-30条）
- [ ] 人物档案（10-15人）
- [ ] GitHub 协作流程完整搭建（CI + PR 模板 + CONTRIBUTING.md）

### v1.1

- [ ] 地图视图（Leaflet，标注战役地点）
- [ ] 全局搜索（Pagefind，纯静态全文检索，无需后端）
- [ ] 多语言支持（中 / 英，Astro i18n）

### v1.2

- [ ] 伤亡数字点阵图（D3 动画）
- [ ] 跨国条款对比视图
- [ ] 历史照片墙

### v2.0（长期）

- [ ] 冷战延伸内容（1955-1991）
- [ ] 播客 / 视频内嵌支持
- [ ] 贡献者荣誉墙

---

## 附录 A：快速启动

```bash
# 1. 创建项目
npm create astro@latest echoes-of-1945 -- --template minimal
cd echoes-of-1945

# 2. 安装依赖
npm install @astrojs/mdx @astrojs/sitemap alpinejs

# 3. 本地开发
npm run dev

# 4. 构建检查
npm run build

# 5. 预览
npm run preview
```

## 附录 B：贡献者速查（CONTRIBUTING.md 摘要）

```
新增事件：src/content/events/YYYY-事件名.md
新增人物：src/content/people/姓名拼音.md
新增专题：src/content/aftermath/主题名.md
图片目录：public/images/events/ 或 people/
图片格式：WebP 优先，JPG 备用，文件名用连字符
来源要求：至少一条可查证来源（书籍/论文/权威网站）
```

---

*文档版本：v1.0 | 最后更新：2026-07-15*
