class ConfigTab extends Component {
  refs = {
    config: '#config',
    textarea: '#config textarea[type="text"]',
    preview: '.preview-img',
    thumbnails: '.background-thumbnails',
    backgroundFile: '.background-file',
    close: '.close',
    export: '.export'
  };

  constructor() {
    super();

    let stored = null;
    try {
      stored = JSON.parse(localStorage.getItem("CONFIG"));
    } catch (e) {
      console.error('Failed to parse CONFIG from localStorage:', e);
    }
    if (stored && stored.config) stored = stored.config;
    this.config = stored || {};
  }

  styles() {
    return `
      :host {
        --jp-pink:    var(--accent, #ff4d8d);
        --jp-pink-15: hsla(var(--accent-h, 340), var(--accent-s, 100%), var(--accent-l, 65%), 0.15);
        --jp-pink-25: hsla(var(--accent-h, 340), var(--accent-s, 100%), var(--accent-l, 65%), 0.25);
        --jp-pink-35: hsla(var(--accent-h, 340), var(--accent-s, 100%), var(--accent-l, 65%), 0.35);
        --jp-pink-40: hsla(var(--accent-h, 340), var(--accent-s, 100%), var(--accent-l, 65%), 0.4);
        --jp-purple:  var(--accent-2, #9d4edd);
        --jp-cyan:    var(--accent-3, #4cc9f0);
        --jp-cyan-15: hsla(var(--accent-3-h, 193), var(--accent-3-s, 85%), var(--accent-3-l, 62%), 0.15);
        --jp-cyan-40: hsla(var(--accent-3-h, 193), var(--accent-3-s, 85%), var(--accent-3-l, 62%), 0.4);
        --jp-text:    var(--text, #f0e6ef);
        --jp-muted:   var(--text-muted, rgba(240, 230, 239, 0.55));
      }

      #config {
          position: fixed;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 100vw;
          height: 100vh;
          top: -100%;
          left: 0;
          background: rgba(10, 10, 16, 0.82);
          z-index: 100;
          visibility: hidden;
          backdrop-filter: blur(12px) saturate(140%);
          transition: all .2s ease-in-out;
      }

      #config.active {
          top: 0;
          visibility: visible;
      }

      #config textarea {
          display: none;
      }

      .config-card {
          width: 80%;
          max-width: 420px;
          background: rgba(13, 13, 18, 0.94);
          border: 1px solid var(--jp-border);
          border-radius: 8px;
          padding: 1.5em;
          box-shadow: 0 20px 50px rgba(0, 0, 0, .55), 0 0 0 1px var(--jp-pink-15);
          backdrop-filter: blur(16px) saturate(150%);
      }

      .config-title {
          margin: 0 0 1.2em 0;
          color: var(--jp-text);
          font: 700 18px 'Roboto', sans-serif;
          text-transform: uppercase;
          letter-spacing: 2px;
          text-align: center;
          text-shadow: 0 0 12px var(--jp-pink-40);
      }

      .section-label {
          display: block;
          margin-bottom: 0.8em;
          color: var(--jp-muted);
          font-size: 12px;
          text-transform: uppercase;
          letter-spacing: 1px;
      }

      .background-preview {
          width: 100%;
          height: 140px;
          border-radius: 6px;
          overflow: hidden;
          margin-bottom: 1em;
          border: 1px solid rgba(255, 255, 255, 0.1);
          box-shadow: inset 0 0 20px rgba(0, 0, 0, 0.5);
      }

      .preview-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center;
      }

      .background-thumbnails {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 8px;
          margin-bottom: 1em;
      }

      .thumb {
          width: 100%;
          height: 50px;
          object-fit: cover;
          border-radius: 4px;
          cursor: pointer;
          border: 2px solid transparent;
          opacity: 0.7;
          transition: all .2s ease;
      }

      .thumb:hover {
          opacity: 1;
          transform: scale(1.05);
          border-color: rgba(255, 255, 255, 0.3);
      }

      .thumb.active {
          opacity: 1;
          border-color: var(--jp-cyan);
          box-shadow: 0 0 12px var(--jp-cyan-40);
      }

      .thumb-wrapper {
          position: relative;
          width: 100%;
          height: 50px;
          min-width: 0;
          box-sizing: border-box;
      }

      .thumb-delete {
          position: absolute;
          top: -6px;
          right: -6px;
          width: 18px;
          height: 18px;
          border-radius: 50%;
          border: 0;
          background: var(--jp-pink-85);
          color: #0d0d12;
          font: 700 12px 'Roboto', sans-serif;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          line-height: 1;
          z-index: 2;
          opacity: 0;
          transition: all .2s ease;
      }

      .thumb-wrapper:hover .thumb-delete {
          opacity: 1;
      }

      .thumb-delete:hover {
          background: var(--jp-pink);
          box-shadow: 0 0 8px var(--jp-pink);
          transform: scale(1.1);
      }

      .custom-upload {
          display: flex;
          flex-direction: column;
          gap: 0.5em;
          margin-bottom: 1.5em;
      }

      .upload-label {
          color: var(--jp-muted);
          font-size: 12px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
      }

      .background-file {
          border: 0;
          outline: 0;
          background: rgba(20, 18, 30, 0.78);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 4px;
          padding: 0.6em;
          color: var(--jp-text);
          font: 500 14px 'Roboto', sans-serif;
          cursor: pointer;
      }

      .config-actions {
          display: flex;
          justify-content: flex-end;
          gap: 0.8em;
      }

      .dialog-btn {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.15);
          color: var(--jp-text);
          cursor: pointer;
          border-radius: 4px;
          font: 700 12px 'Roboto', sans-serif;
          padding: 0.6em 1.2em;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          transition: all .2s ease;
      }

      .dialog-btn:hover {
          background: rgba(255, 255, 255, 0.1);
          border-color: rgba(255, 255, 255, 0.25);
      }

      .dialog-btn.close {
          background: var(--jp-pink-15);
          border-color: var(--jp-pink-40);
          color: var(--jp-pink);
      }

      .dialog-btn.close:hover {
          background: var(--jp-pink);
          color: #0d0d12;
          box-shadow: 0 0 12px var(--jp-pink);
      }

      .dialog-btn.export {
          background: var(--jp-cyan-15);
          border-color: var(--jp-cyan-40);
          color: var(--jp-cyan);
      }

      .dialog-btn.export:hover {
          background: var(--jp-cyan);
          color: #0d0d12;
          box-shadow: 0 0 12px var(--jp-cyan);
      }
    `;
  }

