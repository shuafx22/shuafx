/* Shared helpers. You should not need to edit this file.
   All your content lives in data/site.json. */
const $ = (s, r = document) => r.querySelector(s);

function h(tag, attrs = {}, ...kids) {
  const e = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs)) {
    if (k === 'class') e.className = v;
    else if (k.startsWith('on')) e[k] = v;
    else e.setAttribute(k, v);
  }
  kids.flat().forEach(k => e.append(k));
  return e;
}

/* Image that quietly disappears if the file is missing, so the placeholder shows instead */
function img(src, alt) {
  const i = h('img', { src, alt: alt || '', loading: 'lazy' });
  i.onerror = () => i.remove();
  return i;
}
function heroImage(box, src, alt) { box.after(img(src, alt)); }

const fmt = d => new Date(d + 'T12:00:00')
  .toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

function load() {
  return fetch('data/site.json').then(r => r.json());
}

/* Simple photo viewer */
function lightbox(photos, start) {
  let i = start;
  const pic = h('img'), cap = h('p');
  const box = h('div', { class: 'lb', role: 'dialog', 'aria-label': 'Photo viewer' },
    h('button', { class: 'x', 'aria-label': 'Close', onclick: close }, '×'),
    h('button', { class: 'p', 'aria-label': 'Previous', onclick: () => show(i - 1) }, '‹'),
    pic, cap,
    h('button', { class: 'n', 'aria-label': 'Next', onclick: () => show(i + 1) }, '›'));
  function show(n) {
    i = (n + photos.length) % photos.length;
    pic.src = photos[i].src; pic.alt = photos[i].caption || '';
    cap.textContent = photos[i].caption || '';
  }
  function key(e) {
    if (e.key === 'Escape') close();
    if (e.key === 'ArrowLeft') show(i - 1);
    if (e.key === 'ArrowRight') show(i + 1);
  }
  function close() { box.remove(); document.removeEventListener('keydown', key); }
  box.addEventListener('click', e => { if (e.target === box) close(); });
  document.addEventListener('keydown', key);
  document.body.append(box);
  show(i);
}
