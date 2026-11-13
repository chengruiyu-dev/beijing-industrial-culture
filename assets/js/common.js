'use strict';


function icon(id) {
  return `<svg aria-hidden="true"><use href="#icon-${id}"/></svg>`;
}

function renderSprite() {
  if (document.getElementById('siteSvgSprite')) return;
  const sprite = document.createElement('div');
  sprite.id = 'siteSvgSprite';
  sprite.className = 'svg-sprite';
  sprite.setAttribute('aria-hidden', 'true');
  sprite.innerHTML = `<svg><symbol id="icon-arrow" viewBox="0 0 24 24"><path d="M5 12h14M13 6l6 6-6 6"/></symbol><symbol id="icon-arrow-up" viewBox="0 0 24 24"><path d="M12 19V5M6 11l6-6 6 6"/></symbol><symbol id="icon-search" viewBox="0 0 24 24"><circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/></symbol><symbol id="icon-close" viewBox="0 0 24 24"><path d="m6 6 12 12M18 6 6 18"/></symbol><symbol id="icon-external" viewBox="0 0 24 24"><path d="M14 4h6v6M20 4l-9 9"/><path d="M19 13v5a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h5"/></symbol><symbol id="icon-building" viewBox="0 0 24 24"><path d="M4 21V7l8-4v18M12 9h8v12M2 21h20M7 9h2M7 13h2M7 17h2M16 13h1M16 17h1"/></symbol><symbol id="icon-archive" viewBox="0 0 24 24"><path d="M4 7h16v14H4zM3 3h18v4H3zM9 12h6"/></symbol><symbol id="icon-flame" viewBox="0 0 24 24"><path d="M12 22c4 0 7-3 7-7 0-3-2-6-4-8 0 2-1 4-3 5 1-4-1-7-3-9 0 5-4 7-4 12 0 4 3 7 7 7Z"/><path d="M9.5 17.5c0 2 1 3 2.5 3s2.5-1 2.5-3c0-1.5-1-3-2.5-4 0 1-1 2-1.5 2.5.3-1.5-.2-3-1-4-.5 2-1 3.5-1 5.5Z"/></symbol><symbol id="icon-route" viewBox="0 0 24 24"><circle cx="6" cy="18" r="2"/><circle cx="18" cy="6" r="2"/><path d="M8 18h3a3 3 0 0 0 3-3V9a3 3 0 0 1 3-3h-1"/></symbol><symbol id="icon-book" viewBox="0 0 24 24"><path d="M4 5a3 3 0 0 1 3-3h5v19H7a3 3 0 0 0-3 3V5ZM20 5a3 3 0 0 0-3-3h-5v19h5a3 3 0 0 1 3 3V5Z"/></symbol><symbol id="icon-play" viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="m10 8 6 4-6 4V8Z"/></symbol><symbol id="icon-users" viewBox="0 0 24 24"><circle cx="9" cy="8" r="4"/><path d="M2 21v-2a7 7 0 0 1 14 0v2M16 4a4 4 0 0 1 0 8M18 15a6 6 0 0 1 4 6"/></symbol><symbol id="icon-cpu" viewBox="0 0 24 24"><rect x="7" y="7" width="10" height="10" rx="1"/><path d="M9 1v3M15 1v3M9 20v3M15 20v3M1 9h3M1 15h3M20 9h3M20 15h3M10 10h4v4h-4z"/></symbol><symbol id="icon-check" viewBox="0 0 24 24"><path d="m5 12 4 4L19 6"/></symbol><symbol id="icon-print" viewBox="0 0 24 24"><path d="M6 9V3h12v6M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><path d="M6 14h12v7H6z"/></symbol></svg>`;
  document.body.prepend(sprite);
}
const NAV_ITEMS = [
  ['index.html', '首页', 'home'],
  ['history.html', '工业年轮', 'history'],
  ['materials.html', '物质文化', 'materials'],
  ['institutions.html', '制度文化', 'institutions'],
  ['spirit.html', '精神文化', 'spirit'],
  ['innovation.html', '科技图谱', 'innovation'],
  ['routes.html', '研学路线', 'routes'],
  ['resources.html', '资源导航', 'resources']
];

