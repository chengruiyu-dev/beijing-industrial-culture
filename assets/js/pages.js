'use strict';

const qs = (selector, root = document) => root.querySelector(selector);
const qsa = (selector, root = document) => [...root.querySelectorAll(selector)];
const thoughtTagLinks = (tags) => (tags || []).map((tag) => `<button class="glossary-term thought-tag" type="button" data-term="${tag}" aria-expanded="false">${tag}</button>`).join('');
const tagLinks = (tags, light = false) => (tags || []).map((tag) => {
  const [label, href] = Array.isArray(tag) ? tag : [tag, 'materials.html'];
  return `<a class="tag-link${light ? ' light' : ''}" href="${href}">${label}</a>`;
}).join('');

function refreshPageFeatures() {
  if (typeof setupGlossary === 'function') setupGlossary();
  if (typeof setupReveal === 'function') setupReveal();
  if (typeof setupAudioGuides === 'function') setupAudioGuides();
}

function initHome() {
  const featured = ['shougang', 'zhongguancun', 'cloisonne'].map((id) => materialData.find((item) => item.id === id)).filter(Boolean);
  const grid = qs('#homeFeatured');
  if (grid) {
    grid.innerHTML = featured.map((item, index) => `
      <a class="feature-mini reveal" href="${item.page}">
        <span>${String(index + 1).padStart(2, '0')} / ${item.category}</span>
        <div><h3>${item.title}</h3><p>${item.short}</p></div>
        <b>查看资源详情 →</b>
      </a>`).join('');
  }
  refreshPageFeatures();
}