  imports() {
    return [
      this.resources.fonts.roboto,
      this.resources.icons.material
    ];
  }

  template() {
    const currentBg = this.config.background || 'src/img/banners/bg-1.gif';
    const backgrounds = [
      'src/img/banners/bg-1.gif',
      'src/img/banners/bg-2.gif',
      'src/img/banners/bg-3.gif',
      'src/img/japanies.png',
    ];
    const customBackgrounds = this.config.customBackgrounds || [];
    const allBackgrounds = [...customBackgrounds, ...backgrounds];
    const safeCurrentBg = escapeHtml(currentBg);
    return `
        <div id="config">
          <textarea type="text" style="display:none;"></textarea>
          <div class="config-card">
            <h2 class="config-title">settings</h2>
            <div class="background-section">
              <label class="section-label">background</label>
              <div class="background-preview">
                <img class="preview-img" src="${safeCurrentBg}" alt="background preview">
              </div>
              <div class="background-thumbnails">
                ${allBackgrounds.map(b => {
                  const isCustom = customBackgrounds.includes(b);
                  return `
                    <div class="thumb-wrapper">
                      <img src="${escapeHtml(b)}" class="thumb ${b === currentBg ? 'active' : ''}" data-bg="${escapeHtml(b)}" alt="">
                      ${isCustom ? `<button class="thumb-delete" data-bg="${escapeHtml(b)}" title="delete custom background">×</button>` : ''}
                    </div>
                  `;
                }).join('')}
              </div>
              <div class="custom-upload">
                <label class="upload-label">or upload custom</label>
                <input type="file" class="background-file" accept="image/*">
              </div>
            </div>
            <div class="config-actions">
              <button class="dialog-btn export">export config</button>
              <button class="dialog-btn close">close</button>
            </div>
          </div>
        </div>
    `;
  }