const GLOSSARY = typeof glossaryDictionary !== "undefined" ? glossaryDictionary : {};

function renderHeader() {
  const mount = document.getElementById('siteHeader');
  if (!mount) return;
  const active = document.body.dataset.page || '';
  const links = NAV_ITEMS.map(([href, label, key]) =>
    `<a href="${href}"${active === key ? ' class="active" aria-current="page"' : ''}>${label}</a>`
  ).join('');
  mount.innerHTML = `
    <header class="site-header" id="siteHeaderInner">
      <div class="header-inner">
        <a class="brand" href="index.html" aria-label="京工文脉首页">
          <span class="brand-mark" aria-hidden="true">
            <svg viewBox="0 0 44 44"><path d="M7 34V13h9v21M18 34V7h8v27M28 34V17h9v17M3 34h38M10 17h3M10 22h3M10 27h3M31 22h3M31 27h3"/></svg>
          </span>
          <span class="brand-copy"><strong>京工文脉</strong><small>BEIJING INDUSTRIAL CULTURE</small></span>
        </a>
        <nav class="primary-nav" id="primaryNav" aria-label="主导航">${links}</nav>
        <div class="header-tools">
          <button class="ai-header-button" type="button" data-ai-open><span class="ai-dot"></span>AI 问答</button>
          <button class="nav-toggle" id="navToggle" type="button" aria-expanded="false" aria-controls="primaryNav" aria-label="打开导航"><span></span><span></span><span></span></button>
        </div>
      </div>
    </header>`;
}

function renderFooter() {
  const mount = document.getElementById('siteFooter');
  if (!mount) return;
  mount.innerHTML = `
    <footer class="site-footer">
      <div class="container footer-grid">
        <div class="footer-brand">
          <span class="brand-mark small" aria-hidden="true"><svg viewBox="0 0 44 44"><path d="M7 34V13h9v21M18 34V7h8v27M28 34V17h9v17M3 34h38M10 17h3M10 22h3M10 27h3M31 22h3M31 27h3"/></svg></span>
          <div><strong>京工文脉</strong><p>北京工业文化数字学习平台</p></div>
        </div>
        <div class="footer-links">
          <a href="history.html">工业年轮</a><a href="materials.html">物质文化</a><a href="institutions.html">制度文化</a><a href="spirit.html">精神文化</a><a href="innovation.html">科技图谱</a><a href="routes.html">研学路线</a><a href="resources.html">资源导航</a><a href="glossary.html">思政词典</a>
        </div>
        <div class="footer-note">
          <p>本站为教学展示与公益学习用途。外部资源版权归原网站所有；部分照片来自 Wikimedia Commons，遵循相应开放许可。</p>
          <button type="button" data-ai-open>有问题？试试 AI 导览 <svg><use href="#icon-arrow"/></svg></button>
        </div>
      </div>
      <div class="container footer-bottom">
        <span>© <span id="currentYear"></span> 京工文脉 · 北京工业文化学习平台</span>
        <span>BEIJING INDUSTRIAL CULTURE · LEARNING BY PLACE</span>
      </div>
    </footer>`;
}