function initHistory() {
  const map = qs('#historyMap');
  if (!map) return;
  const filters = qs('#mapFilters');
  const detail = qs('#historyDetail');
  const miniTimeline = qs('#miniTimeline');

  const project = (lat, lng) => {
    const x = (58 + (lng - mapGeoBounds.minLng) / (mapGeoBounds.maxLng - mapGeoBounds.minLng) * 1084) / 1200 * 100;
    const y = (58 + (mapGeoBounds.maxLat - lat) / (mapGeoBounds.maxLat - mapGeoBounds.minLat) * 784) / 900 * 100;
    return { x, y };
  };

  const setActiveLocations = (ids = [], eventTitle = '') => {
    qsa('.map-node').forEach((node) => {
      const active = ids.includes(node.dataset.location);
      node.classList.toggle('active', active);
      node.classList.toggle('event-active', active && Boolean(eventTitle));
      const eventLabel = node.querySelector('.event-label');
      if (eventLabel && eventTitle) eventLabel.textContent = `${eventTitle} · ${node.querySelector('.location-label')?.textContent || ''}`;
    });
  };

  const relatedEventsForLocation = (locationId) => timelineEvents.filter((event) => (eventInstances[event.id] || []).includes(locationId));

  const bindRelatedEvents = () => {
    detail.querySelectorAll('[data-related-event]').forEach((button) => {
      button.addEventListener('click', () => renderEvent(timelineEvents.find((event) => event.id === button.dataset.relatedEvent)));
    });
  };

  const renderLocation = (location, push = true) => {
    if (!location) return;
    setActiveLocations([location.id]);
    qsa('#miniTimeline button').forEach((button) => button.classList.remove('active'));
    const point = project(location.lat, location.lng);
    const related = relatedEventsForLocation(location.id);
    const external = location.link.startsWith('http');
    detail.innerHTML = `
      <div class="map-detail-media"><img src="${location.image}" alt="${location.name}"></div>
      <div class="map-detail-body">
        <div class="map-detail-meta"><span>${location.year}</span><span>${location.lat.toFixed(4)}°N / ${location.lng.toFixed(4)}°E</span></div>
        <h3>${location.name}</h3>
        <p class="rich-text">${location.text}</p>
        <div class="mini-tags">${thoughtTagLinks(location.tags)}</div>
        <div class="map-detail-links"><a class="text-link" href="${location.link}"${external ? ' target="_blank" rel="noopener noreferrer"' : ''}>${external ? '查看相关文章' : '查看资源详情'} →</a></div>
        <p class="map-coordinate-note">地图坐标：${point.x.toFixed(1)}% / ${point.y.toFixed(1)}%（依据公开地址近似投影）</p>
        ${related.length ? `<div class="location-events"><small>关联时间节点</small>${related.map((event) => `<button type="button" data-related-event="${event.id}">${event.year} · ${event.title}</button>`).join('')}</div>` : ''}
      </div>`;
    bindRelatedEvents();
    if (push) history.replaceState(null, '', `history.html?place=${location.id}#map`);
    if (typeof setupGlossary === 'function') setupGlossary();
  };

  const renderEvent = (event, push = true) => {
    if (!event) return;
    const locations = (eventInstances[event.id] || []).map((id) => mapLocations.find((item) => item.id === id)).filter(Boolean);
    setActiveLocations(locations.map((item) => item.id), event.title);
    qsa('#miniTimeline button').forEach((button) => button.classList.toggle('active', button.dataset.event === event.id));
    detail.innerHTML = `
      <div class="map-detail-media"><img src="${event.image}" alt="${event.title}"></div>
      <div class="map-detail-body">
        <div class="map-detail-meta"><span>${event.year}</span><span>EVENT / ${locations.length} INSTANCE${locations.length > 1 ? 'S' : ''}</span></div>
        <h3>${event.title}</h3>
        <p class="rich-text">${event.text}</p>
        <div class="mini-tags">${thoughtTagLinks(event.tags)}</div>
        ${locations.length ? `<div class="location-events"><small>对应地标</small>${locations.map((location) => `<button type="button" data-related-location="${location.id}">${location.name}</button>`).join('')}</div>` : ''}
        <div class="map-detail-links"><a class="text-link" href="${event.link}">查看关联内容 →</a></div>
      </div>`;
    detail.querySelectorAll('[data-related-location]').forEach((button) => {
      button.addEventListener('click', () => renderLocation(mapLocations.find((location) => location.id === button.dataset.relatedLocation)));
    });
    if (push) history.replaceState(null, '', `history.html?event=${event.id}#map`);
    if (typeof setupGlossary === 'function') setupGlossary();
  };

  map.innerHTML = `
    <div class="map-route" aria-hidden="true"></div>
    ${mapLocations.map((location) => {
      const point = project(location.lat, location.lng);
      return `<button class="map-node label-${location.labelPos}" type="button" data-location="${location.id}" data-tags="${location.tags.join('|')}" style="left:${point.x}%;top:${point.y}%"><i></i><span class="location-label">${location.name}</span><span class="event-label">${location.name}</span></button>`;
    }).join('')}`;

  const allTags = [...new Set(mapLocations.flatMap((location) => location.tags))];
  filters.innerHTML = `<button class="map-tag active" type="button" data-tag="all">全部</button>${allTags.map((tag) => `<button class="map-tag" type="button" data-tag="${tag}">${tag}</button>`).join('')}`;
  miniTimeline.innerHTML = timelineEvents.map((event) => `<button type="button" data-event="${event.id}"><span>${event.year}</span><strong>${event.title}</strong></button>`).join('');

  map.addEventListener('click', (event) => {
    const node = event.target.closest('[data-location]');
    if (node) renderLocation(mapLocations.find((item) => item.id === node.dataset.location));
  });
  miniTimeline.addEventListener('click', (event) => {
    const button = event.target.closest('[data-event]');
    if (button) renderEvent(timelineEvents.find((item) => item.id === button.dataset.event));
  });
  filters.addEventListener('click', (event) => {
    const button = event.target.closest('[data-tag]');
    if (!button) return;
    filters.querySelectorAll('.map-tag').forEach((tag) => tag.classList.toggle('active', tag === button));
    const tag = button.dataset.tag;
    qsa('.map-node').forEach((node) => {
      node.classList.toggle('is-dim', tag !== 'all' && !node.dataset.tags.split('|').includes(tag));
    });
  });

  const params = new URLSearchParams(location.search);
  const requestedPlace = params.get('place');
  const requestedEvent = params.get('event');
  if (requestedPlace && mapLocations.some((item) => item.id === requestedPlace)) {
    renderLocation(mapLocations.find((item) => item.id === requestedPlace), false);
  } else if (requestedEvent && timelineEvents.some((item) => item.id === requestedEvent)) {
    renderEvent(timelineEvents.find((item) => item.id === requestedEvent), false);
  } else {
    renderLocation(mapLocations[0], false);
  }
  refreshPageFeatures();
}
function renderMaterialCard(item) {
  return `<article class="material-card ${item.featured ? 'featured' : ''} reveal" data-href="${item.page}">
    <a class="material-media" href="${item.page}" aria-label="查看${item.title}详情">
      <span class="material-category">${item.category}</span>
      <img src="${item.image}" alt="${item.title}" loading="lazy">
    </a>
    <div class="material-body">
      <span class="material-no">${item.no}</span>
      <h3><a href="${item.page}">${item.title}</a></h3>
      <p>${item.short}</p>
      <div class="material-foot">
        <div class="material-tags">${item.tags.map(([label, href]) => `<a class="tag-link" href="${href}">${label}</a>`).join('')}</div>
        <a class="material-open" href="${item.page}" aria-label="打开${item.title}">→</a>
      </div>
    </div>
  </article>`;
}

