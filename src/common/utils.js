const { parse, stringify } = JSON;

/**
 * Escape HTML special characters to prevent XSS when inserting text into HTML.
 * @param {string} str
 * @returns {string}
 */
function escapeHtml(str) {
  if (str == null) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/**
 * Pad a number with leading zeros.
 * @param {number} num
 * @param {number} n
 * @returns {string}
 */
function pad(num, n = 2) {
  return (Array(n).join('0') + num).substr(-n);
}

/**
 * Return the English ordinal suffix for a number.
 * @param {number} num
 * @returns {string}
 */
function ord(num) {
  const n = Math.abs(num);
  const lastTwo = n % 100;
  const last = n % 10;
  if (lastTwo >= 11 && lastTwo <= 13) return 'th';
  return { 1: 'st', 2: 'nd', 3: 'rd' }[last] || 'th';
}

/**
 * Resize an image to fit within max dimensions and encode it as JPEG.
 * @param {string} dataUrl
 * @param {number} maxWidth
 * @param {number} maxHeight
 * @param {number} quality
 * @returns {Promise<string>}
 */
function resizeImage(dataUrl, maxWidth = 1024, maxHeight = 1024, quality = 0.75) {
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

/**
 * Read a File object as a base64 data URL.
 * @param {File} file
 * @returns {Promise<string>}
 */
function readFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => resolve(e.target.result);
    reader.onerror = (e) => reject(e);
    reader.readAsDataURL(file);
  });
}

/**
 * Handler for document.querySelector(All)
 * @returns {HTMLElement | Array<HTMLElement>}
 */
const $ = (e, options) => {
  const elems = document.querySelectorAll(e);

  if (options?.includeAll || elems.length > 1) return elems;

  return elems[0];
};

