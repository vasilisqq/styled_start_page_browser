class Links extends Component {
  constructor() {
    super();
  }

  static getIcon(link) {
    const defaultColor = "#b8b0d9";

    if (link.icon_url)
      return `<img src="${link.icon_url}" class="link-icon" style="width:24px;height:24px;object-fit:contain;" alt="">`;

    return link.icon
      ? `<i class="ti ti-${link.icon} link-icon"
            style="color: ${link.icon_color ?? defaultColor}"></i>`
      : "";
  }

  static getAll(tabIndex, tabName, tabs, editMode) {
    const { categories } = tabs.find((f) => f.name === tabName);

    const categoryItems = categories.map(({ name, links }, categoryIndex) => {
      return `
        <li class="${editMode ? "edit-mode" : ""}">
          <h1>
            ${name}
            ${editMode
              ? `<button class="edit-btn rename-category"
                  data-tab="${tabIndex}" data-cat="${categoryIndex}" title="rename category">✎</button>
                 <button class="edit-btn delete-category"
                  data-tab="${tabIndex}" data-cat="${categoryIndex}" title="delete category">×</button>`
              : ""}
          </h1>
          <div class="links-wrapper">
            ${
              links.map((link, linkIndex) => `
                <div class="link-info ${editMode ? "edit-mode" : ""}">
                  <a href="${link.url}" data-tab="${tabIndex}" data-cat="${categoryIndex}" data-link="${linkIndex}">
                    ${Links.getIcon(link)}
                    ${link.name ? `<p class="link-name">${link.name}</p>` : ""}
                  </a>
              ${editMode
                ? `<button class="edit-btn rename-link"
                    data-tab="${tabIndex}" data-cat="${categoryIndex}" data-link="${linkIndex}" title="rename link">✎</button>
                   <button class="edit-btn delete-link"
                    data-tab="${tabIndex}" data-cat="${categoryIndex}" data-link="${linkIndex}" title="delete link">×</button>`
                : ""}
                </div>`).join("")
            }
            ${editMode
              ? `<button class="edit-btn add-link"
                  data-tab="${tabIndex}" data-cat="${categoryIndex}" title="add link">+ link</button>`
              : ""}
          </div>
        </li>`;
    }).join("");

    const addCategory = editMode
      ? `<div class="edit-category-add">
           <button class="edit-btn add-category" data-tab="${tabIndex}" title="add category">+ category</button>
         </div>`
      : "";

    return categoryItems + addCategory;
  }
}

class Category extends Component {
  constructor() {
    super();
  }

  static getBackgroundStyle(url) {
    return `style="background-image: url(${url});"`;
  }

  static getAll(tabs, editMode, activeIndex) {
    return `
      ${
      tabs.map(({ name, background_url }, index) => {
        return `<ul class="${name}" ${index === activeIndex ? "active" : ""}>
            <div class="banner" ${Category.getBackgroundStyle(background_url)}></div>
            <div class="links ${editMode ? "edit-mode" : ""}">${Links.getAll(index, name, tabs, editMode)}</div>
          </ul>`;
      }).join("")
    }
    `;
  }
}

class Tabs extends Component {
  refs = {};
  editMode = false;
  currentTabIndex = 0;

  static defaultBanners = [
    'src/img/banners/cbg-1.gif',
    'src/img/banners/cbg-2.gif',
    'src/img/banners/cbg-3.gif',
    'src/img/banners/cbg-4.gif',
    'src/img/banners/cbg-5.gif',
    'src/img/banners/cbg-6.gif',
    'src/img/banners/cbg-7.gif',
    'src/img/banners/cbg-8.gif',
    'src/img/banners/cbg-9.gif',
    'src/img/banners/cbg-10.gif',
    'src/img/banners/cbg-11.gif',
    'src/img/banners/cbg-12.gif',
    'src/img/banners/cbg-13.gif',
  ];

  constructor() {
    super();
    this.tabs = CONFIG.tabs;
  }

  imports() {
    return [
      this.resources.icons.material,
      this.resources.icons.tabler,
      this.resources.fonts.roboto,
      this.resources.fonts.raleway,
      this.resources.libs.awoo,
    ];
  }