function initMaterials() {
  const grid = qs('#materialGrid');
  if (!grid) return;
  const filters = qs('#materialFilters');
  const count = qs('#materialCount');
  let current = new URLSearchParams(location.search).get('filter') || 'all';

  const render = () => {
    const items = current === 'all' ? materialData : materialData.filter((item) => item.filter === current);
    grid.innerHTML = items.map(renderMaterialCard).join('');
    count.textContent = `${items.length} 个资源点`;
    qsa('.chip', filters).forEach((chip) => chip.classList.toggle('active', chip.dataset.filter === current));
    refreshPageFeatures();
  };

  filters.addEventListener('click', (event) => {
    const chip = event.target.closest('[data-filter]');
    if (!chip) return;
    current = chip.dataset.filter;
    history.replaceState(null, '', current === 'all' ? 'materials.html' : `materials.html?filter=${current}`);
    render();
  });
  grid.addEventListener('click', (event) => {
    if (event.target.closest('a')) return;
    const card = event.target.closest('[data-href]');
    if (card) location.href = card.dataset.href;
  });
  render();


}

function initMaterialDetail() {
  const item = materialData.find((entry) => entry.id === document.body.dataset.material);
  if (!item) return;
  document.title = `${item.title}｜京工文脉`;
  const hero = qs('#materialHero');
  const content = qs('#materialDetail');
  const related = qs('#relatedMaterials');
  if (!hero || !content) return;
  hero.innerHTML = `<img src="${item.image}" alt="${item.title}">
    <div class="container">
      <div class="breadcrumb"><a href="index.html">首页</a><span>/</span><a href="materials.html">物质文化</a><span>/</span><span>${item.title}</span></div>
      <h1>${item.title}</h1>
      <p class="lead">${item.summary}</p>
      <div class="page-meta-line"><span>${item.category}</span><span>${item.facts[0][1]}</span><span>${item.tags.map(([label]) => label).join(' · ')}</span></div>
      <div class="page-tools"><button class="page-tool" type="button" data-speak="detailReadText">语音导读 ${typeof icon === 'function' ? icon('play') : '▶'}</button><a class="page-tool" href="#resources">外部资源</a><a class="page-tool" href="materials.html">返回资源总览</a></div>
    </div>`;
  content.innerHTML = `
    <div class="detail-main">
      <section id="overview">
        ${item.paragraphs.map((paragraph, index) => `<p class="${index === 0 ? 'lead-paragraph ' : ''}rich-text">${paragraph}</p>`).join('')}
        <div class="mini-tags">${tagLinks(item.tags)}</div>
      </section>
      <section id="gallery">
        <h2>现场图集</h2>
        <div class="gallery-grid">${item.gallery.map(([src, alt, caption]) => `<figure><img src="${src}" alt="${alt}" loading="lazy"><figcaption>${caption}</figcaption></figure>`).join('')}</div>
      </section>
      <section id="observe">
        <h2>现场观察</h2>
        <ul class="observe-list">${item.observe.map((text, index) => `<li><span>${String(index + 1).padStart(2, '0')}</span><div>${text}</div></li>`).join('')}</ul>
      </section>
      <section id="thought">
        <h2>思政元素</h2>
        <p class="rich-text">理解这个资源点时，可以把它放回城市更新、国家战略和普通劳动者经验之中。以下关键词不是附加标签，而是分析这个现场的不同入口。</p>
        <div class="mini-tags">${thoughtTagLinks(item.thought)}</div>
      </section>
      <section id="resources">
        <h2>外部资源与延伸阅读</h2>
        <p>场馆官网可能因维护或访问网络不同而暂时无法打开，因此同时提供地图、公开视频和权威信息搜索入口。</p>
        <div class="external-link-list">${item.resources.map(([label, url, type]) => `<a href="${url}" target="_blank" rel="noopener noreferrer"><strong>${label}</strong><span>${type} ↗</span></a>`).join('')}</div>
      </section>
      <div class="next-prev" id="nextPrev"></div>
    </div>
    <aside class="detail-aside">
      <div class="aside-card dark">
        <h3>资源档案</h3>
        <ul class="fact-list">${item.facts.map(([label, value]) => `<li><span>${label}</span><span>${value}</span></li>`).join('')}</ul>
      </div>
      <div class="audio-guide"><p>用浏览器中文语音<br>朗读本页内容</p><button class="speech-button" type="button" data-speak="detailReadText">${typeof icon === 'function' ? icon('play') : '▶'} 开始导读</button></div>
      <div class="aside-card">
        <h3>关键词</h3>
        <div class="mini-tags">${thoughtTagLinks(item.thought)}</div>
      </div>
      <div class="aside-card">
        <h3>参观提示</h3>
        <p>开放时间、预约方式和临时展览可能调整，出发前请以场馆官方信息为准。</p>
        <a class="text-link" href="routes.html">查看研学建议 →</a>
      </div>
      <div class="sr-only" id="detailReadText">${item.title}。${item.paragraphs.join('')}。现场观察建议：${item.observe.join('')}</div>
    </aside>`;
  const nextPrev = qs('#nextPrev');
  const currentIndex = materialData.findIndex((entry) => entry.id === item.id);
  const prev = materialData[(currentIndex - 1 + materialData.length) % materialData.length];
  const next = materialData[(currentIndex + 1) % materialData.length];
  nextPrev.innerHTML = `<a href="${prev.page}"><small>上一个资源</small><strong>← ${prev.title}</strong></a><a href="${next.page}"><small>下一个资源</small><strong>${next.title} →</strong></a>`;
  related.innerHTML = item.related.map((id) => {
    const entry = materialData.find((candidate) => candidate.id === id);
    return entry ? `<a class="related-card" href="${entry.page}"><small>${entry.category}</small><h4>${entry.title}</h4><p>${entry.short}</p></a>` : '';
  }).join('');
  refreshPageFeatures();
}

