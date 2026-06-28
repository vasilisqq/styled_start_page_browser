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
    configHash: '',
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
      set: (target, prop, value) => this.settingUpdatedCallback(target, prop, value)
    });
  }

  /**
   * Automatically save whenever a config property is updated.
   * @returns {boolean}
   */
  settingUpdatedCallback(target, prop, val) {
    if (!(prop in target)) return false;

    Reflect.set(target, prop, val);
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
    return { ...this, config: undefined, defaults: undefined, storage: undefined };
  }

  /**
   * Trigger keybinding actions.
   * @returns {void}
   */
  setKeybindings() {
    const bindings = this.keybindings || this.defaults.keybindings;
    document.addEventListener('keydown', ({ key }) => {
      if (document.activeElement !== document.body) return;

      if (Object.keys(bindings).includes(key))
        Actions.activate(bindings[key]);
    });
  }

  save() {
    try {
      // Preserve the latest background values from localStorage instead of
      // blindly overwriting them with the in-memory copy. Other components (like
      // the config tab) save the background directly, so this prevents a stale
      // CONFIG.background from wiping out the user's chosen wallpaper.
      const current = this.#parse(localStorage.getItem(this.storage.key)) || {};
      const next = { ...this.toJSON() };
      const dynamic = ['background', 'customBackgrounds', 'tabs', 'openLastVisitedTab', 'configHash'];
      const filtered = {};
      for (const key of dynamic) {
        if (key in next) filtered[key] = next[key];
      }
      if ('background' in current) filtered.background = current.background;
      if ('customBackgrounds' in current) filtered.customBackgrounds = current.customBackgrounds;
      this.storage.save(stringify(filtered));
    } catch (e) {
      if (e.name === 'QuotaExceededError' || e.message.toLowerCase().includes('quota')) {
        console.error('Config save failed: localStorage quota exceeded');
        return;
      }
      throw e;
    }
  }

  #parse(raw) {
    if (!raw) return null;
    try {
      return parse(raw);
    } catch (e) {
      console.error('Failed to parse stored CONFIG:', e);
      return null;
    }
  }

  exportSettings() {
    const anchor = document.createElement('a');
    const filename = 'tartarus.config.json';
    const mimeType = 'data:text/plain;charset=utf-8,';

    anchor.href = mimeType + encodeURIComponent(stringify(this.toJSON(), null, 2));
    anchor.download = filename;

    anchor.click();
  }
}
