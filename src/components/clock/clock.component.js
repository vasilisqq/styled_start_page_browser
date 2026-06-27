class Clock extends Component {
  refs = {
    clock: '.clock-time',
    icon: '.clock-icon'
  };

  constructor() {
    super();
  }

  imports() {
    return [
      this.resources.icons.material,
      this.resources.fonts.roboto
    ];
  }

  styles() {
    return `
        :host {
          --jp-text: var(--text, #f0e6ef);
        }

        .clock-time {
            white-space: nowrap;
            font: 300 9pt 'Roboto', sans-serif;
            color: var(--jp-text);
            letter-spacing: .5px;
        }

        .clock-icon {
            color: var(--accent, #ff4d8d);
            font-size: 10pt;
            margin-right: 10px;
            filter: drop-shadow(0 0 4px var(--accent, #ff4d8d));
        }
    `;
  }

  template() {
    return `
        <span class="material-icons clock-icon">schedule</span>
        <p class="clock-time"></p>
    `;
  }

  setIconColor() {
    const color = CONFIG.clock.iconColor;
    // Let the theme accent drive the icon color unless the user has set a
    // custom value explicitly.
    if (color && color !== '#ff4d8d') {
      this.refs.icon.style.color = color;
    }
  }

  setTime() {
    const date = new Date();

    this.refs.clock = date.strftime(CONFIG.clock.format);
  }

  connectedCallback() {
    this.render().then(() => {
      this.setTime();
      this.setIconColor();

      this.interval = setInterval(() => this.setTime(), 1000);
    });
  }

  disconnectedCallback() {
    if (this.interval) {
      clearInterval(this.interval);
      this.interval = null;
    }
  }
}