function renderAI() {
  if (document.querySelector('.ai-assistant')) return;
  const panel = document.createElement('aside');
  panel.className = 'ai-assistant';
  panel.setAttribute('aria-label', 'AI 工业文化导览');
  panel.innerHTML = `
    <button class="ai-fab" type="button" aria-label="打开 AI 导览" data-ai-toggle>
      <span class="ai-spark">✦</span><span>AI导览</span>
    </button>
    <section class="ai-panel" aria-hidden="true">
      <header class="ai-panel-head">
        <div><span class="ai-status-dot"></span><strong>京工 AI 导览</strong><small>DeepSeek 智能问答</small></div>
        <button type="button" class="ai-close" aria-label="关闭 AI 导览" data-ai-close><svg><use href="#icon-close"/></svg></button>
      </header>
      <div class="ai-messages" aria-live="polite">
        <div class="ai-message bot">你好，我是京工文脉的 AI 导览。你可以问我“首钢园为什么值得去”“制度建设如何影响工业发展”或“推荐一条研学路线”。</div>
      </div>
      <div class="ai-quick">
        <button type="button" data-ai-prompt="推荐一条北京工业文化研学路线">推荐研学路线</button>
        <button type="button" data-ai-prompt="首钢园有哪些工业文化看点和思政元素？">首钢园看点</button>
        <button type="button" data-ai-prompt="岗位责任制和工匠精神有什么关系？">制度与精神</button>
      </div>
      <form class="ai-form">
        <label class="sr-only" for="aiInput">输入问题</label>
        <input id="aiInput" autocomplete="off" maxlength="500" placeholder="输入你的问题…">
        <button type="submit" aria-label="发送问题"><svg><use href="#icon-arrow"/></svg></button>
      </form>
      <p class="ai-disclaimer">AI 回答仅作学习参考，重要史实与参观信息请以权威来源为准。</p>
    </section>`;
  document.body.appendChild(panel);
}

function setupAI() {
  const panel = document.querySelector('.ai-assistant');
  if (!panel) return;
  const sheet = panel.querySelector('.ai-panel');
  const messages = panel.querySelector('.ai-messages');
  const form = panel.querySelector('.ai-form');
  const input = panel.querySelector('#aiInput');
  const openButtons = document.querySelectorAll('[data-ai-open], [data-ai-toggle]');
  const closeButton = panel.querySelector('[data-ai-close]');
  let busy = false;

  const setOpen = (open) => {
    panel.classList.toggle('open', open);
    sheet.setAttribute('aria-hidden', String(!open));
    if (open) setTimeout(() => input.focus(), 220);
  };

  openButtons.forEach((button) => button.addEventListener('click', () => setOpen(true)));
  closeButton.addEventListener('click', () => setOpen(false));
  panel.querySelectorAll('[data-ai-prompt]').forEach((button) => {
    button.addEventListener('click', () => {
      input.value = button.dataset.aiPrompt;
      form.requestSubmit();
    });
  });

  const addMessage = (text, role = 'bot') => {
    const bubble = document.createElement('div');
    bubble.className = `ai-message ${role}`;
    bubble.textContent = text;
    messages.appendChild(bubble);
    messages.scrollTop = messages.scrollHeight;
    return bubble;
  };

  function localAnswer(question) {
    const q = question.toLowerCase();
    if (q.includes('首钢')) return '首钢园把高炉、冷却塔、铁路等工业记忆与冬奥场馆、科技园区、公共文化空间连接起来。建议重点看三高炉、群明湖和滑雪大跳台，并思考“保留工业记忆”与“引入新功能”如何平衡。';
    if (q.includes('制度')) return '制度文化把个人经验转化为组织能力。岗位责任制解决“谁负责”，质量三检制解决“怎样保证品质”，安全生产制守住底线，创新激励制让一线智慧进入改进流程。';
    if (q.includes('研学') || q.includes('路线')) return '可以试试三条路线：①首钢园—三高炉—滑雪大跳台；②中国铁道博物馆—北京汽车博物馆；③中关村—科技企业展厅。每条路线都建议带着“过去如何生产、今天如何使用、未来如何创新”三个问题。';
    if (q.includes('精神')) return '工业精神可以从大庆精神、两弹一星精神、载人航天精神、劳模精神、劳动精神和工匠精神六条线索理解。建议阅读对应故事，并把它与今天的职业选择、团队协作和社会责任联系起来。';
    return 'AI 服务当前处于本地预览模式。部署到 Netlify 并配置 DEEPSEEK_API_KEY 后，就可以进行连续问答。你也可以先浏览“工业年轮”“精神文化”和“资源导航”中的内容。';
  }

  async function ask(question) {
    if (!question.trim() || busy) return;
    busy = true;
    addMessage(question, 'user');
    input.value = '';
    const pending = addMessage('正在查找资料…', 'bot pending');
    try {
      if (window.location.protocol === 'file:') throw new Error('local-preview');
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [{ role: 'user', content: question }],
          context: document.body.dataset.aiContext || document.title
        })
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.message || 'AI 服务暂未配置');
      pending.textContent = data.reply || localAnswer(question);
    } catch (error) {
      pending.textContent = localAnswer(question);
      pending.classList.remove('pending');
    } finally {
      pending.classList.remove('pending');
      busy = false;
      messages.scrollTop = messages.scrollHeight;
    }
  }

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    ask(input.value);
  });
}

