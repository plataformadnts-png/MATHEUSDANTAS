(() => {
  const P = window.MX_PRODUCTS || [], C = window.MX_CATEGORIES || [], CFG = window.MX_CONFIG || {};
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const root = document.documentElement.dataset.root || '';
  const img = f => `${root}assets/img/p/${f}`;
  const byId = id => P.find(p => p.id === id);
  const catName = id => (C.find(c => c.id === id) || {}).name || '';
  const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

  /* ---------- carrinho (lista de orçamento) ---------- */
  let mem = [];
  const load = () => { try { return JSON.parse(localStorage.getItem('mx_cart') || '[]'); } catch (e) { return mem; } };
  const save = c => { mem = c; try { localStorage.setItem('mx_cart', JSON.stringify(c)); } catch (e) {} render(); };
  const cart = { items: () => load().filter(i => byId(i.id)),
    add(id, q = 1) { const c = load(); const it = c.find(i => i.id === id); it ? it.q += q : c.push({ id, q }); save(c); toast(`${byId(id).name} adicionado ao orçamento`); },
    set(id, q) { let c = load(); if (q <= 0) c = c.filter(i => i.id !== id); else c.find(i => i.id === id).q = q; save(c); },
    clear() { save([]); },
    count() { return cart.items().reduce((s, i) => s + i.q, 0); } };
  window.MXCart = cart;

  function toast(msg) {
    let t = document.querySelector('.toast');
    if (!t) { t = document.createElement('div'); t.className = 'toast'; t.setAttribute('role', 'status'); document.body.appendChild(t); }
    t.textContent = msg; t.classList.add('show'); clearTimeout(t._h); t._h = setTimeout(() => t.classList.remove('show'), 2400);
  }

  const drawer = document.querySelector('.drawer'), scrim = document.querySelector('.scrim');
  const openDrawer = () => { if (!drawer) return; drawer.classList.add('open'); scrim.classList.add('show'); drawer.setAttribute('aria-hidden', 'false'); drawer.querySelector('.drawer-close').focus(); };
  const closeDrawer = () => { if (!drawer) return; drawer.classList.remove('open'); scrim.classList.remove('show'); drawer.setAttribute('aria-hidden', 'true'); };
  document.querySelectorAll('[data-open-cart]').forEach(b => b.addEventListener('click', e => { e.preventDefault(); openDrawer(); }));
  scrim && scrim.addEventListener('click', closeDrawer);
  drawer && drawer.querySelector('.drawer-close').addEventListener('click', closeDrawer);
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeDrawer(); });

  function lineHTML(i, big) {
    const p = byId(i.id);
    return `<li class="line${big ? ' big' : ''}"><a class="line-img" href="${root}produto.html?p=${p.id}"><img src="${img(p.img)}" alt=""></a>
      <div class="line-info"><small>${esc(catName(p.cat))}</small><a href="${root}produto.html?p=${p.id}">${esc(p.name)}</a>
      <div class="qty" role="group" aria-label="Quantidade de ${esc(p.name)}"><button type="button" data-dec="${p.id}" aria-label="Diminuir">−</button><span>${i.q}</span><button type="button" data-inc="${p.id}" aria-label="Aumentar">+</button></div></div>
      <button type="button" class="line-rm" data-rm="${p.id}" aria-label="Remover ${esc(p.name)}">Remover</button></li>`;
  }
  function render() {
    const n = cart.count();
    document.querySelectorAll('.cart-count').forEach(b => { b.textContent = n; b.hidden = n === 0; });
    const list = document.querySelector('.drawer-list');
    if (list) {
      const it = cart.items();
      list.innerHTML = it.length ? it.map(i => lineHTML(i)).join('') : '<li class="empty">Sua lista de orçamento está vazia.</li>';
      document.querySelector('.drawer-foot').hidden = !it.length;
    }
    const page = document.querySelector('#cart-page');
    if (page) renderCartPage(page);
  }
  document.addEventListener('click', e => {
    const t = e.target.closest('[data-add],[data-inc],[data-dec],[data-rm]'); if (!t) return;
    const c = load();
    if (t.dataset.add) { const q = +(document.querySelector('#qty-input')?.value || 1); cart.add(t.dataset.add, t.dataset.useQty ? q : 1); if (t.dataset.openAfter) openDrawer(); }
    if (t.dataset.inc) cart.set(t.dataset.inc, (c.find(i => i.id === t.dataset.inc)?.q || 0) + 1);
    if (t.dataset.dec) cart.set(t.dataset.dec, (c.find(i => i.id === t.dataset.dec)?.q || 0) - 1);
    if (t.dataset.rm) cart.set(t.dataset.rm, 0);
  });

  /* ---------- cartões de produto ---------- */
  const card = p => `<article class="pcard${p.photo ? ' photo' : ''}${p.soft ? ' soft' : ''}"><a class="pimg" href="${root}produto.html?p=${p.id}" aria-label="Ver ${esc(p.name)}">${p.tag ? `<span class="ptag">${p.tag}</span>` : ''}<img src="${img(p.img)}" alt="${esc(p.name)} — embalagem MAXVITTA LABS" loading="lazy" decoding="async"></a>
    <div class="pbody"><small>${esc(catName(p.cat))}</small><h3><a href="${root}produto.html?p=${p.id}">${esc(p.name)}</a></h3><p>${esc(p.line)}</p>
    <div class="pactions"><a class="btn sm ghost" href="${root}produto.html?p=${p.id}">Ver produto</a><button type="button" class="btn sm" data-add="${p.id}">Adicionar</button></div></div></article>`;

  const grid = document.querySelector('#grid');
  if (grid) {
    const chips = document.querySelector('#chips'), search = document.querySelector('#search'), countEl = document.querySelector('#count');
    let cat = new URLSearchParams(location.search).get('cat') || 'todos';
    chips.innerHTML = [{ id: 'todos', name: 'Todos' }, ...C].map(c => `<button type="button" class="chip" data-cat="${c.id}" aria-pressed="${c.id === cat}">${c.name}</button>`).join('');
    const draw = () => {
      const q = (search.value || '').trim().toLowerCase();
      const list = P.filter(p => (cat === 'todos' || p.cat === cat) && (!q || (p.name + ' ' + p.line).toLowerCase().includes(q)));
      grid.innerHTML = list.length ? list.map(card).join('') : '<p class="empty-grid">Nenhum produto encontrado. Tente outro termo.</p>';
      countEl.textContent = `${list.length} ${list.length === 1 ? 'produto' : 'produtos'}`;
    };
    chips.addEventListener('click', e => { const b = e.target.closest('.chip'); if (!b) return; cat = b.dataset.cat; chips.querySelectorAll('.chip').forEach(x => x.setAttribute('aria-pressed', x === b)); draw(); });
    search.addEventListener('input', draw);
    document.querySelectorAll('[data-filter]').forEach(a => a.addEventListener('click', () => { cat = a.dataset.filter; chips.querySelectorAll('.chip').forEach(x => x.setAttribute('aria-pressed', x.dataset.cat === cat)); draw(); }));
    draw();
  }

  /* ---------- página de produto ---------- */
  const pp = document.querySelector('#product');
  if (pp) {
    const p = byId(new URLSearchParams(location.search).get('p')) || P[0];
    document.title = `${p.name} — MAXVITTA LABS`;
    pp.innerHTML = `<nav class="crumbs" aria-label="Você está em"><a href="index.html">Início</a><span>/</span><a href="index.html?cat=${p.cat}#loja">${esc(catName(p.cat))}</a><span>/</span><span aria-current="page">${esc(p.name)}</span></nav>
    <div class="pdp"><div class="pdp-media${p.photo ? ' photo' : ''}${p.soft ? ' soft' : ''}"><div class="halo"></div><img src="${img(p.img)}" alt="${esc(p.name)} — embalagem MAXVITTA LABS"></div>
    <div class="pdp-info"><p class="eyebrow">${esc(catName(p.cat))} · ${esc(p.line)}</p><h1>${esc(p.name)}</h1>
    <p class="lead">Produto da linha ${esc(catName(p.cat).toLowerCase())} MAXVITTA LABS, com acabamento branco perolado, prata e filetes dourados.</p>
    <dl class="spec"><div><dt>Apresentação</dt><dd>[A DEFINIR]</dd></div><div><dt>Composição</dt><dd>[A DEFINIR]</dd></div><div><dt>Modo de uso</dt><dd>[A DEFINIR]</dd></div><div><dt>Registro / notificação</dt><dd>[A DEFINIR]</dd></div></dl>
    <div class="buy"><label for="qty-input">Quantidade</label><div class="qty big"><button type="button" id="qm" aria-label="Diminuir">−</button><input id="qty-input" type="number" min="1" value="1" inputmode="numeric"><button type="button" id="qp" aria-label="Aumentar">+</button></div>
    <button type="button" class="btn gold" data-add="${p.id}" data-use-qty="1" data-open-after="1">Adicionar ao orçamento</button></div>
    <p class="note">Preço e disponibilidade sob consulta. Imagem ilustrativa da embalagem.</p>
    <a class="btn ghost" href="https://wa.me/${CFG.whatsapp}?text=${encodeURIComponent('Olá, MAXVITTA LABS! Tenho interesse em: ' + p.name)}" target="_blank" rel="noopener">Perguntar no WhatsApp</a>
    ${(window.MX_ARTICLES || {})[p.id] ? `<div class="readmore"><p class="eyebrow">Saiba mais no blog</p>${window.MX_ARTICLES[p.id].map(([s, t]) => `<a href="blog/${s}.html">${esc(t)} →</a>`).join('')}</div>` : ''}</div></div>
    <section class="related"><h2>Da mesma linha</h2><div class="pgrid">${P.filter(x => x.cat === p.cat && x.id !== p.id).slice(0, 4).map(card).join('')}</div></section>`;
    const qi = pp.querySelector('#qty-input');
    pp.querySelector('#qm').onclick = () => qi.value = Math.max(1, (+qi.value || 1) - 1);
    pp.querySelector('#qp').onclick = () => qi.value = (+qi.value || 1) + 1;
  }

  /* ---------- página do orçamento ---------- */
  function orderText(f) {
    const it = cart.items();
    return `Olá, MAXVITTA LABS! Gostaria de um orçamento:\n\n${it.map(i => `• ${byId(i.id).name} — ${i.q} un.`).join('\n')}\n\nNome: ${f.nome}\nE-mail: ${f.email}\nTelefone: ${f.tel}\nCidade/UF: ${f.cidade}${f.obs ? `\nObservações: ${f.obs}` : ''}`;
  }
  function renderCartPage(el) {
    const it = cart.items();
    el.querySelector('.cart-lines').innerHTML = it.length ? it.map(i => lineHTML(i, true)).join('') : '<li class="empty">Sua lista está vazia. <a href="index.html#loja">Ver produtos</a></li>';
    el.querySelector('.cart-total').textContent = `${cart.count()} ${cart.count() === 1 ? 'item' : 'itens'}`;
    el.querySelector('#quote').hidden = !it.length;
  }
  const qf = document.querySelector('#quote');
  if (qf) {
    qf.addEventListener('submit', e => {
      e.preventDefault();
      const f = Object.fromEntries(new FormData(qf).entries());
      const rules = { nome: f.nome.trim().length > 1 || 'Informe seu nome.', email: /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(f.email) || 'E-mail inválido.', tel: f.tel.replace(/\D/g, '').length >= 10 || 'Telefone com DDD.', cidade: f.cidade.trim().length > 1 || 'Informe cidade/UF.' };
      let ok = true, first;
      for (const [k, v] of Object.entries(rules)) { const er = qf.querySelector(`#e-${k}`); er.textContent = v === true ? '' : v; if (v !== true) { ok = false; first = first || qf.elements[k]; } }
      const l = qf.querySelector('#e-lgpd'); if (!qf.elements.lgpd.checked) { l.textContent = 'É preciso concordar com a política de privacidade.'; ok = false; first = first || qf.elements.lgpd; } else l.textContent = '';
      if (!ok) { first.focus(); return; }
      const txt = orderText(f), out = qf.querySelector('.quote-out');
      const wa = CFG.whatsapp ? `https://wa.me/${CFG.whatsapp}?text=${encodeURIComponent(txt)}` : '';
      out.hidden = false;
      out.innerHTML = `<b>Pedido de orçamento pronto.</b><pre>${esc(txt)}</pre><div class="row">${wa ? `<a class="btn gold" href="${wa}" target="_blank" rel="noopener">Enviar pelo WhatsApp</a>` : ''}<button type="button" class="btn ghost" id="copy">Copiar pedido</button></div>${wa ? '' : '<p class="note">Canal de atendimento: [WHATSAPP / E-MAIL A DEFINIR]. Copie o pedido e envie quando o canal estiver ativo.</p>'}`;
      out.querySelector('#copy').onclick = async ev => { try { await navigator.clipboard.writeText(txt); ev.target.textContent = 'Copiado'; } catch (er) { ev.target.textContent = 'Selecione o texto acima'; } };
      out.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'center' });
    });
  }

  /* ---------- filtro do blog ---------- */
  const bch = document.querySelector('#bchips'), bg = document.querySelector('#bgrid');
  if (bch && bg) {
    const tags = ['Todos', ...new Set([...bg.querySelectorAll('[data-tag]')].map(a => a.dataset.tag))];
    bch.innerHTML = tags.map((t, k) => `<button type="button" class="chip" aria-pressed="${k === 0}">${t}</button>`).join('');
    bch.addEventListener('click', e => { const b = e.target.closest('.chip'); if (!b) return; bch.querySelectorAll('.chip').forEach(x => x.setAttribute('aria-pressed', x === b));
      bg.querySelectorAll('[data-tag]').forEach(a => a.hidden = !(b.textContent === 'Todos' || a.dataset.tag === b.textContent)); });
  }

  /* ---------- banner rotativo ---------- */
  const car = document.querySelector('.carousel');
  if (car) {
    const slides = [...car.querySelectorAll('.slide')], dots = car.querySelector('.dots');
    let i = 0, timer;
    dots.innerHTML = slides.map((_, k) => `<button type="button" aria-label="Banner ${k + 1}"></button>`).join('');
    const go = k => { i = (k + slides.length) % slides.length; slides.forEach((s, n) => { s.classList.toggle('on', n === i); s.setAttribute('aria-hidden', n !== i); s.querySelectorAll('a,button').forEach(a => a.tabIndex = n === i ? 0 : -1); }); dots.querySelectorAll('button').forEach((d, n) => d.setAttribute('aria-current', n === i)); };
    const play = () => { if (reduce) return; clearInterval(timer); timer = setInterval(() => go(i + 1), 6000); };
    car.querySelector('.prev').onclick = () => { go(i - 1); play(); };
    car.querySelector('.next').onclick = () => { go(i + 1); play(); };
    dots.addEventListener('click', e => { const b = e.target.closest('button'); if (b) { go([...dots.children].indexOf(b)); play(); } });
    car.addEventListener('mouseenter', () => clearInterval(timer)); car.addEventListener('mouseleave', play);
    car.addEventListener('focusin', () => clearInterval(timer));
    let sx = null; car.addEventListener('touchstart', e => sx = e.touches[0].clientX, { passive: true });
    car.addEventListener('touchend', e => { if (sx === null) return; const dx = e.changedTouches[0].clientX - sx; if (Math.abs(dx) > 40) { go(i + (dx < 0 ? 1 : -1)); play(); } sx = null; });
    go(0); play();
  }

  /* ---------- menu, header, revelações ---------- */
  const mb = document.querySelector('.menu-btn'), nav = document.querySelector('.mainnav');
  mb && mb.addEventListener('click', () => { const o = nav.classList.toggle('open'); mb.setAttribute('aria-expanded', o); });
  const hd = document.querySelector('.hdr'); const sc = () => hd && hd.classList.toggle('scrolled', scrollY > 10); sc(); addEventListener('scroll', sc, { passive: true });
  const io = 'IntersectionObserver' in window ? new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { threshold: .12 }) : null;
  document.querySelectorAll('.rv').forEach(el => io ? io.observe(el) : el.classList.add('in'));
  render();
})();

/* Trilhos de produtos da home */
(function () {
  const rails = document.querySelectorAll('.rail');
  if (!rails.length || !window.MX_PRODUCTS) return;
  const cats = {}; (window.MX_CATEGORIES || []).forEach(c => cats[c.id] = c.name);
  const all = window.MX_PRODUCTS.slice();
  const half = Math.ceil(all.length / 2);
  const groups = [all.slice(0, half), all.slice(half)];
  const item = p => `<a class="ritem${p.photo ? ' photo' : ''}" href="produto.html?p=${p.id}"><div class="ri"><img src="assets/img/p/${p.img}" alt="${p.name}" loading="lazy" decoding="async"></div><div class="rt"><small>${cats[p.cat] || ''}</small><b>${p.name}</b></div></a>`;
  rails.forEach((r, k) => {
    const g = groups[k] || all;
    const html = g.map(item).join('');
    r.querySelector('.rail-track').innerHTML = html + html.replace(/<a /g, '<a aria-hidden="true" tabindex="-1" ');
  });
})();
