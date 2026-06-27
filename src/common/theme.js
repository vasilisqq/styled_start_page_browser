const Theme = (function () {
  function rgbToHsl(r, g, b) {
    r /= 255; g /= 255; b /= 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h = 0, s = 0, l = (max + min) / 2;
    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
      }
      h /= 6;
    }
    return { h: h * 360, s: s * 100, l: l * 100 };
  }

  function hslToCss(h, s, l, a) {
    const rounded = (n) => Math.round(n * 100) / 100;
    if (a === undefined || a === null || a === 1) {
      return `hsl(${Math.round(h)}, ${Math.round(s)}%, ${Math.round(l)}%)`;
    }
    return `hsla(${Math.round(h)}, ${Math.round(s)}%, ${Math.round(l)}%, ${rounded(a)})`;
  }

  function clamp(n, min, max) {
    return Math.min(Math.max(n, min), max);
  }

  /**
   * Extract a dominant saturated color from an image along with the overall
   * average color and brightness. Uses a quantized histogram so that big flat
   * color areas common in anime-style wallpapers win over noisy averages.
   */
  function isCrossOrigin(url) {
    try {
      const resolved = new URL(url, window.location.href);
      return resolved.origin !== window.location.origin;
    } catch (e) {
      return false;
    }
  }

  function extractPalette(imageUrl) {
    return new Promise((resolve) => {
      const img = new Image();
      if (isCrossOrigin(imageUrl))
        img.crossOrigin = 'anonymous';

      img.onload = () => {
        try {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d', { willReadFrequently: true });
          const size = 64;
          canvas.width = size;
          canvas.height = size;
          ctx.drawImage(img, 0, 0, size, size);
          const data = ctx.getImageData(0, 0, size, size).data;

          const bin = 8; // 32 bins per channel
          const buckets = new Map();
          let avgR = 0, avgG = 0, avgB = 0, avgL = 0, count = 0;
          let colorfulPixels = 0;

          for (let i = 0; i < data.length; i += 4) {
            const a = data[i + 3];
            if (a < 128) continue;

            const r = data[i], g = data[i + 1], b = data[i + 2];
            const hsl = rgbToHsl(r, g, b);

            avgR += r; avgG += g; avgB += b; avgL += hsl.l;
            count++;

            // Skip very dark, very light and nearly grayscale pixels when
            // looking for a dominant *accent* color.
            if (hsl.l < 12 || hsl.l > 88 || hsl.s < 12) continue;

            const key = `${Math.floor(r / bin)}-${Math.floor(g / bin)}-${Math.floor(b / bin)}`;
            let bucket = buckets.get(key);
            if (!bucket) {
              bucket = {
                x: 0, y: 0, satSum: 0, lumSum: 0, r: 0, g: 0, b: 0, count: 0
              };
              buckets.set(key, bucket);
            }

            const rad = hsl.h * Math.PI / 180;
            bucket.x += Math.cos(rad) * hsl.s;
            bucket.y += Math.sin(rad) * hsl.s;
            bucket.satSum += hsl.s;
            bucket.lumSum += hsl.l;
            bucket.r += r;
            bucket.g += g;
            bucket.b += b;
            bucket.count++;
            colorfulPixels++;
          }

          if (!count) {
            resolve({ h: 340, s: 80, l: 60, avgR: 13, avgG: 13, avgB: 18, avgL: 7, mode: 'fallback' });
            return;
          }

          avgR /= count; avgG /= count; avgB /= count; avgL /= count;

          // If the image has some colorful pixels, pick the most common bucket.
          let dominant = null;
          if (colorfulPixels > 0) {
            for (const bucket of buckets.values()) {
              if (!dominant || bucket.count > dominant.count) dominant = bucket;
            }
          }

          if (dominant) {
            const n = dominant.count;
            const hue = (Math.atan2(dominant.y, dominant.x) * 180 / Math.PI + 360) % 360;
            resolve({
              h: hue,
              s: dominant.satSum / n,
              l: dominant.lumSum / n,
              r: dominant.r / n,
              g: dominant.g / n,
              b: dominant.b / n,
              avgR, avgG, avgB, avgL,
              mode: 'dominant'
            });
          } else {
            const avgHsl = rgbToHsl(avgR, avgG, avgB);
            resolve({
              h: avgHsl.h,
              s: avgHsl.s,
              l: avgHsl.l,
              r: avgR, g: avgG, b: avgB,
              avgR, avgG, avgB, avgL,
              mode: 'average'
            });
          }
        } catch (e) {
          console.error('Theme extraction failed:', e);
          resolve({ h: 340, s: 80, l: 60, avgR: 13, avgG: 13, avgB: 18, avgL: 7, mode: 'fallback' });
        }
      };

      img.onerror = () => {
        resolve({ h: 340, s: 80, l: 60, avgR: 13, avgG: 13, avgB: 18, avgL: 7, mode: 'fallback' });
      };

      img.src = imageUrl;
    });
  }

  /**
   * Build a coherent dark UI palette from the extracted color data.
   * Accents are derived from the dominant hue, while the background and panel
   * tones stay dark and only slightly tinted so text remains readable.
   */
  function generatePalette(data) {
    const baseH = data.h;
    const baseS = clamp(data.s, 55, 92);
    const baseL = clamp(data.l, 45, 68);

    const h2 = (baseH + 45) % 360;
    const s2 = clamp(baseS - 5, 50, 85);
    const l2 = clamp(baseL + 2, 45, 70);

    const h3 = (baseH + 165) % 360;
    const s3 = clamp(baseS - 10, 45, 80);
    const l3 = clamp(baseL - 2, 40, 65);

    const h4 = (baseH + 205) % 360;
    const s4 = clamp(baseS - 5, 50, 85);
    const l4 = clamp(baseL + 4, 45, 70);

    const isBright = data.avgL > 55;

    // Dark base background with a subtle tint from the wallpaper.
    const bgH = baseH;
    const bgS = isBright ? 16 : 10;
    const bgL = isBright ? 11 : 8;

    // Panels need a bit more saturation so the tint is visible but still dark.
    const panelAlpha = isBright ? 0.78 : 0.72;
    const panelH = baseH;
    const panelS = 22;
    const panelL = 12;

    // Light text, slightly tinted.
    const textH = baseH;
    const textS = 15;
    const textL = 94;

    const mutedH = baseH;
    const mutedS = 12;
    const mutedL = 85;

    const borderH = baseH;
    const borderS = baseS;
    const borderL = baseL;

    const fromH = baseH;
    const fromS = 25;
    const fromL = 10;
    const fromA = 0.94;

    const toH = baseH;
    const toS = 35;
    const toL = 16;
    const toA = 0.94;

    const palette = {
      '--accent': hslToCss(baseH, baseS, baseL),
      '--accent-h': Math.round(baseH),
      '--accent-s': Math.round(baseS) + '%',
      '--accent-l': Math.round(baseL) + '%',
      '--accent-2': hslToCss(h2, s2, l2),
      '--accent-2-h': Math.round(h2),
      '--accent-2-s': Math.round(s2) + '%',
      '--accent-2-l': Math.round(l2) + '%',
      '--accent-3': hslToCss(h3, s3, l3),
      '--accent-3-h': Math.round(h3),
      '--accent-3-s': Math.round(s3) + '%',
      '--accent-3-l': Math.round(l3) + '%',
      '--accent-4': hslToCss(h4, s4, l4),
      '--accent-4-h': Math.round(h4),
      '--accent-4-s': Math.round(s4) + '%',
      '--accent-4-l': Math.round(l4) + '%',
      '--bg': hslToCss(bgH, bgS, bgL),
      '--panel-bg': hslToCss(panelH, panelS, panelL, panelAlpha),
      '--panel-from': hslToCss(fromH, fromS, fromL, fromA),
      '--panel-to': hslToCss(toH, toS, toL, toA),
      '--text': hslToCss(textH, textS, textL),
      '--text-muted': hslToCss(mutedH, mutedS, mutedL, 0.55),
      '--border': hslToCss(borderH, borderS, borderL, 0.35),
      '--shadow': 'rgba(0, 0, 0, 0.55)'
    };

    // Direct aliases used by component shadow DOMs. Setting these on the host
    // element bypasses unreliable inheritance/re-computation of derived vars.
    palette['--jp-pink'] = palette['--accent'];
    palette['--jp-pink-15'] = hslToCss(baseH, baseS, baseL, 0.15);
    palette['--jp-pink-25'] = hslToCss(baseH, baseS, baseL, 0.25);
    palette['--jp-pink-35'] = hslToCss(baseH, baseS, baseL, 0.35);
    palette['--jp-pink-40'] = hslToCss(baseH, baseS, baseL, 0.4);
    palette['--jp-pink-65'] = hslToCss(baseH, baseS, baseL, 0.65);
    palette['--jp-pink-85'] = hslToCss(baseH, baseS, baseL, 0.85);
    palette['--jp-purple'] = palette['--accent-2'];
    palette['--jp-cyan'] = palette['--accent-3'];
    palette['--jp-cyan-15'] = hslToCss(h3, s3, l3, 0.15);
    palette['--jp-cyan-40'] = hslToCss(h3, s3, l3, 0.4);
    palette['--jp-cyan-85'] = hslToCss(h3, s3, l3, 0.85);
    palette['--jp-yellow'] = palette['--accent-4'];
    palette['--jp-text'] = palette['--text'];
    palette['--jp-muted'] = palette['--text-muted'];
    palette['--jp-panel'] = palette['--panel-bg'];
    palette['--jp-border'] = palette['--border'];

    return palette;
  }

  function applyToRoot(palette) {
    const root = document.documentElement;
    for (const [key, value] of Object.entries(palette)) {
      root.style.setProperty(key, value);
    }

    // Push palette directly to every rendered custom element host so that
    // shadow DOMs update even if the browser's inheritance path is flaky.
    if (typeof RenderedComponents !== 'undefined') {
      for (const comp of Object.values(RenderedComponents)) {
        if (comp && comp.style) {
          for (const [key, value] of Object.entries(palette)) {
            comp.style.setProperty(key, value);
          }
        }
      }
    }
  }

  async function apply(imageUrl) {
    if (!imageUrl) return null;
    const data = await extractPalette(imageUrl);
    const palette = generatePalette(data);
    applyToRoot(palette);
    return palette;
  }

  return {
    apply,
    extractPalette,
    generatePalette,
    rgbToHsl,
    hslToCss
  };
})();