  activate() {
    this.refs.config.classList.add('active');
  }

  deactivate() {
    this.refs.config.classList.remove('active');
  }

  saveConfig() {
    // Remember the values we want to persist, then refresh the in-memory copy
    // from localStorage so we don't overwrite unrelated settings (tabs, search,
    // etc.) that were changed by other components.
    const pendingBackground = this.config.background;
    const pendingCustomBackgrounds = this.config.customBackgrounds || [];

    console.log('[ConfigTab] saving background', pendingBackground ? pendingBackground.slice(0, 60) + '...' : pendingBackground);

    let stored = null;
    try {
      stored = JSON.parse(localStorage.getItem("CONFIG"));
    } catch (e) {
      console.error('Failed to parse stored CONFIG in saveConfig:', e);
    }
    if (stored && stored.config) stored = stored.config;
    this.config = stored || {};

    this.config.background = pendingBackground;
    this.config.customBackgrounds = pendingCustomBackgrounds;

    const isQuotaError = (err) =>
      err.name === 'QuotaExceededError' ||
      err.message.toLowerCase().includes('quota') ||
      err.message.toLowerCase().includes('exceeded');

    try {
      localStorage.setItem("CONFIG", JSON.stringify(this.config, null, 4));
    } catch (e) {
      if (isQuotaError(e)) {
        alert('Failed to save settings: localStorage quota exceeded. Please clear site data or remove custom images.');
      }
      console.error('[ConfigTab] saveConfig failed', e);
      throw e;
    }

    const savedConfigStr = localStorage.getItem('CONFIG');
    console.log('[ConfigTab] saved. localStorage CONFIG length:', savedConfigStr ? savedConfigStr.length : 0);

    // Sync with the global CONFIG so the rest of the app (and the next page
    // load) uses the same background values instead of a stale copy.
    if (typeof CONFIG !== 'undefined') {
      try {
        CONFIG.background = this.config.background;
        CONFIG.customBackgrounds = this.config.customBackgrounds;
      } catch (e) {
        if (isQuotaError(e)) {
          console.error('Config sync failed: localStorage quota exceeded');
        } else {
          throw e;
        }
      }
    }
  }

  handleSearch(event) {
    const { key } = event;

    if (key === 'Escape')
      this.deactivate();
  }

  setEvents() {
    this.refs.config.onkeyup = (e) => this.handleSearch(e);
    this.refs.close.onclick = () => this.deactivate();
    this.refs.export.onclick = async () => {
      await this.exportUserConfig();
    };
    this.refs.thumbnails.onclick = async (e) => {
      const deleteBtn = e.target.closest('.thumb-delete');
      if (deleteBtn) {
        e.stopPropagation();
        await this.deleteCustomBackground(deleteBtn.dataset.bg);
        return;
      }
      const thumb = e.target.closest('.thumb');
      if (!thumb) return;
      await this.setBackground(thumb.dataset.bg);
    };
    this.refs.backgroundFile.onchange = async () => {
      await this.applyBackground();
    };
  }

