class Links extends Component {
  constructor() {
    super();
  }

  static getIcon(link) {
    const defaultColor = "#b8b0d9";

    return link.icon
      ? `<i class="ti ti-${link.icon} link-icon"
            style="color: ${link.icon_color ?? defaultColor}"></i>`
      : "";
  }

  static getAll(tabName, tabs) {
    const { categories } = tabs.find((f) => f.name === tabName);

    return `
      ${
      categories.map(({ name, links }) => {
        return `
          <li>
            <h1>${name}</h1>
              <div class="links-wrapper">
              ${
          links.map((link) => `
                  <div class="link-info">
                    <a href="${link.url}">
                      ${Links.getIcon(link)}
                      ${
            link.name ? `<p class="link-name">${link.name}</p>` : ""
          }
                    </a>
                </div>`).join("")
        }
            </div>
          </li>`;
      }).join("")
    }
    `;
  }
}

class Category extends Component {
  constructor() {
    super();
  }

  static getBackgroundStyle(url) {
    return `style="background-image: url(${url});"`;
  }

  static getAll(tabs) {
    return `
      ${
      tabs.map(({ name, background_url }, index) => {
        return `<ul class="${name}" ${index == 0 ? "active" : ""}>
            <div class="banner" ${Category.getBackgroundStyle(background_url)}></div>
            <div class="links">${Links.getAll(name, tabs)}</div>
          </ul>`;
      }).join("")
    }
    `;
  }
}

class Tabs extends Component {
  refs = {};

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
        --jp-pink:   #ff4d8d;
        --jp-purple: #9d4edd;
        --jp-cyan:   #4cc9f0;
        --jp-yellow: #f7b801;
        --jp-text:   #f0e6ef;
        --jp-muted:  rgba(240, 230, 239, 0.55);
        --jp-panel:  rgba(13, 13, 18, 0.72);
        --jp-border: rgba(255, 77, 141, 0.35);
      }

      status-bar {
          position: absolute;
          bottom: 0;
          left: 0;
          width: 100%;
          height: 50px;
          background: linear-gradient(90deg, rgba(20, 16, 33, 0.92) 0%, rgba(35, 19, 40, 0.92) 100%);
          backdrop-filter: blur(8px) saturate(140%);
          border-radius: 0 0 6px 6px;
          box-shadow: 0 -4px 20px rgba(0, 0, 0, .55), inset 0 1px 0 rgba(255, 77, 141, 0.35);
          border-top: 1px solid rgba(255, 77, 141, 0.35);
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
          height: 450px;
          right: 0;
          left: 0;
          top: 0;
          bottom: 0;
          margin: auto;
          box-shadow:
            0 20px 50px rgba(0, 0, 0, .55),
            0 0 0 1px rgba(255, 77, 141, 0.25),
            0 0 40px rgba(157, 78, 221, 0.15);
          background: var(--jp-panel);
          backdrop-filter: blur(16px) saturate(150%);
          overflow: hidden;
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

      .categories ul:nth-child(2) { --flavour: #ff4d8d; }
      .categories ul:nth-child(3) { --flavour: #9d4edd; }
      .categories ul:nth-child(4) { --flavour: #4cc9f0; }
      .categories ul:nth-child(5) { --flavour: #f7b801; }
      .categories ul:nth-child(6) { --flavour: #ff4d8d; }
      .categories ul:nth-child(7) { --flavour: #9d4edd; }
      .categories ul:nth-child(8) { --flavour: #4cc9f0; }
      .categories ul:nth-child(9) { --flavour: #f7b801; }
      .categories ul:nth-child(10) { --flavour: #ff4d8d; }
      .categories ul:nth-child(11) { --flavour: #9d4edd; }
      .categories ul:nth-child(12) { --flavour: #4cc9f0; }

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
            inset 0 0 12px rgba(157, 78, 221, 0.05);
          border-radius: 6px;
          margin-bottom: .7em;
          text-shadow: 0 0 8px rgba(255, 255, 255, 0.05);
      }

      .categories .link-info {
          display: inline-flex;
      }

      .categories .link-info:not(:last-child) { margin-right: .6em; }

      .categories ul .links a:hover {
          transform: translate(0, 4px);
          box-shadow:
            0 0 0 rgba(0, 0, 0, 0.25),
            0 0 0 rgba(0, 0, 0, .5),
            0 0 18px var(--flavour),
            inset 0 0 18px rgba(255, 77, 141, 0.08);
          color: var(--flavour);
          border-color: var(--flavour);
          text-shadow: 0 0 12px var(--flavour);
      }

      .categories ul::after {
          content: attr(class);
          position: absolute;
          display: flex;
          text-transform: uppercase;
          overflow-wrap: break-word;
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
          font: 500 28px 'Nunito', sans-serif;
          text-align: center;
          flex-wrap: wrap;
          word-break: break-all;
          align-items: center;
          backdrop-filter: blur(6px);
          z-index: 3;
          text-shadow: 0 0 16px var(--flavour);
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
          text-shadow: 0 0 10px rgba(255, 77, 141, 0.3);
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
    return `
      <div id="links" class="-">

        <div id="panels">
          <div class="categories">
            ${Category.getAll(this.tabs)}
            <search-bar></search-bar>
            <config-tab></config-tab>
          </div>
          <status-bar class="!-"></status-bar>
        </div>
      </div>
    `;
  }

  connectedCallback() {
    this.render();
  }
}
