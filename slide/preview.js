/* RuyiSDK slides: popup preview of running website pages.
   - No external deps
   - Configurable site base URL via localStorage key: ruyiSiteBase
*/
(function () {
  const META_PATH = document.querySelector('meta[name="ruyi-preview-path"]');
  if (!META_PATH) return;

  const DEFAULT_BASE = 'http://127.0.0.1:3000';
  const LS_KEY = 'ruyiSiteBase';
  const ROUTES = [
    { label: '首页 /', path: '/' },
    { label: 'Downloads /downloads', path: '/downloads' },
    { label: 'Community /Community', path: '/Community' },
    { label: 'Contributors /Community/contributors', path: '/Community/contributors' },
    { label: 'About /about', path: '/about' },
    { label: 'News /news', path: '/news' },
  ];

  const preferredPath = META_PATH.getAttribute('content') || '/';
  const startRoute = ROUTES.find((r) => r.path === preferredPath) || { label: preferredPath, path: preferredPath };

  function getBase() {
    try {
      return (localStorage.getItem(LS_KEY) || DEFAULT_BASE).replace(/\/$/, '');
    } catch {
      return DEFAULT_BASE;
    }
  }

  function setBase(v) {
    try {
      localStorage.setItem(LS_KEY, String(v || '').trim());
    } catch {}
  }

  function join(base, path) {
    const b = String(base || '').replace(/\/$/, '');
    const p = String(path || '').startsWith('/') ? path : `/${path}`;
    return `${b}${p}`;
  }

  const style = document.createElement('style');
  style.textContent = `
  .ruyi-preview-fab{position:fixed;right:18px;bottom:18px;z-index:9999;display:inline-flex;align-items:center;gap:10px;
    padding:10px 14px;border-radius:999px;border:1px solid rgba(0,0,0,.12);
    background:linear-gradient(90deg, var(--primary, #06bcee), var(--ruyi-gold, #E6C23A));
    color:#fff;font-weight:900;letter-spacing:.01em;box-shadow:0 14px 50px rgba(6,188,238,.24);
    cursor:pointer;user-select:none}
  .ruyi-preview-fab:focus{outline:3px solid rgba(6,188,238,.28);outline-offset:2px}
  .ruyi-preview-dialog{width:min(1100px, calc(100vw - 26px));height:min(760px, calc(100vh - 26px));border:0;padding:0;border-radius:22px;
    box-shadow:0 40px 120px rgba(0,0,0,.28);background:rgba(255,255,255,.95)}
  .ruyi-preview-dialog::backdrop{background:rgba(0,0,0,.45);backdrop-filter:blur(2px)}
  .ruyi-preview-head{display:flex;align-items:center;justify-content:space-between;gap:10px;
    padding:10px 12px;border-bottom:1px solid rgba(0,0,0,.10)}
  .ruyi-preview-left{display:flex;align-items:center;gap:10px;min-width:0}
  .ruyi-preview-title{font-weight:950;letter-spacing:-.01em;white-space:nowrap}
  .ruyi-preview-controls{display:flex;align-items:center;gap:8px;flex-wrap:wrap}
  .ruyi-preview-input,.ruyi-preview-select{height:34px;border-radius:999px;border:1px solid rgba(0,0,0,.14);
    padding:0 10px;background:rgba(255,255,255,.90);font-weight:800}
  .ruyi-preview-input{width:260px}
  .ruyi-preview-btn{height:34px;border-radius:999px;border:1px solid rgba(0,0,0,.14);
    padding:0 12px;background:rgba(255,255,255,.92);font-weight:900;cursor:pointer}
  .ruyi-preview-btn-primary{border-color:rgba(6,188,238,.35);background:rgba(6,188,238,.12)}
  .ruyi-preview-frame{width:100%;height:calc(100% - 56px);border:0;border-bottom-left-radius:22px;border-bottom-right-radius:22px;background:#fff}
  `;
  document.head.appendChild(style);

  const fab = document.createElement('button');
  fab.type = 'button';
  fab.className = 'ruyi-preview-fab';
  fab.textContent = '预览网站';

  const dialog = document.createElement('dialog');
  dialog.className = 'ruyi-preview-dialog';

  const head = document.createElement('div');
  head.className = 'ruyi-preview-head';

  const left = document.createElement('div');
  left.className = 'ruyi-preview-left';

  const title = document.createElement('div');
  title.className = 'ruyi-preview-title';
  title.textContent = 'RuyiSDK 网站预览';

  left.appendChild(title);

  const controls = document.createElement('div');
  controls.className = 'ruyi-preview-controls';

  const baseInput = document.createElement('input');
  baseInput.className = 'ruyi-preview-input';
  baseInput.placeholder = DEFAULT_BASE;
  baseInput.value = getBase();
  baseInput.setAttribute('aria-label', '站点地址（例如 http://127.0.0.1:3000）');

  const routeSelect = document.createElement('select');
  routeSelect.className = 'ruyi-preview-select';
  routeSelect.setAttribute('aria-label', '选择预览页面');
  ROUTES.forEach((r) => {
    const opt = document.createElement('option');
    opt.value = r.path;
    opt.textContent = r.label;
    routeSelect.appendChild(opt);
  });
  routeSelect.value = startRoute.path;

  const openBtn = document.createElement('button');
  openBtn.type = 'button';
  openBtn.className = 'ruyi-preview-btn ruyi-preview-btn-primary';
  openBtn.textContent = '打开';

  const newTabBtn = document.createElement('button');
  newTabBtn.type = 'button';
  newTabBtn.className = 'ruyi-preview-btn';
  newTabBtn.textContent = '新标签页';

  const closeBtn = document.createElement('button');
  closeBtn.type = 'button';
  closeBtn.className = 'ruyi-preview-btn';
  closeBtn.textContent = '关闭';

  controls.appendChild(baseInput);
  controls.appendChild(routeSelect);
  controls.appendChild(openBtn);
  controls.appendChild(newTabBtn);
  controls.appendChild(closeBtn);

  head.appendChild(left);
  head.appendChild(controls);

  const frame = document.createElement('iframe');
  frame.className = 'ruyi-preview-frame';
  frame.setAttribute('title', 'RuyiSDK 网站预览');
  frame.setAttribute('loading', 'lazy');

  dialog.appendChild(head);
  dialog.appendChild(frame);

  function refreshFrame() {
    const base = String(baseInput.value || '').trim() || DEFAULT_BASE;
    setBase(base);
    const path = routeSelect.value || '/';
    frame.src = join(base, path);
  }

  fab.addEventListener('click', () => {
    if (typeof dialog.showModal === 'function') {
      dialog.showModal();
    } else {
      // Fallback: if <dialog> is unsupported, open in a new tab.
      refreshFrame();
      window.open(frame.src, '_blank', 'noopener,noreferrer');
      return;
    }
    refreshFrame();
  });

  openBtn.addEventListener('click', refreshFrame);
  routeSelect.addEventListener('change', refreshFrame);

  baseInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      refreshFrame();
    }
  });

  newTabBtn.addEventListener('click', () => {
    refreshFrame();
    window.open(frame.src, '_blank', 'noopener,noreferrer');
  });

  closeBtn.addEventListener('click', () => dialog.close());

  dialog.addEventListener('click', (e) => {
    const rect = dialog.getBoundingClientRect();
    const inDialog = rect.top <= e.clientY && e.clientY <= rect.top + rect.height && rect.left <= e.clientX && e.clientX <= rect.left + rect.width;
    if (!inDialog) dialog.close();
  });

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && dialog.open) dialog.close();
  });

  document.body.appendChild(fab);
  document.body.appendChild(dialog);
})();