function initInstitutions() {
  const grid = qs('#institutionGrid');
  if (!grid) return;
  grid.innerHTML = institutionData.map((item, index) => `<article class="institution-card-v2 reveal" data-institution="${item.id}">
    <span class="institution-no">INSTITUTION ${String(index + 1).padStart(2, '0')}</span>
    <span class="card-open">${typeof icon === 'function' ? icon('arrow') : '→'}</span>
    <span class="institution-icon">${typeof icon === 'function' ? icon(item.icon) : '◇'}</span>
    <h3>${item.title}</h3><p>${item.summary}</p>
    <div class="mini-tags">${thoughtTagLinks(item.tags)}</div>
    <button class="institution-open" type="button" data-institution-open="${item.id}">查看制度详情 →</button>
  </article>`).join('');

  const dialog = document.createElement('dialog');
  dialog.className = 'detail-dialog institution-dialog wide';
  dialog.innerHTML = '<div class="dialog-shell"><button class="dialog-close" type="button" aria-label="关闭详情"><svg><use href="#icon-close"/></svg></button><div class="dialog-content"></div></div>';
  document.body.appendChild(dialog);
  const content = qs('.dialog-content', dialog);
  const close = () => dialog.close();

  const open = (item) => {
    content.innerHTML = `
      <div class="institution-detail-hero"><span>INSTITUTION / ${item.id.toUpperCase()}</span><h2>${item.title}</h2><p>${item.subtitle}</p></div>
      <p class="rich-text">${item.background}</p>
      <div class="dialog-block"><h3>运行流程</h3><ol class="process-list">${item.process.map((step) => `<li>${step}</li>`).join('')}</ol></div>
      <div class="dialog-block"><h3>案例观察</h3><div class="case-study-list">${item.cases.map((caseItem, index) => `<article class="case-study"><div class="case-study-head"><span>CASE ${String(index + 1).padStart(2, '0')}</span><small>${caseItem.type}</small></div><h4>${caseItem.title}</h4><p class="rich-text">${caseItem.summary}</p><div class="case-link-list">${caseItem.links.map(([label, url, type]) => `<a href="${url}" target="_blank" rel="noopener noreferrer"><strong>${label}</strong><span>${type} ↗</span></a>`).join('')}</div></article>`).join('')}</div></div>
      <div class="dialog-block"><h3>思政关键词</h3><div class="mini-tags">${thoughtTagLinks(item.tags)}</div></div>
      <div class="dialog-block"><h3>课堂讨论</h3><ul>${item.questions.map((question) => `<li>${question}</li>`).join('')}</ul></div>
      <div class="dialog-actions"><button class="button button-outline" type="button" data-close-dialog>返回制度总览</button></div>`;
    dialog.showModal();
    document.body.classList.add('dialog-open');
    history.replaceState(null, '', `institutions.html?topic=${item.id}`);
    qs('[data-close-dialog]', content).addEventListener('click', close);
    refreshPageFeatures();
  };

  grid.addEventListener('click', (event) => {
    if (event.target.closest('a, .glossary-term')) return;
    const card = event.target.closest('[data-institution]');
    if (card) open(institutionData.find((item) => item.id === card.dataset.institution));
  });
  qs('.dialog-close', dialog).addEventListener('click', close);
  dialog.addEventListener('click', (event) => { if (event.target === dialog) close(); });
  dialog.addEventListener('close', () => document.body.classList.remove('dialog-open'));
  const requested = new URLSearchParams(location.search).get('topic');
  if (requested) {
    const item = institutionData.find((entry) => entry.id === requested);
    if (item) setTimeout(() => open(item), 120);
  }
  refreshPageFeatures();
}

