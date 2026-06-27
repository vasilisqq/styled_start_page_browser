class ConfigTab extends Component {
  refs = {
    config: '#config',
    textarea: '#config textarea[type="text"]',
    preview: '.preview-img',
    thumbnails: '.background-thumbnails',
    backgroundFile: '.background-file',
    close: '.close'
  };

  constructor() {
    super();

    let stored = JSON.parse(localStorage.getItem("CONFIG"));
    if (stored && stored.config) stored = stored.config;
    this.config = stored || {};
  }

  style() {
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
          position: absolute;
          display: flex;
          align-items: center;
          justify-content: center;
          width: calc(100% - 2px);
          height: 100%;
          background: rgba(10, 10, 16, 0.82);
          z-index: 99;
          visibility: hidden;
          top: -100%;
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
    return `
        <div id="config">
          <textarea type="text" style="display:none;"></textarea>
          <div class="config-card">
            <h2 class="config-title">settings</h2>
            <div class="background-section">
              <label class="section-label">background</label>
              <div class="background-preview">
                <img class="preview-img" src="${currentBg}" alt="background preview">
              </div>
              <div class="background-thumbnails">
                ${allBackgrounds.map(b => `<img src="${b}" class="thumb ${b === currentBg ? 'active' : ''}" data-bg="${b}" alt="">`).join('')}
              </div>
              <div class="custom-upload">
                <label class="upload-label">or upload custom</label>
                <input type="file" class="background-file" accept="image/*">
              </div>
            </div>
            <div class="config-actions">
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
    this.config.customBackgrounds = this.config.customBackgrounds || [];

    const trySave = (pretty) =>
      localStorage.setItem("CONFIG", JSON.stringify(this.config, null, pretty ? 4 : undefined));

    const isQuotaError = (err) =>
      err.name === 'QuotaExceededError' ||
      err.message.toLowerCase().includes('quota') ||
      err.message.toLowerCase().includes('exceeded');

    try {
      try {
        trySave(true);
      } catch (e) {
        if (!isQuotaError(e)) throw e;

        // remove the largest custom background until it fits
        while (this.config.customBackgrounds.length > 0) {
          const largestIndex = this.config.customBackgrounds
            .map((b, i) => ({ i, len: b.length }))
            .reduce((a, b) => (b.len > a.len ? b : a), { i: 0, len: 0 }).i;
          this.config.customBackgrounds.splice(largestIndex, 1);
          try {
            trySave(true);
            break;
          } catch (err) {
            if (!isQuotaError(err)) throw err;
          }
        }

        // if background itself is a huge base64 and still exceeds quota, fall back to default
        try {
          trySave(true);
        } catch (err) {
          if (this.config.background && this.config.background.startsWith('data:')) {
            this.config.background = 'src/img/banners/bg-1.gif';
          }
          try {
            trySave(true);
          } catch (err2) {
            trySave(false);
          }
        }
      }
    } catch (e) {
      if (isQuotaError(e)) {
        alert('Failed to save settings: localStorage quota exceeded. Please clear site data or remove custom images.');
      }
      throw e;
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
    this.refs.thumbnails.onclick = async (e) => {
      const thumb = e.target.closest('.thumb');
      if (!thumb) return;
      await this.setBackground(thumb.dataset.bg);
    };
    this.refs.backgroundFile.onchange = async () => {
      await this.applyBackground();
    };
  }

  async setBackground(background) {
    this.config.background = background;
    this.refs.preview.src = background;
    this.shadow.querySelectorAll('.thumb').forEach(t => {
      t.classList.toggle('active', t.dataset.bg === background);
    });
    document.body.style.backgroundImage = 'url("' + background + '")';
    if (typeof window.applyGlobalAccent === 'function') {
      await window.applyGlobalAccent(background);
    } else if (typeof Theme !== 'undefined' && typeof Theme.apply === 'function') {
      await Theme.apply(background);
    }
    this.saveConfig();
  }

  setConfig() {
    this.refs.textarea.value = JSON.stringify(this.config, null, 4);
    const current = this.config.background || 'src/img/banners/bg-1.gif';
    this.refs.preview.src = current;
    this.shadow.querySelectorAll('.thumb').forEach(t => {
      t.classList.toggle('active', t.dataset.bg === current);
    });
  }

  readFile(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target.result);
      reader.onerror = (e) => reject(e);
      reader.readAsDataURL(file);
    });
  }

  resizeImage(dataUrl, maxWidth = 1280, maxHeight = 1280, quality = 0.85) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let { width, height } = img;
        if (width > height) {
          if (width > maxWidth) { height = Math.round(height * maxWidth / width); width = maxWidth; }
        } else {
          if (height > maxHeight) { width = Math.round(width * maxHeight / height); height = maxHeight; }
        }
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL('image/jpeg', quality));
      };
      img.onerror = reject;
      img.src = dataUrl;
    });
  }

  async applyBackground() {
    const file = this.refs.backgroundFile.files[0];
    if (!file) return;
    const background = await this.resizeImage(await this.readFile(file));
    this.config.customBackgrounds = this.config.customBackgrounds || [];
    if (!this.config.customBackgrounds.includes(background)) {
      this.config.customBackgrounds.unshift(background);
      this.config.customBackgrounds = this.config.customBackgrounds.slice(0, 2);
    }
    await this.setBackground(background);

    const existing = this.refs.thumbnails.querySelector(`[data-bg="${CSS.escape(background)}"]`);
    if (!existing) {
      const img = document.createElement('img');
      img.src = background;
      img.className = 'thumb active';
      img.dataset.bg = background;
      img.alt = '';
      this.refs.thumbnails.insertBefore(img, this.refs.thumbnails.firstChild);
      this.refs.thumbnails.querySelectorAll('.thumb').forEach(t => {
        t.classList.toggle('active', t.dataset.bg === background);
      });
    }
  }

  connectedCallback() {
    this.render().then(() => {
      this.setEvents();
      this.setConfig();
    });
  }
}