function setupNavigation() {
  const header = document.getElementById('siteHeaderInner');
  const navToggle = document.getElementById('navToggle');
  const primaryNav = document.getElementById('primaryNav');
  const progress = document.getElementById('scrollProgress');
  if (!header) return;

  const closeNav = () => {
    document.body.classList.remove('nav-open');
    navToggle.setAttribute('aria-expanded', 'false');
    navToggle.setAttribute('aria-label', '打开导航');
  };
  navToggle.addEventListener('click', () => {
    const open = document.body.classList.toggle('nav-open');
    navToggle.setAttribute('aria-expanded', String(open));
    navToggle.setAttribute('aria-label', open ? '关闭导航' : '打开导航');
  });
  primaryNav.querySelectorAll('a').forEach((link) => link.addEventListener('click', closeNav));
  window.addEventListener('resize', () => { if (window.innerWidth > 1080) closeNav(); });

  const update = () => {
    const scrollTop = window.scrollY;
    header.classList.toggle('scrolled', scrollTop > 24);
    const max = document.documentElement.scrollHeight - window.innerHeight;
    if (progress) progress.style.width = `${max > 0 ? Math.min(100, scrollTop / max * 100) : 0}%`;
  };
  window.addEventListener('scroll', update, { passive: true });
  update();
}