function initSpirit() {
  const nav = qs('#spiritNav');
  if (!nav) return;
  const reading = qs('#spiritReading');
  const media = qs('#spiritMedia');
  const videos = qs('#spiritVideos');
  let current = spiritData[0];

  const render = (item, push = true) => {
    current = item;
    qsa('button', nav).forEach((button) => button.classList.toggle('active', button.dataset.spirit === item.id));
    media.innerHTML = `<img src="${item.image}" alt="${item.title}"><span>${item.subtitle}</span>`;
    reading.innerHTML = `
      <div>
        <p class="eyebrow"><span>SPIRIT</span> 工业精神谱系</p>
        <h2>${item.title}</h2>
        <div class="spirit-keywords">${item.values.map((value) => `<span>${value}</span>`).join('')}</div>
        <p class="rich-text">${item.summary}</p>
        ${item.background.map((paragraph) => `<p class="rich-text">${paragraph}</p>`).join('')}
        <div class="spirit-story-grid">${item.stories.map(([title, text], index) => `<div class="spirit-story"><small>STORY ${String(index + 1).padStart(2, '0')}</small><h3>${title}</h3><p class="rich-text">${text}</p></div>`).join('')}</div>
        <div class="mini-tags" style="margin-top:22px">${thoughtTagLinks(item.tags)}</div>
        <div class="page-tools"><button class="page-tool" type="button" data-speak="spiritReadText">语音导读 ${typeof icon === 'function' ? icon('play') : '▶'}</button><a class="page-tool" href="resources.html?filter=视频">公开视频资源</a></div>
      </div>
      <aside>
        <div class="spirit-question"><h3>今天怎样理解</h3><p class="rich-text">${item.today}</p></div>
        <div class="spirit-question" style="margin-top:14px"><h3>课堂讨论</h3><p>${item.question}</p></div>
        <div class="aside-card" style="margin-top:14px"><h3>关联阅读</h3><p>用物质资源、制度案例和人物故事相互印证，避免把精神只理解为抽象口号。</p><a class="text-link" href="materials.html">进入物质文化 →</a></div>
      </aside>
      <div class="sr-only" id="spiritReadText">${item.title}。${item.summary}${item.background.join('')}${item.today}${item.question}</div>`;
    videos.innerHTML = item.videos.map(([label, url], index) => `<a class="video-resource" href="${url}" target="_blank" rel="noopener noreferrer"><small>PUBLIC VIDEO ${String(index + 1).padStart(2, '0')}</small><div><h3>${label}</h3><p>通过公开视频平台检索相关纪录片、访谈或公开课。</p></div><b>打开视频入口 ↗</b></a>`).join('');
    if (push) history.replaceState(null, '', `spirit.html#${item.id}`);
    refreshPageFeatures();
  };

  nav.innerHTML = spiritData.map((item, index) => `<button type="button" class="${index === 0 ? 'active' : ''}" data-spirit="${item.id}"><small>SPIRIT ${String(index + 1).padStart(2, '0')}</small><strong>${item.title}</strong></button>`).join('');
  nav.addEventListener('click', (event) => {
    const button = event.target.closest('[data-spirit]');
    if (button) render(spiritData.find((item) => item.id === button.dataset.spirit));
  });
  const hash = location.hash.replace('#', '');
  render(spiritData.find((item) => item.id === hash) || current, false);
}

