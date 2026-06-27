class Statusbar extends Component {
  externalRefs = {};

  refs = {
    categories: ".categories ul",
    tabs: "#tabs ul li",
    indicator: ".indicator",
  };

  currentTabIndex = 0;

  constructor() {
    super();
  }

  setDependencies() {
    this.externalRefs = {
      categories: this.parentNode.querySelectorAll(this.refs.categories),
    };
  }

  imports() {
    return [
      this.resources.fonts.roboto,
      this.resources.icons.material,
      this.resources.libs.awoo,
    ];
  }

  styles() {
    return `
      :host {
        --jp-pink:    var(--accent, #ff4d8d);
        --jp-pink-15: hsla(var(--accent-h, 340), var(--accent-s, 100%), var(--accent-l, 65%), 0.15);
        --jp-pink-40: hsla(var(--accent-h, 340), var(--accent-s, 100%), var(--accent-l, 65%), 0.4);
        --jp-purple:  var(--accent-2, #9d4edd);
        --jp-cyan:    var(--accent-3, #4cc9f0);
        --jp-yellow:  var(--accent-4, #f7b801);
        --jp-text:    var(--text, #f0e6ef);
        --jp-muted:   var(--text-muted, rgba(240, 230, 239, 0.55));
      }

      *:not(:defined) { display: none; }

      #tabs,
      #tabs .widgets,
      #tabs ul li:last-child {
          position: absolute;
      }

      #tabs {
          width: 100%;
          height: 100%;
      }

      #tabs ul {
          counter-reset: tabs;
          height: 100%;
          position: relative;
          list-style: none;
          margin-left: 1em;
      }

      #tabs ul li:not(:last-child)::after {
          content: counter(tabs, cjk-ideographic);
          counter-increment: tabs;
          display: flex;
          width: 100%;
          height: 100%;
          position: relative;
          align-items: center;
          text-align: center;
          justify-content: center;
      }

      #tabs ul li:not(:last-child) {
          width: 35px;
          text-align: center;
          font: 700 13px 'Yu Gothic', 'Noto Sans JP', serif;
          color: rgba(240, 230, 239, 0.85);
          padding: 6px 0;
          transition: all .2s ease;
          cursor: pointer;
          line-height: 0;
          height: 100%;
          text-shadow: 0 0 6px var(--jp-pink-40);
      }

      #tabs ul li:not(:last-child):hover {
          color: var(--jp-text);
          background: var(--jp-pink-15);
          text-shadow: 0 0 12px var(--jp-pink);
      }

      #tabs ul li:last-child {
          --flavour: var(--jp-pink);
          width: 35px;
          height: 3px;
          background: var(--flavour);
          bottom: 0;
          transition: all .3s ease;
          box-shadow: 0 0 12px var(--flavour), 0 0 4px var(--flavour);
      }

      #tabs ul li[active]:not(:last-child) {
          color: var(--jp-text);
          font-size: 13px;
          padding: 6px 0;
          text-shadow: 0 0 16px var(--flavour);
      }

      #tabs ul li[active]:nth-child(2) ~ li:last-child { margin: 0 0 0 35px; }
      #tabs ul li[active]:nth-child(3) ~ li:last-child { margin: 0 0 0 70px; }
      #tabs ul li[active]:nth-child(4) ~ li:last-child { margin: 0 0 0 105px; }
      #tabs ul li[active]:nth-child(5) ~ li:last-child { margin: 0 0 0 140px; }
      #tabs ul li[active]:nth-child(6) ~ li:last-child { margin: 0 0 0 175px; }
      #tabs ul li[active]:nth-child(7) ~ li:last-child { margin: 0 0 0 210px; }
      #tabs ul li[active]:nth-child(8) ~ li:last-child { margin: 0 0 0 245px; }
      #tabs ul li[active]:nth-child(9) ~ li:last-child { margin: 0 0 0 280px; }
      #tabs ul li[active]:nth-child(10) ~ li:last-child { margin: 0 0 0 315px; }
      #tabs ul li[active]:nth-child(11) ~ li:last-child { margin: 0 0 0 350px; }
      #tabs ul li[active]:nth-child(12) ~ li:last-child { margin: 0 0 0 385px; }

      #tabs ul li[active]:nth-child(2) ~ li:last-child { --flavour: var(--jp-purple); }
      #tabs ul li[active]:nth-child(3) ~ li:last-child { --flavour: var(--jp-cyan); }
      #tabs ul li[active]:nth-child(4) ~ li:last-child { --flavour: var(--jp-yellow); }
      #tabs ul li[active]:nth-child(5) ~ li:last-child { --flavour: var(--jp-pink); }
      #tabs ul li[active]:nth-child(6) ~ li:last-child { --flavour: var(--jp-purple); }
      #tabs ul li[active]:nth-child(7) ~ li:last-child { --flavour: var(--jp-cyan); }
      #tabs ul li[active]:nth-child(8) ~ li:last-child { --flavour: var(--jp-yellow); }
      #tabs ul li[active]:nth-child(9) ~ li:last-child { --flavour: var(--jp-pink); }
      #tabs ul li[active]:nth-child(10) ~ li:last-child { --flavour: var(--jp-purple); }
      #tabs ul li[active]:nth-child(11) ~ li:last-child { --flavour: var(--jp-cyan); }
      #tabs ul li[active]:nth-child(12) ~ li:last-child { --flavour: var(--jp-yellow); }

      .widgets {
          right: 0;
          margin: auto;
          height: 50px;
          color: var(--jp-text);
          font-size: 12px;
      }

      .widgets:hover .edit {
          margin: 0;
      }

      .widget {
          position: relative;
          height: 100%;
          padding: 0 1em;
      }

      .widget:first-child {
          padding-left: 2em;
      }

      .widget:last-child {
          padding-right: 2em;
      }

      .widget:hover {
          cursor: pointer;
          background: hsla(var(--accent-h, 340), var(--accent-s, 100%), var(--accent-l, 65%), 0.08);
          color: var(--jp-text);
      }

      #tabs > cols {
          position: relative;
          grid-template-columns: [tabs] auto [widgets] auto;
      }

      #tabs .time span {
          font-weight: 400;
      }

      #tabs i {
          font-size: 14pt !important;
      }

      .widget:not(:first-child)::before {
          content: '';
          position: absolute;
          display: block;
          left: 0;
          height: calc(100% - 15px);
          width: 1px;
          background: rgba(255, 255, 255, 0.12);
      }
    `;
  }

  template() {
    return `
        <div id="tabs">
            <cols>
                <ul class="- indicator"></ul>
                <div class="+ widgets col-end">
                    <current-time class="+ widget"></current-time>
                    <weather-forecast class="+ widget weather"></weather-forecast>
                </div>
            </cols>
        </div>`;
  }

  setEvents() {
    this.refs.tabs.forEach((tab) =>
      tab.onclick = ({ target }) => this.handleTabChange(target)
    );

    document.addEventListener('keydown', (e) => this.handleKeyPress(e));
    // document.addEventListener('wheel', (e) => this.handleWheelScroll(e));

    if (CONFIG.openLastVisitedTab) {
      window.addEventListener('beforeunload', () => this.saveCurrentTab());
    }
  }

  saveCurrentTab() {
    localStorage.lastVisitedTab = this.currentTabIndex;
  }

  openLastVisitedTab() {
    if (!CONFIG.openLastVisitedTab) return;
    this.activateByKey(localStorage.lastVisitedTab);
  }

  handleTabChange(tab) {
    this.activateByKey(Number(tab.getAttribute("tab-index")));
    this.saveCurrentTab();
  }

  handleWheelScroll(event) {
    if (!event) return;

    let { target, wheelDelta } = event;

    if (target.shadow && target.shadow.activeElement) return;

    let activeTab = -1;
    this.refs.tabs.forEach((tab, index) => {
      if (tab.getAttribute("active") === "") {
        activeTab = index;
      }
    });

    if (wheelDelta > 0) {
      this.activateByKey((activeTab + 1) % (this.refs.tabs.length - 1));
    } else {
      this.activateByKey(
        (activeTab - 1) < 0 ? this.refs.tabs.length - 2 : activeTab - 1,
      );
    }

    this.saveCurrentTab();
  }

  handleKeyPress(event) {
    if (!event) return;

    let { target, key } = event;

    if (target.shadow && target.shadow.activeElement) return;

    if (
      Number.isInteger(parseInt(key)) &&
      key <= this.externalRefs.categories.length
    ) {
      this.activateByKey(key - 1);
      this.saveCurrentTab();
    }
  }

  activateByKey(key) {
    key = Number(key);
    if (isNaN(key) || key < 0 || key >= this.externalRefs.categories.length) return;
    this.currentTabIndex = key;

    this.activate(this.refs.tabs, this.refs.tabs[key]);
    this.activate(
      this.externalRefs.categories,
      this.externalRefs.categories[key],
    );
  }

  createTabs() {
    const categoriesCount = this.externalRefs.categories.length;

    for (let i = 0; i <= categoriesCount; i++) {
      this.refs.indicator.innerHTML += `<li tab-index=${i} ${
        i == 0 ? "active" : ""
      }></li>`;
    }
  }

  activate(target, item) {
    target.forEach((i) => i.removeAttribute("active"));
    item.setAttribute("active", "");
  }

  connectedCallback() {
    this.render().then(() => {
      this.setDependencies();
      this.createTabs();
      this.setEvents();
      this.openLastVisitedTab();
    });
  }
}
