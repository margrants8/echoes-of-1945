# 贡献指南

欢迎参与 **Echoes of 1945** 的内容贡献！本项目采用开源协作模式，贡献者只需编写 Markdown，无需懂代码。

## 快速速查

| 贡献类型 | 文件位置 | 模板 |
|---|---|---|
| 新增战役/事件 | `src/content/events/YYYY-事件名.md` | 见下方 |
| 新增人物档案 | `src/content/people/姓名拼音.md` | 见下方 |
| 新增战后专题 | `src/content/aftermath/主题名.md` | 见下方 |
| 更新条约数据 | `src/content/settlements/country.json` | 见 JSON 结构说明 |

## 图片规范

- **目录**：`public/images/events/`、`public/images/people/`、`public/images/gallery/`
- **格式**：WebP 优先，JPG 备用
- **文件名**：使用连字符，如 `d-day-omaha-beach.webp`
- **版权**：只提交公共领域（Public Domain）或 CC 授权的图片，并在 `coverCaption` 注明来源

## 内容质量要求

- 每条内容至少一条可查证来源（书籍、学术论文、权威网站）
- 如内容存在历史争议，请在正文中说明，并在 frontmatter 设置相关字段
- 不做娱乐化处理，尊重历史事实

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
casualties:          # 可选
  allies: 10000
  axis: 5000
  civilian: 2000
sources:
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
photo: /images/people/文件名.jpg  # 可选
tags: [标签1, 标签2]
relatedEvents: [事件slug]  # 可选
---

人物简介...
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
