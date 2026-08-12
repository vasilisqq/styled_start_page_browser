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
    customBackgrounds: [],
    customBanners: []
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
      else if (this.storage.hasValue(setting))
        this[setting] = this.storage.get(setting);
      else
        this[setting] = this.defaults[setting];
    });
  }

  /**
   * Determines whether the value from the incoming config (userconfig.js)
   * should win over the copy stored in localStorage.
   *
   * Dynamic settings (tabs, background, custom images, openLastVisitedTab) are
   * resolved in userconfig.js via the configHash: for an unchanged file they
   * already hold the UI-edited values from localStorage, for a changed/imported
   * file they hold the file's values. Either way we trust that decision here
   * instead of re-reading localStorage — this is what lets an imported
   * background actually take effect.
   * @returns {bool}
   */
  canOverrideStorage(setting) {
    if (!(setting in this.config)) return false;
    if (['tabs', 'background', 'customBackgrounds', 'customBanners', 'openLastVisitedTab'].includes(setting))
      return true;
    return this.config.overrideStorage;
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
      // Persist only the dynamic settings; static ones live in userconfig.js.
      // The in-memory values are authoritative: components that change the
      // background/banners keep CONFIG in sync (via the Proxy setter), so we no
      // longer re-read the previous localStorage values here. Doing so used to
      // force the old wallpaper back on every save and made an imported
      // background never apply.
      const next = { ...this.toJSON() };
      const dynamic = ['background', 'customBackgrounds', 'customBanners', 'tabs', 'openLastVisitedTab', 'configHash'];
      const filtered = {};
      for (const key of dynamic) {
        if (key in next) filtered[key] = next[key];
      }
      this.storage.save(stringify(filtered));
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
    const filename = 'tartarus.config.json';
    const mimeType = 'data:text/plain;charset=utf-8,';

    anchor.href = mimeType + encodeURIComponent(stringify(this.toJSON(), null, 2));
    anchor.download = filename;

    anchor.click();
  }
}
