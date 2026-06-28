/**
 * ImageDB - IndexedDB-backed image storage for Tartarus Startpage.
 *
 * Stores uploaded images as Blobs inside the browser's IndexedDB so they do
 * not bloat localStorage. The config keeps lightweight references in the form
 * "idb://<id>" which are resolved to blob URLs at runtime.
 */
const ImageDB = (function () {
  const DB_NAME = 'TartarusImages';
  const DB_VERSION = 1;
  const STORE_NAME = 'images';

  let dbPromise = null;
  let urlCache = new Map();

  function openDB() {
    if (dbPromise) return dbPromise;
    console.log('[ImageDB] opening database', DB_NAME, 'v', DB_VERSION);
    dbPromise = new Promise((resolve, reject) => {
      if (!window.indexedDB && !window.mozIndexedDB && !window.webkitIndexedDB && !window.msIndexedDB) {
        reject(new Error('IndexedDB is not supported in this browser'));
        return;
      }
      const idb = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;
      const request = idb.open(DB_NAME, DB_VERSION);
      request.onerror = () => reject(request.error || new Error('IndexedDB open failed'));
      request.onsuccess = () => {
        console.log('[ImageDB] database opened');
        resolve(request.result);
      };
      request.onupgradeneeded = (event) => {
        console.log('[ImageDB] upgrade needed');
        const db = event.target.result;
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          db.createObjectStore(STORE_NAME, { keyPath: 'id' });
        }
      };
      request.onblocked = () => reject(new Error('IndexedDB open blocked'));
    });
    return dbPromise;
  }

  function generateId() {
    return 'img_' + Date.now().toString(36) + '_' + Math.random().toString(36).slice(2, 10);
  }

  function dataUrlToBlob(dataUrl) {
    const parts = dataUrl.split(',');
    const header = parts[0];
    const base64 = parts[1];
    const mime = header.match(/:(.*?);/)?.[1] || 'image/jpeg';
    const binary = atob(base64);
    const len = binary.length;
    const buffer = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      buffer[i] = binary.charCodeAt(i);
    }
    return new Blob([buffer], { type: mime });
  }

  function isImageRef(url) {
    return typeof url === 'string' && url.startsWith('idb://');
  }

  function extractId(url) {
    return isImageRef(url) ? url.slice(6) : null;
  }

  async function putImage(source, id) {
    const db = await openDB();
    const resolvedId = id || generateId();
    let blob;
    if (typeof source === 'string') {
      blob = dataUrlToBlob(source);
    } else if (source instanceof Blob) {
      blob = source;
    } else {
      throw new Error('ImageDB.putImage expects a data URL string or Blob');
    }
    console.log('[ImageDB] storing image', resolvedId, 'size', blob.size);
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      store.put({ id: resolvedId, blob, createdAt: Date.now() });
      tx.oncomplete = () => {
        console.log('[ImageDB] stored', resolvedId);
        resolve('idb://' + resolvedId);
      };
      tx.onerror = () => reject(tx.error || new Error('IndexedDB write transaction failed'));
    });
  }

  async function getImage(id) {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const request = store.get(id);
      let result = null;
      request.onsuccess = () => { result = request.result?.blob || null; };
      tx.oncomplete = () => resolve(result);
      tx.onerror = () => reject(tx.error || new Error('IndexedDB read transaction failed'));
    });
  }

  async function deleteImage(id) {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      store.delete(id);
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error || new Error('IndexedDB delete transaction failed'));
    });
  }

  async function getImageUrl(refOrId) {
    const id = extractId(refOrId) || refOrId;
    if (!id) return null;
    if (urlCache.has(id)) {
      console.log('[ImageDB] getImageUrl cached', id);
      return urlCache.get(id);
    }
    console.log('[ImageDB] getImageUrl fetching', id);
    const blob = await getImage(id);
    console.log('[ImageDB] getImageUrl blob', id, !!blob, blob ? blob.size : 0);
    if (!blob) return null;
    const url = URL.createObjectURL(blob);
    urlCache.set(id, url);
    return url;
  }

  async function getImageAsDataUrl(refOrId) {
    const id = extractId(refOrId) || refOrId;
    if (!id) return null;
    const blob = await getImage(id);
    if (!blob) return null;
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = () => reject(reader.error);
      reader.readAsDataURL(blob);
    });
  }

  function revokeUrl(url) {
    if (!url) return;
    for (const [id, cached] of urlCache.entries()) {
      if (cached === url) {
        URL.revokeObjectURL(url);
        urlCache.delete(id);
        return;
      }
    }
    URL.revokeObjectURL(url);
  }

  async function resolveUrl(url) {
    if (isImageRef(url)) return getImageUrl(url);
    return url;
  }

  async function migrateDataUrl(url) {
    if (typeof url !== 'string' || !url.startsWith('data:')) return url;
    try {
      return await putImage(url);
    } catch (e) {
      console.error('ImageDB migrate failed:', e);
      return url;
    }
  }

  return {
    isImageRef,
    extractId,
    putImage,
    getImage,
    deleteImage,
    getImageUrl,
    getImageAsDataUrl,
    resolveUrl,
    revokeUrl,
    migrateDataUrl,
  };
})();
