# 京工文脉｜北京工业文化数字学习平台

一个面向高校思政课、研学实践和公众学习的多页面静态网站。网站以北京工业文化为主线，提供工业年轮、物质文化、制度文化、精神文化、科技图谱、研学路线、外部资源与思政词典等独立页面。

## 本地浏览

直接双击 `index.html` 可以浏览大部分内容。语音导读、AI 问答和部分动态功能建议通过本地服务器测试：

```powershell
python -m http.server 8000
```

打开 `http://127.0.0.1:8000/`。

## 页面结构

- `index.html`：门户首页
- `history.html`：按公开坐标定位 8 个工业地标的北京行政区底图、历史时间轴、四个理解维度
- `materials.html`：8 个物质文化资源总览与分类检索
- `material-*.html`：8 个独立物质资源详情页
- `institutions.html`：8 个可点开的制度文化专题，内含 1—2 个案例、案例讲解和最多 3 个分类外部链接
- `spirit.html`：6 种工业精神、人物故事与公开视频入口
- `innovation.html`：北京高精尖产业科技树
- `routes.html`：独立研学路线、学校工业文化活动支线、路线详情弹窗与打印任务单
- `resources.html`：场馆、园区、政策、视频与在线资源导航
- `glossary.html`：思政元素微词典；页面标签点击后原位显示含义、核心思想和现实示例
- `404.html`：页面未找到提示

## Netlify 部署

项目已经加入 `netlify.toml`，发布目录为项目根目录，Netlify Function 目录为 `netlify/functions`。

推荐使用 GitHub / Git 仓库连接 Netlify：

1. 将整个项目上传到 Git 仓库。
2. 在 Netlify 选择 **Add new site → Import an existing project**。
3. 构建命令留空，Publish directory 填 `.`。
4. 在 **Site configuration → Environment variables** 中添加：

```text
DEEPSEEK_API_KEY=你的 DeepSeek API Key
DEEPSEEK_MODEL=deepseek-chat
DEEPSEEK_BASE_URL=https://api.deepseek.com/chat/completions
```

5. 重新部署。

注意：API Key 只能放在 Netlify 环境变量中，不要写进 `assets/js/`、`index.html` 或提交到 Git。前端请求地址为 `/api/chat`，由 `netlify.toml` 转发到 `netlify/functions/chat.js`。

如果直接使用 Netlify 拖拽上传，静态页面可以正常显示，但 Netlify Functions 可能不会被部署，因此 AI 问答无法调用 DeepSeek。需要 AI 功能时请使用 Git 部署或 Netlify CLI。

## AI 问答

- 前端入口：全站右下角「AI 导览」和导航栏「AI 问答」
- 前端请求：`/api/chat`
- 服务端函数：`netlify/functions/chat.js`
- 环境变量：`DEEPSEEK_API_KEY`
- 模型：默认 `deepseek-chat`
- 本地或服务未配置时：自动降级为内置关键词回答，页面不会报错

`chat.js` 已限制问题长度、消息数量和回答长度，并明确要求模型不编造史实、数据、访谈和场馆开放信息。

## 内容维护

主要内容集中在：

- `assets/js/data.js`：时间节点、物质资源、制度案例、精神谱系、科技树、外部资源、思政词典
- `assets/js/pages.js`：各页面渲染和交互
- `assets/js/common.js`：导航、页脚、AI 导览、思政高亮、语音导读
- `styles.css`：视觉样式与响应式布局

外部链接均指向具体的官方网站、文章、报道或视频，不使用搜索结果页。正式发布前仍建议逐条检查场馆开放、预约方式和政府网站地址。

## 多媒体与版权

- 网站图片来自 Wikimedia Commons 等开放许可来源，详见 `CREDITS.md`。
- 劳模访谈和纪录片只提供公开视频平台入口，不下载、不转存、不伪造访谈。
- 真实 360° VR 未制作；如找到稳定的官方全景入口，可在 `assets/js/data.js` 的资源链接中补充。
- 浏览器中文语音导读使用 Web Speech API，不依赖额外音频文件。
- AI 回答仅作学习参考，正式教学时应核验史实与来源。

## 检查

无需安装依赖。可运行：

```bash
npm run check
```

检查全部主要 JavaScript 文件语法。