  style() {
    return `
      :host {
        --jp-pink:    var(--accent, #ff4d8d);
        --jp-pink-15: hsla(var(--accent-h, 340), var(--accent-s, 100%), var(--accent-l, 65%), 0.15);
        --jp-pink-25: hsla(var(--accent-h, 340), var(--accent-s, 100%), var(--accent-l, 65%), 0.25);
        --jp-pink-35: hsla(var(--accent-h, 340), var(--accent-s, 100%), var(--accent-l, 65%), 0.35);
        --jp-pink-40: hsla(var(--accent-h, 340), var(--accent-s, 100%), var(--accent-l, 65%), 0.4);
        --jp-pink-65: hsla(var(--accent-h, 340), var(--accent-s, 100%), var(--accent-l, 65%), 0.65);
        --jp-pink-85: hsla(var(--accent-h, 340), var(--accent-s, 100%), var(--accent-l, 65%), 0.85);
        --jp-purple:  var(--accent-2, #9d4edd);
        --jp-cyan:    var(--accent-3, #4cc9f0);
        --jp-cyan-15: hsla(var(--accent-3-h, 193), var(--accent-3-s, 85%), var(--accent-3-l, 62%), 0.15);
        --jp-cyan-40: hsla(var(--accent-3-h, 193), var(--accent-3-s, 85%), var(--accent-3-l, 62%), 0.4);
        --jp-cyan-85: hsla(var(--accent-3-h, 193), var(--accent-3-s, 85%), var(--accent-3-l, 62%), 0.85);
        --jp-yellow:  var(--accent-4, #f7b801);
        --jp-text:    var(--text, #f0e6ef);
        --jp-muted:   var(--text-muted, rgba(240, 230, 239, 0.55));
        --jp-panel:   var(--panel-bg, rgba(13, 13, 18, 0.72));
        --jp-border:  var(--border, rgba(255, 77, 141, 0.35));
      }

      status-bar {
          position: absolute;
          bottom: 0;
          left: 0;
          width: 100%;
          height: 50px;
          background: linear-gradient(90deg, var(--panel-from, rgba(20, 16, 33, 0.92)) 0%, var(--panel-to, rgba(35, 19, 40, 0.92)) 100%);
          backdrop-filter: blur(8px) saturate(140%);
          border-radius: 0 0 6px 6px;
          box-shadow: 0 -4px 20px var(--shadow, rgba(0, 0, 0, .55)), inset 0 1px 0 var(--jp-border);
          border-top: 1px solid var(--jp-border);
          z-index: 5;
      }

      #panels, #panels ul,
      #panels .links {
          position: absolute;
      }

      .nav {
          color: var(--jp-text);
      }

      #panels {
          border-radius: 6px 0 0 6px;
          width: 70%;
          height: 520px;
          right: 0;
          left: 0;
          top: 0;
          bottom: 0;
          margin: auto;
          box-shadow:
            0 20px 50px var(--shadow, rgba(0, 0, 0, .55)),
            0 0 0 1px var(--jp-pink-25),
            0 0 40px hsla(var(--accent-2-h, 273), var(--accent-2-s, 68%), var(--accent-2-l, 58%), 0.15);
          background: var(--jp-panel);
          backdrop-filter: blur(16px) saturate(150%);
          overflow: hidden;
      }

      #panels.edit-mode {
          box-shadow:
            0 20px 50px var(--shadow, rgba(0, 0, 0, .55)),
            0 0 0 2px var(--jp-pink-65),
            0 0 60px var(--jp-pink-35);
          animation: editPulse 2s ease-in-out infinite;
      }

      @keyframes editPulse {
          0%, 100% { box-shadow: 0 20px 50px var(--shadow, rgba(0,0,0,.55)), 0 0 0 2px var(--jp-pink-65), 0 0 60px var(--jp-pink-25); }
          50% { box-shadow: 0 20px 50px var(--shadow, rgba(0,0,0,.55)), 0 0 0 2px hsla(var(--accent-h, 340), var(--accent-s, 100%), var(--accent-l, 65%), 0.9), 0 0 80px hsla(var(--accent-h, 340), var(--accent-s, 100%), var(--accent-l, 65%), 0.45); }
      }

      #panels::before {
          content: "";
          position: absolute;
          inset: 0;
          pointer-events: none;
          background:
            repeating-linear-gradient(
              0deg,
              rgba(255, 255, 255, 0.03) 0px,
              rgba(255, 255, 255, 0.03) 1px,
              transparent 1px,
              transparent 4px
            );
          mix-blend-mode: overlay;
          z-index: 2;
      }

      .categories {
          width: 100%;
          height: 100%;
          overflow: hidden;
          position: relative;
          border-radius: 6px 0 0 6px;
      }

      .categories ul {
          --flavour: var(--jp-pink);
          width: 100%;
          height: 100%;
          right: 100%;
          background: transparent;
          transition: all .6s cubic-bezier(0.22, 1, 0.36, 1);
      }

      .categories ul:nth-child(2) { --flavour: var(--jp-purple); }
      .categories ul:nth-child(3) { --flavour: var(--jp-cyan); }
      .categories ul:nth-child(4) { --flavour: var(--jp-yellow); }
      .categories ul:nth-child(5) { --flavour: var(--jp-pink); }
      .categories ul:nth-child(6) { --flavour: var(--jp-purple); }
      .categories ul:nth-child(7) { --flavour: var(--jp-cyan); }
      .categories ul:nth-child(8) { --flavour: var(--jp-yellow); }
      .categories ul:nth-child(9) { --flavour: var(--jp-pink); }
      .categories ul:nth-child(10) { --flavour: var(--jp-purple); }
      .categories ul:nth-child(11) { --flavour: var(--jp-cyan); }
      .categories ul:nth-child(12) { --flavour: var(--jp-yellow); }

      .categories ul[active] {
          right: 0;
          z-index: 1;
      }

      .banner {
          position: absolute;
          left: 0;
          top: 0;
          width: 30%;
          height: 100%;
          background-repeat: no-repeat;
          background-size: cover;
          background-position: center;
          filter: contrast(1.15) brightness(0.85) saturate(0.9);
          opacity: 0.55;
          mask-image: linear-gradient(to right, black 55%, transparent 100%);
          -webkit-mask-image: linear-gradient(to right, black 55%, transparent 100%);
          transition: opacity .6s, transform .6s, filter .6s;
      }

      .categories ul[active] .banner {
          opacity: 0.75;
          filter: contrast(1.25) brightness(0.95) saturate(1.15);
          transform: scale(1.03);
      }

      .categories .links {
          right: 0;
          width: 70%;
          height: 100%;
          background: transparent;
          padding: 5%;
          flex-wrap: wrap;
          z-index: 1;
          overflow-y: auto;
          scrollbar-width: thin;
          scrollbar-color: var(--flavour) transparent;
      }

      .categories .links::-webkit-scrollbar {
          width: 5px;
      }

      .categories .links::-webkit-scrollbar-thumb {
          background: var(--flavour);
          border-radius: 3px;
      }

      .categories .links li {
          list-style: none;
      }

      .categories ul .links a {
          color: var(--jp-text);
          text-decoration: none;
          font: 700 16px 'Roboto', sans-serif;
          letter-spacing: 0.3px;
          transition: all .2s ease;
          display: inline-flex;
          align-items: center;
          padding: .5em .85em;
          background: rgba(20, 18, 30, 0.78);
          border: 1px solid rgba(255, 255, 255, 0.08);
          box-shadow:
            0 4px 0 rgba(0, 0, 0, 0.35),
            0 6px 14px rgba(0, 0, 0, 0.35),
            inset 0 0 12px hsla(var(--accent-2-h, 273), var(--accent-2-s, 68%), var(--accent-2-l, 58%), 0.05);
          border-radius: 6px;
          margin-bottom: .7em;
          text-shadow: 0 0 8px rgba(255, 255, 255, 0.05);
      }

      .categories .links.edit-mode ul .links a {
          pointer-events: none;
          opacity: 0.7;
      }

      .categories .link-info {
          display: inline-flex;
          align-items: center;
      }

      .categories .link-info:not(:last-child) { margin-right: .6em; }

      .categories .link-info.edit-mode {
          position: relative;
          margin-top: 10px;
          margin-right: 24px;
      }

      .categories ul .links a:hover {
          transform: translate(0, 4px);
          box-shadow:
            0 0 0 rgba(0, 0, 0, 0.25),
            0 0 0 rgba(0, 0, 0, .5),
            0 0 18px var(--flavour),
            inset 0 0 18px var(--jp-pink-15);
          color: var(--flavour);
          border-color: var(--flavour);
          text-shadow: 0 0 12px var(--flavour);
      }

      .edit-btn {
          background: var(--jp-pink-15);
          border: 1px solid var(--jp-pink-40);
          color: var(--jp-pink);
          cursor: pointer;
          border-radius: 4px;
          font: 700 12px 'Roboto', sans-serif;
          padding: 0.2em 0.5em;
          margin-left: 0.5em;
          transition: all .2s ease;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          min-width: 24px;
          height: 24px;
          text-shadow: 0 0 6px var(--jp-pink);
          z-index: 10;
      }

      .edit-btn:hover {
          background: var(--jp-pink);
          color: #0d0d12;
          box-shadow: 0 0 12px var(--jp-pink);
          transform: scale(1.1);
      }

      .edit-btn.delete-link {
          position: absolute;
          top: -8px;
          right: -8px;
          margin: 0;
          border-radius: 50%;
          min-width: 20px;
          height: 20px;
          font-size: 10px;
          padding: 0;
          background: var(--jp-pink-85);
          color: #0d0d12;
      }

      .edit-btn.delete-link:hover {
          background: var(--jp-pink);
      }

      .edit-btn.add-link {
          margin-left: 0;
          margin-bottom: 0.7em;
      }

      .edit-btn.add-category {
          margin-top: 0.5em;
      }

      .edit-btn.rename-link {
          position: absolute;
          top: -8px;
          left: -8px;
          margin: 0;
          border-radius: 50%;
          min-width: 20px;
          height: 20px;
          font-size: 10px;
          padding: 0;
          background: var(--jp-cyan-85);
          color: #0d0d12;
      }

      .edit-btn.rename-link:hover {
          background: var(--jp-cyan);
      }

      .edit-btn.rename-category {
          margin-left: 0.5em;
          background: var(--jp-cyan-15);
          border-color: var(--jp-cyan-40);
          color: var(--jp-cyan);
      }

      .edit-btn.rename-category:hover {
          background: var(--jp-cyan);
          color: #0d0d12;
          box-shadow: 0 0 12px var(--jp-cyan);
      }

      .edit-btn.rename-tab {
          color: var(--jp-cyan);
      }

      .edit-btn.rename-tab:hover {
          color: var(--jp-cyan);
          text-shadow: 0 0 6px var(--jp-cyan);
      }

      .edit-category-add {
          margin-top: 1em;
      }

      .edit-hint {
          position: absolute;
          top: 10px;
          right: 15px;
          z-index: 10;
          color: var(--jp-pink);
          font: 700 12px 'Roboto', sans-serif;
          text-transform: uppercase;
          letter-spacing: 1px;
          text-shadow: 0 0 10px var(--jp-pink);
          pointer-events: none;
      }

      .edit-panel {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
          z-index: 6;
          display: flex;
          flex-direction: column;
          justify-content: flex-end;
          padding: 10px 15px;
      }

      .edit-tabs-bar {
          display: flex;
          align-items: center;
          gap: 8px;
          pointer-events: auto;
          margin-bottom: 5px;
      }

      .edit-tab-chip {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          background: rgba(20, 18, 30, 0.85);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 4px;
          padding: 4px 8px;
          color: var(--jp-text);
          font: 500 12px 'Roboto', sans-serif;
          cursor: default;
          max-width: 160px;
      }

      .edit-tab-name {
          max-width: 100px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
      }

      .edit-tab-chip.active {
          border-color: var(--jp-pink);
          box-shadow: 0 0 10px hsla(var(--accent-h, 340), var(--accent-s, 100%), var(--accent-l, 65%), 0.3);
      }

      .edit-tab-chip button {
          background: transparent;
          border: 0;
          color: var(--jp-pink);
          cursor: pointer;
          font: 700 12px 'Roboto', sans-serif;
          padding: 0;
          width: 16px;
          height: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
      }

      .edit-tab-chip button:hover {
          color: var(--jp-pink);
          text-shadow: 0 0 6px var(--jp-pink);
      }

      #edit-dialog {
          position: absolute;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 100%;
          height: 100%;
          background: rgba(10, 10, 16, 0.82);
          z-index: 100;
          visibility: hidden;
          top: -100%;
          left: 0;
          backdrop-filter: blur(12px) saturate(140%);
          transition: all .2s ease-in-out;
      }

      #edit-dialog.active {
          top: 0;
          visibility: visible;
      }

      .edit-dialog-content {
          width: 80%;
          max-width: 420px;
          background: rgba(13, 13, 18, 0.92);
          border: 1px solid var(--jp-border);
          border-radius: 6px;
          padding: 1.5em;
          box-shadow: 0 20px 50px rgba(0, 0, 0, .55);
      }

      .edit-dialog-title {
          margin: 0 0 1em 0;
          color: var(--jp-text);
          font: 700 16px 'Roboto', sans-serif;
          text-transform: uppercase;
          letter-spacing: 1px;
          text-shadow: 0 0 12px var(--jp-pink-25);
      }

      .edit-dialog-field {
          display: block;
          margin-bottom: 1em;
      }

      .edit-dialog-field span {
          display: block;
          margin-bottom: 0.3em;
          color: var(--jp-muted);
          font-size: 12px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
      }

      .edit-dialog-field input,
      .edit-dialog-field select {
          width: 100%;
          border: 0;
          outline: 0;
          background: rgba(20, 18, 30, 0.78);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 4px;
          padding: 0.6em;
          color: var(--jp-text);
          font: 500 14px 'Roboto', sans-serif;
      }

      .edit-dialog-field select {
          cursor: pointer;
      }

      .edit-dialog-field input[type="color"] {
          padding: 0.2em;
          height: 40px;
          cursor: pointer;
      }

      .edit-dialog-field input[type="file"] {
          padding: 0.4em;
          cursor: pointer;
      }

      .edit-dialog-field input::placeholder {
          color: var(--jp-muted);
      }

      .edit-dialog-field input:focus {
          border-color: var(--jp-pink);
          box-shadow: 0 0 12px var(--jp-pink-25);
      }

      .edit-dialog-actions {
          display: flex;
          justify-content: flex-end;
          gap: 0.5em;
          margin-top: 1.5em;
      }

      .dialog-btn {
          background: var(--jp-pink-15);
          border: 1px solid var(--jp-pink-40);
          color: var(--jp-pink);
          cursor: pointer;
          border-radius: 4px;
          font: 700 12px 'Roboto', sans-serif;
          padding: 0.5em 1em;
          transition: all .2s ease;
      }

      .dialog-btn:hover {
          background: var(--jp-pink);
          color: #0d0d12;
          box-shadow: 0 0 12px var(--jp-pink);
      }

      .dialog-btn.save {
          background: var(--jp-cyan-15);
          border-color: var(--jp-cyan-40);
          color: var(--jp-cyan);
      }

      .dialog-btn.save:hover {
          background: var(--jp-cyan);
          color: #0d0d12;
          box-shadow: 0 0 12px var(--jp-cyan);
      }

      #banner-dialog {
          position: absolute;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 100%;
          height: 100%;
          background: rgba(10, 10, 16, 0.82);
          z-index: 100;
          visibility: hidden;
          top: -100%;
          left: 0;
          backdrop-filter: blur(12px) saturate(140%);
          transition: all .2s ease-in-out;
      }

      #banner-dialog.active {
          top: 0;
          visibility: visible;
      }

      .banner-dialog-content {
          width: 80%;
          max-width: 420px;
          background: rgba(13, 13, 18, 0.94);
          border: 1px solid var(--jp-border);
          border-radius: 8px;
          padding: 1.5em;
          box-shadow: 0 20px 50px rgba(0, 0, 0, .55);
          backdrop-filter: blur(16px) saturate(150%);
      }

      .banner-dialog-title {
          margin: 0 0 1.2em 0;
          color: var(--jp-text);
          font: 700 18px 'Roboto', sans-serif;
          text-transform: uppercase;
          letter-spacing: 2px;
          text-align: center;
          text-shadow: 0 0 12px hsla(var(--accent-h, 340), var(--accent-s, 100%), var(--accent-l, 65%), 0.4);
      }

      .banner-preview {
          width: 100%;
          height: 140px;
          border-radius: 6px;
          overflow: hidden;
          margin-bottom: 1em;
          border: 1px solid rgba(255, 255, 255, 0.1);
          box-shadow: inset 0 0 20px rgba(0, 0, 0, 0.5);
      }

      .banner-preview-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center;
      }

      .banner-thumbnails {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 8px;
          margin-bottom: 1em;
      }

      .banner-thumb {
          width: 100%;
          height: 50px;
          object-fit: cover;
          border-radius: 4px;
          cursor: pointer;
          border: 2px solid transparent;
          opacity: 0.7;
          transition: all .2s ease;
      }

      .banner-thumb:hover {
          opacity: 1;
          transform: scale(1.05);
          border-color: rgba(255, 255, 255, 0.3);
      }

      .banner-thumb.active {
          opacity: 1;
          border-color: var(--jp-cyan);
          box-shadow: 0 0 12px var(--jp-cyan-40);
      }

      .banner-custom {
          display: flex;
          flex-direction: column;
          gap: 0.5em;
          margin-bottom: 1.5em;
      }

      .banner-custom .upload-label {
          color: var(--jp-muted);
          font-size: 12px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
      }

      .banner-file {
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

      .banner-actions {
          display: flex;
          justify-content: flex-end;
          gap: 0.8em;
      }

      .categories ul::after {
          content: attr(class);
          position: absolute;
          display: flex;
          text-transform: uppercase;
          writing-mode: vertical-rl;
          text-orientation: mixed;
          white-space: nowrap;
          width: 28px;
          height: 240px;
          padding: 1em 0.6em;
          margin: auto;
          border-radius: 4px;
          box-shadow:
            inset 0 0 0 2px var(--flavour),
            0 0 20px var(--flavour),
            0 0 8px rgba(255, 255, 255, 0.1);
          left: calc(15% - 38px);
          bottom: 0;
          top: 0;
          background: linear-gradient(to top, rgba(10, 10, 16, 0.92), rgba(10, 10, 16, 0.55));
          color: var(--flavour);
          letter-spacing: 1px;
          font: 500 22px 'Nunito', sans-serif;
          text-align: center;
          align-items: center;
          justify-content: center;
          backdrop-filter: blur(6px);
          z-index: 3;
          text-shadow: 0 0 16px var(--flavour);
          overflow: hidden;
      }

      .categories .links li:not(:last-child) {
          box-shadow: 0 1px 0 rgba(255, 255, 255, .12);
          padding: 0 0 .5em 0;
          margin-bottom: 1.5em;
      }

      .categories .links li h1 {
          color: var(--jp-text);
          opacity: 0.65;
          font-size: 12px;
          margin-bottom: 1em;
          font-weight: 600;
          letter-spacing: 1.5px;
          text-transform: uppercase;
          font-family: 'Raleway', sans-serif;
          text-shadow: 0 0 10px hsla(var(--accent-h, 340), var(--accent-s, 100%), var(--accent-l, 65%), 0.3);
          display: flex;
          align-items: center;
      }

      .categories .link-icon {
          font-size: 24px;
          color: inherit;
          filter: drop-shadow(0 0 4px currentColor);
          transition: transform .2s ease;
      }

      .categories ul .links a:hover .link-icon {
          transform: scale(1.1);
      }

      .categories .link-icon + .link-name {
          margin-left: 10px;
      }

      .categories .links-wrapper {
          display: flex;
          flex-wrap: wrap;
      }

      .ti {
          animation: fadeInAnimation ease .5s;
          animation-iteration-count: 1;
          animation-fill-mode: forwards;
          height: 24px;
          width: 24px;
      }

      @keyframes fadeInAnimation {
          0% { opacity: 0; transform: translateY(5px); }
          100% { opacity: 1; transform: translateY(0); }
      }

      @keyframes glitchShift {
          0%   { transform: translate(0); }
          20%  { transform: translate(-2px, 2px); }
          40%  { transform: translate(2px, -2px); }
          60%  { transform: translate(-1px, 1px); }
          80%  { transform: translate(1px, -1px); }
          100% { transform: translate(0); }
      }

      .categories ul[active]::after {
          animation: glitchShift 0.35s ease-in-out 1;
      }
    `;
  }