function initInnovation() {
  const canvas = qs('#techCanvas');
  if (!canvas) return;
  const panel = qs('#techPanel');
  let current = techData[1];
  const lines = techData.map((item) => `<line x1="50%" y1="50%" x2="${item.x}%" y2="${item.y}%"></line>`).join('');
  canvas.innerHTML = `<svg class="tech-lines" aria-hidden="true">${lines}</svg><div class="tech-core">北京高精尖<br><small>INDUSTRIAL FUTURE</small></div>${techData.map((item) => `<button class="tech-node" type="button" data-tech="${item.id}" style="left:${item.x}%;top:${item.y}%;transform:translate(-50%,-50%)"><small>NODE ${item.id.toUpperCase()}</small><strong>${item.title}</strong><span>${item.short}</span></button>`).join('')}`;
  const render = (item) => {
    current = item;
    qsa('.tech-node', canvas).forEach((node) => node.classList.toggle('active', node.dataset.tech === item.id));
    panel.innerHTML = `<span class="tech-panel-tag">TECHNOLOGY NODE / ${item.id.toUpperCase()}</span><h2>${item.title}</h2><p class="rich-text">${item.description}</p><h3>关键突破与能力</h3><ul>${item.achievements.map((text) => `<li>${text}</li>`).join('')}</ul><h3>团队协作案例</h3><ul>${item.cases.map((text) => `<li>${text}</li>`).join('')}</ul><div class="tech-links">${item.links.map(([label, url]) => `<a class="tag-link" href="${url}" target="_blank" rel="noopener noreferrer">${label}</a>`).join('')}</div>`;
    refreshPageFeatures();
  };
  canvas.addEventListener('click', (event) => {
    const node = event.target.closest('[data-tech]');
    if (node) render(techData.find((item) => item.id === node.dataset.tech));
  });
  render(current);
}

function initResources() {
  const grid = qs('#resourceGrid');
  if (!grid) return;
  const filters = qs('#resourceFilters');
  const search = qs('#resourceSearch');
  const count = qs('#resourceCount');
  const empty = qs('#resourceEmpty');
  let kind = new URLSearchParams(location.search).get('filter') || 'all';
  let query = '';

  const render = () => {
    const items = resourceData.filter((item) => {
      const kindMatch = kind === 'all' || item.kind === kind;
      const haystack = `${item.title}${item.description}${item.tags.join('')}`.toLowerCase();
      return kindMatch && haystack.includes(query.toLowerCase());
    });
    grid.innerHTML = items.map((item) => `<article class="resource-card-v2 reveal">
      <div class="resource-kind-row"><span class="resource-kind">${item.kind} / EXTERNAL RESOURCE</span><span class="resource-kind">↗</span></div>
      <h3>${item.title}</h3><p>${item.description}</p>
      <div class="mini-tags">${item.tags.map((tag) => `<a class="tag-link" href="${tag === '工业遗产' ? 'materials.html#heritage' : tag === '制度' || tag === '国企改革' ? 'institutions.html' : tag === '科技' || tag === '高精尖' ? 'innovation.html' : item.internal}">${tag}</a>`).join('')}</div>
      <div class="resource-actions">${item.links.map(([label, url, type], index) => `<a class="${index === 0 ? 'primary' : ''}" href="${url}" target="_blank" rel="noopener noreferrer">${label}<span>${type}</span></a>`).join('')}<a href="${item.internal}">站内详情</a></div>
    </article>`).join('');
    count.textContent = `${items.length} 条资源`;
    empty.hidden = items.length !== 0;
    grid.hidden = items.length === 0;
    qsa('.chip', filters).forEach((chip) => chip.classList.toggle('active', chip.dataset.filter === kind));
    refreshPageFeatures();
  };
  filters.addEventListener('click', (event) => {
    const chip = event.target.closest('[data-filter]');
    if (!chip) return;
    kind = chip.dataset.filter;
    history.replaceState(null, '', kind === 'all' ? 'resources.html' : `resources.html?filter=${kind}`);
    render();
  });
  search.addEventListener('input', (event) => { query = event.target.value.trim(); render(); });
  render();
}

