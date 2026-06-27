class ConfigTab extends Component {
  refs = {
    config: '#config',
    textarea: '#config textarea[type="text"]',
    save: '.save',
    close: '.close'
  };

  constructor() {
    super();

    this.config = JSON.parse(localStorage.getItem("config")).config;
  }

  style() {
    return `
      :host {
        --jp-pink:   #ff4d8d;
        --jp-purple: #9d4edd;
        --jp-cyan:   #4cc9f0;
        --jp-text:   #f0e6ef;
        --jp-muted:  rgba(240, 230, 239, 0.55);
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

      #config div {
          position: relative;
          width: 80%;
      }

      #config textarea {
          border: 0;
          outline: 0;
          width: 100%;
          box-shadow: inset 0 -2px rgba(255, 255, 255, 0.25);
          padding: .5em 0;
          background: none;
          font: 300 16px 'Roboto', sans-serif;
          letter-spacing: 1px;
          color: var(--jp-text);
          resize: none;
          height: 300px;
          -ms-overflow-style: none;
          scrollbar-width: thin;
          scrollbar-color: var(--jp-pink) transparent;
      }

      #config textarea:focus {
          box-shadow: inset 0 -2px var(--jp-pink), 0 0 20px rgba(255, 77, 141, 0.15);
      }

      #config textarea::selection {
          background: var(--jp-pink);
          color: #0d0d12;
      }

      #config textarea::-webkit-scrollbar {
        display: none;
      }

      #config .save {
          background: 0;
          border: 0;
          outline: 0;
          color: var(--jp-text);
          position: absolute;
          right: 40px;
          cursor: pointer;
          top: 15px;
          font-size: 18px;
          font-family: 'Roboto';
          transition: all .2s ease;
      }

      #config .save:hover {
          color: var(--jp-cyan);
          filter: drop-shadow(0 0 6px var(--jp-cyan));
      }

      #config .close {
          background: 0;
          border: 0;
          outline: 0;
          color: var(--jp-text);
          position: absolute;
          right: 0;
          cursor: pointer;
          top: 15px;
          transition: all .2s ease;
      }

      #config .close:hover {
          color: var(--jp-pink);
          filter: drop-shadow(0 0 6px var(--jp-pink));
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
    return `
        <div id="config">
          <div>
            <textarea type="text" spellcheck="false"></textarea>
            <button class="save">Save</button>
            <button class="close"><i class="material-icons">&#xE5CD;</i></button>
          </div>
        </div>
    `;
  }

  activate() {
    this.refs.config.classList.add('active');
    this.refs.textarea.scrollIntoView();
    setTimeout(() => this.refs.textarea.focus(), 100);
  }

  deactivate() {
    this.refs.config.classList.remove('active');
  }

  saveConfig() {
    localStorage.setItem("CONFIG", this.refs.textarea.value);
    this.deactivate();
    location.reload();
  }

  handleSearch(event) {
    const { key } = event;

    if (key === 'Escape')
      this.deactivate();
  }

  setEvents() {
    this.refs.config.onkeyup = (e) => this.handleSearch(e);
    this.refs.close.onclick = () => this.deactivate();
    this.refs.save.onclick = () => this.saveConfig();
  }

  setConfig() {
    this.refs.textarea.value =  JSON.stringify(this.config, null, 4);
  }

  connectedCallback() {
    this.render().then(() => {
      this.setEvents();
      this.setConfig();
    });
  }
}
