# 数字伴侣长期记忆评测

设计草案与文档站。研究长期数字伴侣的共同经历、用户理解、人格连续性、自然回忆、关系发展与记忆边界。

仓库：https://github.com/XnneHangLab/memory-bench

文档站：https://xnnehanglab.github.io/memory-bench/

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
node scripts/check_theme.cjs
```

当前为 **v0.1 设计草案**，尚无运行器、正式测试集或实测排行榜。图表用于解释维度，不能解释为系统成绩。实际实验前应冻结数据版本、评分规则与运行配置。

## 自动部署

GitHub Pages 从 `gh-pages` 分支根目录提供站点。主分支 `main` 的文档、检查脚本或部署工作流更新后，`.github/workflows/docs-deploy.yml` 会先运行离线检查，再将 `docs/` 发布到 `gh-pages`；也支持在 Actions 中手动触发。

部署参考组织站点 [XnneHangLab/XnneHangLab](https://github.com/XnneHangLab/XnneHangLab) 的 `peaceiris/actions-gh-pages` 工作流。导航组织参考 memU 文档站，视觉风格参考 [yutto-uiya](https://github.com/XnneHangLab/yutto-uiya) 的 VitePress 默认主题：蓝紫色主色、浅灰卡片、分组侧栏和圆角入口按钮，并提供页头明暗切换按钮：每次打开或刷新页面默认浅色，可在当前页面手动切换明暗。本站使用静态文件，无需构建。资源使用相对路径，适配 `/memory-bench/` 项目路径。