  async setBackground(background) {
    console.log('[ConfigTab] setBackground called', background ? background.slice(0, 60) + '...' : background);
    this.config.background = background;
    const resolved = await ImageDB.resolveUrl(background) || background;
    this.refs.preview.src = resolved;

    this.shadow.querySelectorAll('.thumb').forEach(t => {
      const isActive = t.dataset.bg === background;
      t.classList.toggle('active', isActive);
      if (isActive) t.src = resolved;
    });

    document.body.style.backgroundImage = 'url("' + String(resolved).replace(/"/g, '\\"') + '")';
    if (typeof window.applyGlobalAccent === 'function') {
      await window.applyGlobalAccent(background);
    } else if (typeof Theme !== 'undefined' && typeof Theme.apply === 'function') {
      await Theme.apply(background);
    }
    this.saveConfig();
  }

  async setConfig() {
    this.refs.textarea.value = JSON.stringify(this.config, null, 4);
    const current = this.config.background || 'src/img/banners/bg-1.gif';
    this.refs.preview.src = await ImageDB.resolveUrl(current) || current;
    await this.renderThumbnails();
  }

  async renderThumbnails() {
    const currentBg = this.config.background || 'src/img/banners/bg-1.gif';
    const backgrounds = [
      'src/img/banners/bg-1.gif',
      'src/img/banners/bg-2.gif',
      'src/img/banners/bg-3.gif',
      'src/img/japanies.png',
    ];
    const customBackgrounds = this.config.customBackgrounds || [];
    const allBackgrounds = [...customBackgrounds, ...backgrounds];
    this.refs.thumbnails.innerHTML = allBackgrounds.map(b => {
      const isCustom = customBackgrounds.includes(b);
      return `
        <div class="thumb-wrapper">
          <img src="${escapeHtml(b)}" class="thumb ${b === currentBg ? 'active' : ''}" data-bg="${escapeHtml(b)}" alt="">
          ${isCustom ? `<button class="thumb-delete" data-bg="${escapeHtml(b)}" title="delete custom background">×</button>` : ''}
        </div>
      `;
    }).join('');
    await Promise.all(Array.from(this.refs.thumbnails.querySelectorAll('.thumb')).map(async (t) => {
      t.src = await ImageDB.resolveUrl(t.dataset.bg) || t.dataset.bg;
    }));
    this.refs.thumbnails.querySelectorAll('.thumb').forEach(t => {
      t.classList.toggle('active', t.dataset.bg === currentBg);
    });
  }

  async applyBackground() {
    const file = this.refs.backgroundFile.files[0];
    if (!file) return;
    console.log('[ConfigTab] applying file', file.name, file.size);
    try {
      const dataUrl = await resizeImage(await readFile(file));
      console.log('[ConfigTab] resized to', dataUrl.length, 'chars');
      const ref = await ImageDB.putImage(dataUrl);
      this.config.customBackgrounds = this.config.customBackgrounds || [];
      if (!this.config.customBackgrounds.includes(ref)) {
        this.config.customBackgrounds.unshift(ref);
      }
      await this.setBackground(ref);
      await this.renderThumbnails();
    } catch (e) {
      console.error('Failed to upload background:', e);
      alert('Failed to upload background: ' + (e.message || e));
    }
  }

  async deleteCustomBackground(background) {
    if (!confirm('delete this custom background?')) return;
    const isImageRef = ImageDB.isImageRef(background);
    const wasCurrent = this.config.background === background;

    this.config.customBackgrounds = (this.config.customBackgrounds || []).filter(b => b !== background);
    if (wasCurrent) {
      this.config.background = 'src/img/banners/bg-1.gif';
    }

    if (isImageRef) {
      try {
        await ImageDB.deleteImage(ImageDB.extractId(background));
        console.log('[ConfigTab] deleted image from IndexedDB', background);
      } catch (e) {
        console.error('Failed to delete image from IndexedDB:', e);
      }
    }

    this.saveConfig();
    await this.renderThumbnails();
    await this.setConfig();
  }

  async exportUserConfig() {
    try {
      const config = CONFIG.toJSON();
      const content = await this.generateUserConfig(config);
      const blob = new Blob([content], { type: 'text/javascript' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'userconfig.js';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      console.log('[ConfigTab] exported userconfig.js');
    } catch (e) {
      console.error('Failed to export userconfig.js:', e);
      alert('Failed to export config: ' + (e.message || e));
    }
  }

  async generateUserConfig(rawConfig) {
    const config = await this.resolveImageRefs(rawConfig);
    const json = JSON.stringify(config, null, 2);
    return `function hashConfig(obj) {
  const stable = (v) => {
    if (Array.isArray(v)) return '[' + v.map(stable).join(',') + ']';
    if (v && typeof v === 'object') {
      const keys = Object.keys(v).sort();
      return '{' + keys.map(k => JSON.stringify(k) + ':' + stable(v[k])).join(',') + '}';
    }
    return JSON.stringify(v);
  };
  let hash = 0;
  for (const char of stable(obj)) {
    hash = ((hash << 5) - hash) + char.charCodeAt(0);
    hash |= 0;
  }
  return hash.toString(36);
}

let saved_config;
try {
  saved_config = JSON.parse(localStorage.getItem("CONFIG"));
  if (saved_config && saved_config.config) saved_config = saved_config.config;
} catch (e) {
  console.error('Failed to parse CONFIG from localStorage:', e);
  saved_config = null;
}

const default_config = ${json};

const defaultConfigHash = hashConfig(default_config);

const initial_config = { ...default_config, configHash: defaultConfigHash };
if (saved_config) {
  if ('background' in saved_config) initial_config.background = saved_config.background;
  if ('customBackgrounds' in saved_config) initial_config.customBackgrounds = saved_config.customBackgrounds;
  if ('openLastVisitedTab' in saved_config) initial_config.openLastVisitedTab = saved_config.openLastVisitedTab;
  if ('tabs' in saved_config && saved_config.configHash === defaultConfigHash) {
    initial_config.tabs = saved_config.tabs;
  }
}

const CONFIG = new Config(initial_config);
// const CONFIG = new Config(default_config);

(function() {
  var css = document.createElement('link');
  css.href = 'src/css/tabler-icons.min.css';
  css.rel = 'stylesheet';
  css.type = 'text/css';
  if (!CONFIG.config.localIcons)
    document.getElementsByTagName('head')[0].appendChild(css);
})();
`;
  }

  async resolveImageRefs(config) {
    const result = JSON.parse(JSON.stringify(config));
    const refs = new Set();

    if (ImageDB.isImageRef(result.background)) refs.add(result.background);
    if (Array.isArray(result.customBackgrounds)) {
      result.customBackgrounds.forEach(b => { if (ImageDB.isImageRef(b)) refs.add(b); });
    }
    if (Array.isArray(result.customBanners)) {
      result.customBanners.forEach(b => { if (ImageDB.isImageRef(b)) refs.add(b); });
    }
    if (Array.isArray(result.tabs)) {
      result.tabs.forEach(t => { if (ImageDB.isImageRef(t.background_url)) refs.add(t.background_url); });
    }

    const cache = {};
    for (const ref of refs) {
      try {
        const dataUrl = await ImageDB.getImageAsDataUrl(ref);
        if (dataUrl) cache[ref] = dataUrl;
      } catch (e) {
        console.error('Failed to resolve image ref', ref, e);
      }
    }

    if (cache[result.background]) result.background = cache[result.background];
    if (Array.isArray(result.customBackgrounds)) {
      result.customBackgrounds = result.customBackgrounds.map(b => cache[b] || b);
    }
    if (Array.isArray(result.customBanners)) {
      result.customBanners = result.customBanners.map(b => cache[b] || b);
    }
    if (Array.isArray(result.tabs)) {
      result.tabs.forEach(t => {
        if (t.background_url && cache[t.background_url]) t.background_url = cache[t.background_url];
      });
    }

    return result;
  }

  async migrateCustomBackgrounds() {
    let changed = false;
    const custom = this.config.customBackgrounds || [];
    for (let i = 0; i < custom.length; i++) {
      const url = custom[i];
      if (typeof url === 'string' && url.startsWith('data:')) {
        try {
          custom[i] = await ImageDB.putImage(url);
          changed = true;
        } catch (e) {
          console.error('Failed to migrate custom background to IndexedDB:', e);
        }
      }
    }
    if (typeof this.config.background === 'string' && this.config.background.startsWith('data:')) {
      try {
        this.config.background = await ImageDB.putImage(this.config.background);
        changed = true;
      } catch (e) {
        console.error('Failed to migrate background to IndexedDB:', e);
      }
    }
    if (changed) {
      this.config.customBackgrounds = custom;
      this.saveConfig();
    }
  }

  connectedCallback() {
    this.render().then(async () => {
      this.setEvents();
      await this.migrateCustomBackgrounds();
      await this.setConfig();
    });
  }
}