function initRoutes() {
  const triggers = qsa('[data-route-detail]');
  if (!triggers.length || typeof routeDetailData === 'undefined') return;
  const dialog = document.createElement('dialog');
  dialog.className = 'detail-dialog route-detail-dialog wide';
  dialog.innerHTML = '<div class="dialog-shell"><button class="dialog-close" type="button" aria-label="关闭路线详情"><svg><use href="#icon-close"/></svg></button><div class="dialog-content"></div></div>';
  document.body.appendChild(dialog);
  const content = qs('.dialog-content', dialog);
  const close = () => dialog.close();
  const open = (key) => {
    const route = routeDetailData[key];
    if (!route) return;
    content.innerHTML = `
      <div class="route-modal-hero">
        <div class="route-modal-number">ROUTE ${route.number}</div>
        <div><span>${route.duration}</span><span>${route.audience}</span></div>
        <h2>${route.title}</h2>
        <p>${route.theme}</p>
      </div>
      <div class="route-modal-elements"><small>路线包含的文化元素</small><div class="route-elements">${route.elements.map((item) => `<span>${item}</span>`).join('')}</div></div>
      <div class="route-modal-section"><h3>沿路线，看见什么、体会什么</h3><div class="route-stops">${route.stops.map((stop, index) => `<article class="route-stop"><div class="route-stop-index">${String(index + 1).padStart(2, '0')}</div><div><h4>${stop.place}</h4><p><strong>看什么：</strong>${stop.observe}</p><p><strong>体会什么：</strong>${stop.learn}</p></div></article>`).join('')}</div></div>
      <div class="route-modal-section"><h3>完成后可以带走的成果</h3><ul class="route-outcomes">${route.outcomes.map((item) => `<li>${item}</li>`).join('')}</ul></div>
      <div class="dialog-actions"><button class="button button-outline" type="button" data-close-route>返回路线总览</button></div>`;
    if (!dialog.open) dialog.showModal();
    document.body.classList.add('dialog-open');
    qs('[data-close-route]', content).addEventListener('click', close);
  };
  triggers.forEach((button) => button.addEventListener('click', () => open(button.dataset.routeDetail)));
  qs('.dialog-close', dialog).addEventListener('click', close);
  dialog.addEventListener('click', (event) => { if (event.target === dialog) close(); });
  dialog.addEventListener('close', () => document.body.classList.remove('dialog-open'));
  refreshPageFeatures();
}
function initGlossary() {
  const grid = qs('#glossaryGrid');
  if (!grid) return;
  grid.innerHTML = Object.entries(glossaryDictionary).map(([term, entry], index) => `<article class="glossary-card reveal" id="term-${index + 1}"><small>TERM ${String(index + 1).padStart(2, '0')}</small><h2>${term}</h2><div class="glossary-card-section"><small>含义</small><p>${entry.meaning}</p></div><div class="glossary-card-section"><small>核心思想</small><p>${entry.core}</p></div><div class="glossary-card-section"><small>现实示例</small><p>${entry.example}</p></div><div class="mini-tags">${entry.related.map((href, i) => `<a class="tag-link" href="${href}">${i === 0 ? '关联内容' : '延伸阅读'}</a>`).join('')}</div></article>`).join('');
  refreshPageFeatures();
}

document.addEventListener('DOMContentLoaded', () => {
  const page = document.body.dataset.page;
  const initializers = { home: initHome, history: initHistory, materials: initMaterials, 'material-detail': initMaterialDetail, institutions: initInstitutions, spirit: initSpirit, innovation: initInnovation, routes: initRoutes, resources: initResources, glossary: initGlossary };
  if (initializers[page]) initializers[page]();
});