  template() {
    const editPanel = this.editMode
      ? `<div class="edit-panel">
           <div class="edit-hint">edit mode</div>
           <div class="edit-tabs-bar">
             ${this.tabs.map((tab, i) => `
                <div class="edit-tab-chip ${i === this.currentTabIndex ? 'active' : ''}">
                  <span class="edit-tab-name">${tab.name}</span>
                  <button class="edit-btn rename-tab" data-tab="${i}" title="rename tab">✎</button>
                  <button class="edit-btn delete-tab" data-tab="${i}" title="delete tab">×</button>
                </div>
             `).join('')}
             <button class="edit-btn add-tab" title="add tab">+ tab</button>
           </div>
         </div>`
      : "";

    return `
      <div id="links" class="-">

        <div id="panels" class="${this.editMode ? "edit-mode" : ""}">
          <div class="categories">
            ${Category.getAll(this.tabs, this.editMode, this.currentTabIndex)}
            <search-bar></search-bar>
            <config-tab></config-tab>
          </div>
          <status-bar class="!-"></status-bar>
          ${editPanel}
          <div id="edit-dialog">
            <div class="edit-dialog-content">
              <h2 class="edit-dialog-title"></h2>
              <div class="edit-dialog-fields"></div>
              <div class="edit-dialog-actions">
                <button class="dialog-btn save">save</button>
                <button class="dialog-btn cancel">cancel</button>
              </div>
            </div>
          </div>
          <div id="banner-dialog">
            <div class="banner-dialog-content">
              <h2 class="banner-dialog-title">choose banner</h2>
              <div class="banner-preview">
                <img class="banner-preview-img" src="" alt="">
              </div>
              <div class="banner-thumbnails"></div>
              <div class="banner-custom">
                <label class="upload-label">or upload custom</label>
                <input type="file" class="banner-file" accept="image/*">
              </div>
              <div class="banner-actions">
                <button class="dialog-btn banner-cancel">cancel</button>
                <button class="dialog-btn banner-select">select</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  setEvents() {
    this.shadow.addEventListener('click', (e) => {
      const btn = e.target.closest('.edit-btn');
      if (!btn) return;
      e.preventDefault();
      e.stopPropagation();

      const tabIndex = parseInt(btn.dataset.tab, 10);

      if (btn.classList.contains('rename-link')) {
        const catIndex = parseInt(btn.dataset.cat, 10);
        const linkIndex = parseInt(btn.dataset.link, 10);
        this.renameLink(tabIndex, catIndex, linkIndex);
      }
      else if (btn.classList.contains('delete-link')) {
        const catIndex = parseInt(btn.dataset.cat, 10);
        const linkIndex = parseInt(btn.dataset.link, 10);
        this.deleteLink(tabIndex, catIndex, linkIndex);
      }
      else if (btn.classList.contains('add-link')) {
        const catIndex = parseInt(btn.dataset.cat, 10);
        this.addLink(tabIndex, catIndex);
      }
      else if (btn.classList.contains('rename-category')) {
        const catIndex = parseInt(btn.dataset.cat, 10);
        this.renameCategory(tabIndex, catIndex);
      }
      else if (btn.classList.contains('delete-category')) {
        const catIndex = parseInt(btn.dataset.cat, 10);
        this.deleteCategory(tabIndex, catIndex);
      }
      else if (btn.classList.contains('add-category')) {
        this.addCategory(tabIndex);
      }
      else if (btn.classList.contains('rename-tab')) {
        this.renameTab(tabIndex);
      }
      else if (btn.classList.contains('delete-tab')) {
        this.deleteTab(tabIndex);
      }
      else if (btn.classList.contains('add-tab')) {
        this.addTab();
      }
    });
  }

  toggleEditMode() {
    this.setCurrentTab();
    this.editMode = !this.editMode;
    this.render().then(() => {
      this.setEvents();
    });
  }

  setCurrentTab() {
    const active = this.shadow.querySelector('.categories ul[active]');
    const tabs = this.shadow.querySelectorAll('.categories ul');
    tabs.forEach((tab, i) => {
      if (tab === active) this.currentTabIndex = i;
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

  openDialog(title, fields) {
    return new Promise((resolve) => {
      const dialog = this.shadow.querySelector('#edit-dialog');
      const titleEl = dialog.querySelector('.edit-dialog-title');
      const fieldsEl = dialog.querySelector('.edit-dialog-fields');
      const saveBtn = dialog.querySelector('.edit-dialog-actions .save');
      const cancelBtn = dialog.querySelector('.edit-dialog-actions .cancel');

      titleEl.textContent = title;
      fieldsEl.innerHTML = fields.map(field => {
        if (field.type === 'html')
          return `<div class="edit-dialog-field">${field.html}</div>`;

        if (field.type === 'select') {
          const options = field.options.map(opt => `<option value="${opt.value}" ${opt.value === field.value ? 'selected' : ''}>${opt.label}</option>`).join('');
          return `
            <label class="edit-dialog-field">
              <span>${field.label}</span>
              <select name="${field.name}">${options}</select>
            </label>`;
        }

        const value = field.value ?? '';
        const placeholder = field.placeholder ? `placeholder="${field.placeholder}"` : '';
        const accept = field.accept ? `accept="${field.accept}"` : '';
        const required = field.required ? 'required' : '';
        const maxlength = field.maxlength ? `maxlength="${field.maxlength}"` : '';
        return `
          <label class="edit-dialog-field">
            <span>${field.label}</span>
            <input type="${field.type}" name="${field.name}" value="${value}" ${placeholder} ${accept} ${required} ${maxlength}>
          </label>`;
      }).join('');

      dialog.classList.add('active');

      const cleanup = () => {
        dialog.classList.remove('active');
        saveBtn.onclick = null;
        cancelBtn.onclick = null;
      };

      saveBtn.onclick = () => {
        const inputs = fieldsEl.querySelectorAll('input, select');
        const values = {};
        inputs.forEach(input => {
          if (input.tagName === 'SELECT') {
            values[input.name] = input.value;
          } else if (input.type === 'file') {
            values[input.name] = input.files[0] || null;
          } else {
            values[input.name] = input.value;
          }
        });
        cleanup();
        resolve(values);
      };

      cancelBtn.onclick = () => {
        cleanup();
        resolve(null);
      };
    });
  }

  openBannerDialog(currentBanner) {
    return new Promise((resolve) => {
      const dialog = this.shadow.querySelector('#banner-dialog');
      const preview = dialog.querySelector('.banner-preview-img');
      const thumbnails = dialog.querySelector('.banner-thumbnails');
      const fileInput = dialog.querySelector('.banner-file');
      const cancelBtn = dialog.querySelector('.banner-cancel');
      const selectBtn = dialog.querySelector('.banner-select');
      let selected = currentBanner;

      preview.src = currentBanner;
      thumbnails.innerHTML = Tabs.defaultBanners.map(b => `
        <img src="${b}" class="banner-thumb ${b === currentBanner ? 'active' : ''}" data-bg="${b}" alt="">
      `).join('');

      dialog.classList.add('active');

      const cleanup = () => {
        dialog.classList.remove('active');
        cancelBtn.onclick = null;
        selectBtn.onclick = null;
        thumbnails.onclick = null;
        fileInput.onchange = null;
      };

      thumbnails.onclick = (e) => {
        const thumb = e.target.closest('.banner-thumb');
        if (!thumb) return;
        selected = thumb.dataset.bg;
        preview.src = selected;
        thumbnails.querySelectorAll('.banner-thumb').forEach(t => {
          t.classList.toggle('active', t === thumb);
        });
      };

      fileInput.onchange = async () => {
        const file = fileInput.files[0];
        if (!file) return;
        selected = await this.resizeImage(await this.readFile(file));
        preview.src = selected;
        thumbnails.querySelectorAll('.banner-thumb').forEach(t => t.classList.remove('active'));
      };

      cancelBtn.onclick = () => {
        cleanup();
        resolve(null);
      };

      selectBtn.onclick = () => {
        cleanup();
        resolve(selected);
      };
    });
  }

  saveAndReload() {
    try {
      CONFIG.tabs = JSON.parse(JSON.stringify(this.tabs));
    } catch (e) {
      if (e.name === 'QuotaExceededError' || e.message.toLowerCase().includes('quota')) {
        alert('localStorage quota exceeded. Try removing custom images or clearing site data.');
        return;
      }
      throw e;
    }
    setTimeout(() => location.reload(), 100);
  }

  deleteLink(tabIndex, catIndex, linkIndex) {
    if (!confirm('delete this link?')) return;
    this.tabs[tabIndex].categories[catIndex].links.splice(linkIndex, 1);
    this.saveAndReload();
  }

  async addLink(tabIndex, catIndex) {
    const values = await this.openDialog('add link', [
      { name: 'name', label: 'link name', type: 'text', required: true, maxlength: 30 },
      { name: 'url', label: 'url', type: 'text', placeholder: 'https://', required: true },
      { type: 'html', html: '<a href="https://tabler-icons.io" target="_blank" style="color:var(--jp-cyan);text-decoration:none;">find tabler icons here</a>' },
      { name: 'icon', label: 'tabler icon name', type: 'text', placeholder: 'world' },
      { name: 'iconFile', label: 'or upload custom icon', type: 'file', accept: 'image/*' },
      { name: 'color', label: 'icon color', type: 'color', value: '#ff4d8d' },
    ]);
    if (!values) return;

    const link = {
      name: values.name,
      url: values.url,
      icon_color: values.color || '#ff4d8d',
    };

    if (values.iconFile) {
      link.icon_url = await this.readFile(values.iconFile);
    } else {
      link.icon = values.icon || 'world';
    }

    this.tabs[tabIndex].categories[catIndex].links.push(link);
    this.saveAndReload();
  }

  deleteCategory(tabIndex, catIndex) {
    if (!confirm('delete this category and all its links?')) return;
    this.tabs[tabIndex].categories.splice(catIndex, 1);
    this.saveAndReload();
  }

  async addCategory(tabIndex) {
    const values = await this.openDialog('add category', [
      { name: 'name', label: 'category name', type: 'text', required: true },
    ]);
    if (!values) return;
    this.tabs[tabIndex].categories.push({ name: values.name, links: [] });
    this.saveAndReload();
  }

  deleteTab(tabIndex) {
    if (this.tabs.length <= 1) {
      alert('need at least one tab');
      return;
    }
    if (!confirm('delete this tab?')) return;
    this.tabs.splice(tabIndex, 1);
    this.saveAndReload();
  }

  async addTab() {
    const values = await this.openDialog('add tab', [
      { name: 'name', label: 'tab name', type: 'text', required: true, maxlength: 8 },
    ]);
    if (!values) return;

    const defaultBanner = this.pickRandomBanner();
    const background_url = await this.openBannerDialog(defaultBanner);
    if (!background_url) return;

    this.tabs.push({
      name: values.name,
      background_url,
      categories: [{ name: 'new', links: [] }],
    });
    this.saveAndReload();
  }

  pickRandomBanner(excludeTabIndex = -1) {
    const used = this.tabs
      .map((t, i) => i === excludeTabIndex ? null : t.background_url)
      .filter(Boolean);
    const unused = Tabs.defaultBanners.filter(b => !used.includes(b));
    const pool = unused.length ? unused : Tabs.defaultBanners;
    return pool[Math.floor(Math.random() * pool.length)];
  }

  async renameTab(tabIndex) {
    const tab = this.tabs[tabIndex];
    const values = await this.openDialog('edit tab', [
      { name: 'name', label: 'tab name', type: 'text', value: tab.name, required: true, maxlength: 8 },
    ]);
    if (!values) return;
    tab.name = values.name;

    const background_url = await this.openBannerDialog(tab.background_url);
    if (background_url) {
      tab.background_url = background_url;
    }

    this.saveAndReload();
  }

  async renameCategory(tabIndex, catIndex) {
    const category = this.tabs[tabIndex].categories[catIndex];
    const values = await this.openDialog('rename category', [
      { name: 'name', label: 'category name', type: 'text', value: category.name, required: true },
    ]);
    if (!values) return;
    category.name = values.name;
    this.saveAndReload();
  }

  async renameLink(tabIndex, catIndex, linkIndex) {
    const link = this.tabs[tabIndex].categories[catIndex].links[linkIndex];
    const values = await this.openDialog('edit link', [
      { name: 'name', label: 'link name', type: 'text', value: link.name, required: true, maxlength: 30 },
      { name: 'url', label: 'url', type: 'text', value: link.url, required: true },
      { type: 'html', html: '<a href="https://tabler-icons.io" target="_blank" style="color:var(--jp-cyan);text-decoration:none;">find tabler icons here</a>' },
      { name: 'icon', label: 'tabler icon name', type: 'text', value: link.icon || '', placeholder: 'world' },
      { name: 'iconFile', label: 'or replace custom icon', type: 'file', accept: 'image/*' },
      { name: 'color', label: 'icon color', type: 'color', value: link.icon_color || '#ff4d8d' },
    ]);
    if (!values) return;

    link.name = values.name;
    link.url = values.url;
    link.icon_color = values.color || '#ff4d8d';

    if (values.iconFile) {
      link.icon_url = await this.readFile(values.iconFile);
      delete link.icon;
    } else if (values.icon) {
      link.icon = values.icon;
      delete link.icon_url;
    }

    this.saveAndReload();
  }

  activate() {
    this.toggleEditMode();
  }

  connectedCallback() {
    this.render().then(() => {
      this.setEvents();
      this.setCurrentTab();

      const categories = this.shadow.querySelector('.categories');
      if (categories) {
        this.tabObserver = new MutationObserver(() => this.setCurrentTab());
        this.tabObserver.observe(categories, { attributes: true, subtree: true, attributeFilter: ['active'] });
      }
    });
  }
}
