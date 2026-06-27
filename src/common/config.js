class Config {
  defaults = {
    overrideStorage: false,
    temperature: {
      location: 'New York',
      scale: 'C'
    },
    clock: {
      format: 'h:i p',
      iconColor: '#ff7b95'
    },
    search: {
      engines: {
        g: ['https://google.com/search?q=', 'Google'],
        y: ['https://youtube.com/results?search_query=', 'Youtube'],
      }
    },
    disabled: [],
    openLastVisitedTab: false,
    tabs: [],
    keybindings: {
      "s": 'search-bar'
    },
    background: 'src/img/banners/bg-1.gif',
    customBackgrounds: []
  };

  config;

  constructor (config) {
    this.config = config;
    this.storage = new Storage('CONFIG');

    this.autoConfig();
    this.setKeybindings();
    this.save();

    return new Proxy(this, {
      ...this,
      __proto__: this.__proto__,
      set: (target, prop, value) =>
        this.settingUpdatedCallback(target, prop, value)
    });
  }

  /**
   * Automatically save whenever a config property is updated.
   * @returns {void}
   */
  settingUpdatedCallback(target, prop, val) {
    if (!(prop in target)) return false;

    Reflect.set(target, prop, val);
    Object.assign(this, target);

    this.save();

    return true;
  }

  /**
   * Set default config values or load them from the local storage.
   * @returns {void}
   */
  autoConfig() {
    Object.keys(this.defaults).forEach(setting => {
      if (this.canOverrideStorage(setting))
        this[setting] = this.config[setting];
      else
        if (this.storage.hasValue(setting))
          this[setting] = this.storage.get(setting);
        else
          this[setting] = setting === 'background' ? this.config[setting] : this.defaults[setting];
    });
  }

  /**
   * Determines whether the localStorage can be overridden.
   * If the setting is for the tabs section, always override.
   * @returns {bool}
   */
  canOverrideStorage(setting) {
    if (!(setting in this.config)) return false;
    if (setting === 'background') return false;
    return this.config.overrideStorage || setting === 'tabs';
  }

  /**
   * Deserialize the configuration object.
   * @returns {Object}
   */
  toJSON() {
    return { ...this, config: undefined, defaults: undefined };
  }

  /**
   * Trigger keybinding actions.
   * @returns {void}
   */
  setKeybindings() {
    document.onkeypress = ({ key }) => {
      if (document.activeElement !== document.body) return;

      if (Object.keys(this.config.keybindings).includes(key))
        Actions.activate(this.config.keybindings[key]);
    };
  }

  save() {
    try {
      this.storage.save(stringify(this));
    } catch (e) {
      if (e.name === 'QuotaExceededError' || e.message.toLowerCase().includes('quota')) {
        console.error('Config save failed: localStorage quota exceeded');
        return;
      }
      throw e;
    }
  }

  exportSettings() {
    const anchor = document.createElement('a');
    const filename = 'dawn.config.json';
    const mimeType = 'data:text/plain;charset=utf-8,';

    anchor.href = mimeType + encodeURIComponent(stringify(this, null, 2));
    anchor.download = filename;

    anchor.click();
  }
}
