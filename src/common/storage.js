class Storage {
  key;

  constructor(key) {
    this.key = key;
  }

  #parse(raw) {
    if (!raw) return null;
    try {
      return parse(raw);
    } catch (e) {
      console.error(`Failed to parse localStorage key "${this.key}":`, e);
      return null;
    }
  }

  get(prop) {
    const data = this.#parse(localStorage.getItem(this.key));
    return data ? data[prop] : undefined;
  }

  save(value) {
    localStorage.setItem(this.key, value);
  }

  hasValue(value) {
    const data = this.#parse(localStorage.getItem(this.key));
    return data ? value in data : false;
  }
}
