# 数字伴侣长期记忆评测

设计草案与文档站。研究长期数字伴侣的共同经历、用户理解、人格连续性、自然回忆、关系发展与记忆边界。

仓库：https://github.com/XnneHangLab/memory-bench （初始为私有仓库）。

## 查看文档

直接打开 `docs/index.html`，或从仓库根目录运行：

```sh
python -m http.server 8000 --directory docs
```

访问 http://localhost:8000 。站点使用原生 HTML、CSS、SVG 和 JavaScript，无第三方依赖、外部字体或构建步骤。JavaScript 关闭时仍可阅读全部设计正文。

## 内容与状态

- `docs/index.html`：动机、六维定义、试验协议、评分、参考研究与开放问题。
- `docs/radar.js`：六维可交互示意图；数值是人工演示，不是实验结果。
- `scripts/check_site.py`：链接、图表维度与文档基本完整性检查。

```sh
python scripts/check_site.py
node --check docs/radar.js
node scripts/check_radar.cjs
```

当前为 **v0.1 设计草案**，尚无运行器、正式测试集或实测排行榜。图表用于解释维度，不能解释为系统成绩。实际实验前应冻结数据版本、评分规则与运行配置。

如需 GitHub Pages，可将部署来源设置为本仓库分支的 `/docs`；仓库可见性与组织套餐可能影响 Pages 可用性。当前不包含自动发布流程。