function setupGlossary() {
  const definitions = GLOSSARY;
  const terms = Object.keys(definitions).sort((a, b) => b.length - a.length);
  const pattern = new RegExp(`(${terms.map((term) => term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|')})`, 'g');

  if (!setupGlossary.tooltip) {
    const tooltip = document.createElement('div');
    tooltip.className = 'glossary-tooltip';
    tooltip.setAttribute('role', 'tooltip');
    tooltip.innerHTML = '<strong></strong><div class="glossary-tooltip-section"><small>含义</small><p data-field="meaning"></p></div><div class="glossary-tooltip-section"><small>核心思想</small><p data-field="core"></p></div><div class="glossary-tooltip-section"><small>现实示例</small><p data-field="example"></p></div><a href="glossary.html">查看完整思政微词典 →</a>';
    document.body.appendChild(tooltip);

    const showTooltip = (button) => {
      const hostDialog = button.closest('dialog[open]');
      if (hostDialog && tooltip.parentElement !== hostDialog) hostDialog.appendChild(tooltip);
      if (!hostDialog && tooltip.parentElement !== document.body) document.body.appendChild(tooltip);
      const entry = definitions[button.dataset.term] || {};
      tooltip.querySelector('strong').textContent = button.dataset.term;
      tooltip.querySelector('[data-field="meaning"]').textContent = entry.meaning || '';
      tooltip.querySelector('[data-field="core"]').textContent = entry.core || '';
      tooltip.querySelector('[data-field="example"]').textContent = entry.example || '';
      const rect = button.getBoundingClientRect();
      tooltip.style.left = `${Math.max(12, Math.min(window.innerWidth - 332, rect.left))}px`;
      tooltip.style.top = `${Math.max(12, Math.min(window.innerHeight - 300, rect.bottom + 10))}px`;
      tooltip.classList.add('show');
      button.setAttribute('aria-expanded', 'true');
    };
    const hideTooltip = () => {
      tooltip.classList.remove('show');
      document.querySelectorAll('.glossary-term[aria-expanded="true"]').forEach((term) => term.setAttribute('aria-expanded', 'false'));
    };

    document.addEventListener('click', (event) => {
      const term = event.target.closest('.glossary-term');
      if (term) {
        event.preventDefault();
        event.stopPropagation();
        if (term.getAttribute('aria-expanded') === 'true') hideTooltip(); else showTooltip(term);
        return;
      }
      if (!event.target.closest('.glossary-tooltip')) hideTooltip();
    });
    document.addEventListener('keydown', (event) => { if (event.key === 'Escape') hideTooltip(); });
    setupGlossary.tooltip = tooltip;
    setupGlossary.hide = hideTooltip;
  }

  document.querySelectorAll('.rich-text').forEach((root) => {
    if (root.dataset.glossaryReady) return;
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
      acceptNode(node) {
        if (!node.nodeValue.trim()) return NodeFilter.FILTER_REJECT;
        if (node.parentElement.closest('a, button, .glossary-term, script, style')) return NodeFilter.FILTER_REJECT;
        return NodeFilter.FILTER_ACCEPT;
      }
    });
    const textNodes = [];
    while (walker.nextNode()) textNodes.push(walker.currentNode);
    textNodes.forEach((node) => {
      const text = node.nodeValue;
      pattern.lastIndex = 0;
      if (!pattern.test(text)) { pattern.lastIndex = 0; return; }
      pattern.lastIndex = 0;
      const fragment = document.createDocumentFragment();
      let last = 0;
      text.replace(pattern, (match, _group, offset) => {
        if (offset > last) fragment.appendChild(document.createTextNode(text.slice(last, offset)));
        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'glossary-term';
        button.dataset.term = match;
        button.setAttribute('aria-expanded', 'false');
        button.textContent = match;
        fragment.appendChild(button);
        last = offset + match.length;
        return match;
      });
      if (last < text.length) fragment.appendChild(document.createTextNode(text.slice(last)));
      node.parentNode.replaceChild(fragment, node);
    });
    root.dataset.glossaryReady = 'true';
  });
}
function setupReveal() {
  const elements = document.querySelectorAll('.reveal');
  if (!('IntersectionObserver' in window)) {
    elements.forEach((element) => element.classList.add('visible'));
    return;
  }
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -30px' });
  elements.forEach((element) => observer.observe(element));
}

function setupAudioGuides() {
  document.querySelectorAll('[data-speak]').forEach((button) => {
    if (button.dataset.speechReady === 'true') return;
    button.dataset.speechReady = 'true';
    button.addEventListener('click', () => {
      if (!('speechSynthesis' in window)) {
        button.textContent = '当前浏览器不支持语音朗读';
        return;
      }
      window.speechSynthesis.cancel();
      const target = document.getElementById(button.dataset.speak);
      if (!target) return;
      const utterance = new SpeechSynthesisUtterance(target.innerText.trim());
      utterance.lang = 'zh-CN';
      utterance.rate = 0.92;
      window.speechSynthesis.speak(utterance);
      button.classList.add('speaking');
      utterance.onend = () => button.classList.remove('speaking');
      utterance.onerror = () => button.classList.remove('speaking');
    });
  });
}

document.addEventListener('DOMContentLoaded', () => {
  renderSprite();
  renderHeader();
  renderFooter();
  renderAI();
  setupNavigation();
  setupAI();
  setupGlossary();
  setupReveal();
  setupAudioGuides();
  const year = document.getElementById('currentYear');
  if (year) year.textContent = new Date().getFullYear();
});