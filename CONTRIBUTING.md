# 贡献指南

欢迎参与 **Echoes of 1945** 的内容贡献！本项目采用开源协作模式，贡献者只需编写 Markdown，无需懂代码。

## 快速速查

| 贡献类型 | 文件位置 | 模板 |
|---|---|---|
| 新增战役/事件 | `src/content/events/{en,zh}/YYYY-事件名.md` | 见下方 |
| 新增人物档案 | `src/content/people/{en,zh}/姓名拼音.md` | 见下方 |
| 新增会议/外交 | `src/content/conferences/{en,zh}/YYYY-会议名.md` | 见下方 |
| 新增战后专题 | `src/content/aftermath/{en,zh}/主题名.md` | 见下方 |
| 更新条约数据 | `src/content/settlements/country.json` | 见 JSON 结构说明 |

> **双语要求**：内容按语言分目录，英文放 `en/`、中文放 `zh/`，两者用相同的文件名（slug）。请尽量同时提供中英两版。
>
> **条约数据（settlements）为单文件双语**：`displayName`、`treaty`、`label`、`note` 等文本字段写成 `{ "en": "...", "zh": "..." }`，数字/状态字段只写一次。

## 图片规范

- **目录**：`public/images/events/`、`public/images/people/`、`public/images/gallery/`
- **格式**：WebP 优先，JPG 备用
- **文件名**：使用连字符，如 `d-day-omaha-beach.webp`
- **版权**：只提交公共领域（Public Domain）或 CC 授权的图片，并在 `coverCaption` 注明来源

## 内容质量与准确性审核 / Accuracy & review

本项目对准确性有**构建门禁 + 编辑核查**两道保障：

**1. 构建门禁（自动，强制）**
- 每条内容 `sources` 至少一条，否则 `npm run build` 失败（zod 校验）。
- `verificationStatus: disputed` 的条目必须填写 `disputed` 说明，否则构建失败。
- 条约 JSON 由 `npm run check:settlements`（构建前自动运行）校验：每条 clause 有来源、文本字段中英齐全、争议条款有双语说明。

**2. 编辑核查（人工）**
- 关键事实（日期、地点、伤亡/产量等数字）尽量以**两个独立权威来源交叉**核对。
- 权威来源优先级：官方/一手档案 > 学术专著/期刊 > 权威机构网站；避免论坛、无署名内容。
- 历史估算数字用**约数/区间**，不给虚假精确值；存在分歧时在正文注明。
- 存在史学争议的内容一律 `verificationStatus: disputed` + `disputed` 说明，正文中立陈述各方。
- 不做娱乐化处理，尊重历史事实。

**审核字段（所有集合通用）**
```yaml
verificationStatus: verified   # verified | needs-review | disputed（默认 needs-review）
lastReviewed: "2026-07-15"      # 最近核查日期（可选）
disputed: "争议说明"            # status 为 disputed 时必填
```

**来源字段结构**
```yaml
sources:
  - title: "书名 / 文件名"     # 必填
    author: 作者                # 可选
    publisher: 出版社           # 可选
    year: 1948                  # 可选（整数）
    page: "第五条"              # 可选
    url: https://...            # 可选
    type: book                  # 可选：book|article|document|archive|website|other
```

## 事件模板

```yaml
---
title: 事件名称
titleEn: English Title (可选)
date: "YYYY-MM-DD"
dateEnd: "YYYY-MM-DD"  # 可选，结束日期
location: 发生地点
coordinates: [纬度, 经度]  # 可选
theater: europe  # europe | pacific | africa | other
tags: [标签1, 标签2]
cover: /images/events/文件名.jpg  # 可选
coverCaption: "图片说明 · 来源"  # 可选
significance: major  # minor | major | turning-point
casualties:          # 可选；数值须为纯整数
  allies: 10000
  axis: 5000
  civilian: 2000
verificationStatus: verified  # verified | needs-review | disputed
lastReviewed: "2026-07-15"     # 可选
sources:               # 必填，至少一条
  - title: "参考书目名称"
    author: 作者名
    url: https://...  # 可选
---

正文内容（Markdown 格式）...
```

## 人物模板

```yaml
---
name: 人物姓名
nameEn: English Name (可选)
born: "YYYY-MM-DD"
died: "YYYY-MM-DD"  # 可选
nationality: 国籍
role: 职务/身份描述
side: allies  # allies | axis | neutral
tags: [标签1, 标签2]
relatedEvents: [en/事件slug]  # 可选，注意语言前缀
verificationStatus: verified  # verified | needs-review | disputed
sources:               # 必填，至少一条
  - title: "参考书目名称"
    author: 作者名
---

人物简介...
```

## 会议模板

```yaml
---
title: 会议名称
titleEn: English Title (可选)
date: "YYYY-MM-DD"
dateEnd: "YYYY-MM-DD"  # 可选
location: 举办地点
coordinates: [纬度, 经度]  # 可选
participants: [与会方1, 与会方2]  # 必填
outcomes: [主要成果1, 主要成果2]  # 必填
tags: [标签1, 标签2]
verificationStatus: verified
sources:               # 必填，至少一条
  - title: "档案或文献名称"
---

会议背景与内容...
```

## 本地开发

```bash
npm install
npm run dev      # 启动开发服务器
npm run build    # 构建检查（提交前必须通过）
```

## 提交流程

1. Fork 本仓库
2. 新建分支（如 `add-event-stalingrad`）
3. 按模板创建内容文件
4. 本地运行 `npm run build` 确认无报错
5. 提交 Pull Request，填写 PR 模板
6. CI 自动构建检查，维护者审核内容质量
7. 合并后自动部署上线
