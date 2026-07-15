# 数据来源网站 / Authoritative Source Registry

本项目对二战资料的核查，优先使用以下权威来源网站。每条内容的 `sources` 应尽量引用其中之一（官方/一手 > 权威机构/百科），并在可能时附上具体页面 URL。

When verifying WWII data, prefer the authoritative sites below. Each entry's
`sources` should cite at least one of these (official/primary sources rank above
encyclopedic/institutional ones), with a specific page URL where possible.

## 一手 / 官方档案 (Primary & official archives)

| 站点 | 用途 | URL |
|---|---|---|
| U.S. Dept. of State — Office of the Historian (FRUS) | 战时会议纪要、外交文件（德黑兰/雅尔塔/波茨坦）| https://history.state.gov |
| Avalon Project (Yale Law) | 条约与法律文件原文（投降书、和约、宪章、纽伦堡宪章）| https://avalon.law.yale.edu |
| United Nations | 《联合国宪章》《世界人权宣言》原文与史料 | https://www.un.org |
| NATO | 《北大西洋公约》原文与官方历史 | https://www.nato.int |
| U.S. National Archives (NARA) | 美方战时档案、照片、文件 | https://www.archives.gov |
| CVCE / EU archives | 马歇尔计划、欧洲一体化文件 | https://www.cvce.eu |

## 权威机构 / 博物馆 (Institutions & museums)

| 站点 | 用途 | URL |
|---|---|---|
| The National WWII Museum (New Orleans) | 战役、人物、统计数据 | https://www.nationalww2museum.org |
| Imperial War Museums (IWM) | 战役、人物、装备、照片 | https://www.iwm.org.uk |
| U.S. Holocaust Memorial Museum (USHMM) | 大屠杀、战争罪行、审判 | https://www.ushmm.org |
| Yad Vashem | 大屠杀史料 | https://www.yadvashem.org |
| Nobel Prize | 诺贝尔和平奖相关（如马歇尔）| https://www.nobelprize.org |

## 权威参考 / 百科 (Reference works)

| 站点 | 用途 | URL |
|---|---|---|
| Encyclopædia Britannica | 事件/人物概览与关键数字交叉核对 | https://www.britannica.com |
| HISTORY (A&E) | 概览与时间线 | https://www.history.com |
| Wikipedia（仅作交叉核对起点，须回溯到上述权威来源）| 快速交叉核对 | https://en.wikipedia.org · https://zh.wikipedia.org |

## 核查原则 / Verification principles

1. **两源交叉**：关键事实（日期、地点、伤亡/产量数字）尽量由**两个独立权威来源**确认。
2. **数字用约数/区间**：历史估算存在分歧时，取权威来源的约数或区间，不给虚假精确值。
3. **争议显式标注**：来源之间存在实质分歧时，设 `verificationStatus: disputed` 并在 `disputed` 字段说明分歧。
4. **回溯一手**：百科（尤其 Wikipedia）仅作起点，结论须回溯到官方/学术来源。
5. **URL 稳定性**：优先引用官方稳定页面；`sources[].url` 只填能确认指向该主题的页面。
