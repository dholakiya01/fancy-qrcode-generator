const C = (c, f = "#000000") => (/^#[0-9a-f]{6}$/i.test(c) ? c : f);
const lum = (h) => {
  h = C(h);
  const [r, g, b] = [1, 3, 5]
    .map((i) => parseInt(h.slice(i, i + 2), 16) / 255)
    .map((v) => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};
const ratio = (a, b) => {
  const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p);
  return (x + 0.05) / (y + 0.05);
};
const rgba = (h, a) => {
  h = C(h);
  return `rgba(${[1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16))},${a})`;
};
export const loadImg = (src) =>
  new Promise((res, rej) => {
    const i = new Image();
    i.onload = () => res(i);
    i.onerror = () =>
      rej(new Error("Could not load the image. Try a different file."));
    i.src = src;
  });
const mk = (w, h) => {
  const c = document.createElement("canvas");
  c.width = Math.round(w);
  c.height = Math.round(h);
  return [c, c.getContext("2d")];
};
const dims = (i) => [i.naturalWidth || 300, i.naturalHeight || 300];
const contain = (x, i, px, py, w, h) => {
  const [a, b] = dims(i),
    s = Math.min(w / a, h / b);
  x.drawImage(i, px + (w - a * s) / 2, py + (h - b * s) / 2, a * s, b * s);
};
const cover = (x, i, S, sc, ox, oy) => {
  const [a, b] = dims(i),
    s = (Math.max(S / a, S / b) * sc) / 100;
  x.drawImage(
    i,
    (S - a * s) / 2 + (ox / 100) * S,
    (S - b * s) / 2 + (oy / 100) * S,
    a * s,
    b * s,
  );
};

function baseOptions(d, data, size, { transparent, image } = {}) {
  const fg = C(d.fg, "#202124"),
    ec = d.gradient.on ? C(d.gradient.start) : fg;
  const grad = d.gradient.on
    ? {
        type: "linear",
        rotation: (d.gradient.dir * Math.PI) / 180,
        colorStops: [
          { offset: 0, color: C(d.gradient.start) },
          { offset: 1, color: C(d.gradient.end) },
        ],
      }
    : undefined;
  return {
    width: size,
    height: size,
    type: "canvas",
    data,
    margin: Math.round((size * d.margin) / 100),
    image,
    qrOptions: { errorCorrectionLevel: d.ec },
    dotsOptions: { type: d.dots, color: fg, gradient: grad },
    cornersSquareOptions: { type: d.cornerSquare, color: ec },
    cornersDotOptions: { type: d.cornerDot, color: ec },
    backgroundOptions: {
      color: transparent ? "rgba(0,0,0,0)" : C(d.bg, "#ffffff"),
    },
    imageOptions: {
      hideBackgroundDots: true,
      imageSize: d.logoSize / 100,
      margin: d.logoMargin,
      crossOrigin: "anonymous",
    },
  };
}
async function makeBadge(url, d) {
  const S = 400,
    [c, x] = mk(S, S),
    bw = d.logoBorder * 3,
    i = bw / 2,
    img = await loadImg(url);
  const path = () => {
    x.beginPath();
    const s = S - 2 * i;
    if (d.logoShape === "circle") x.arc(S / 2, S / 2, s / 2, 0, Math.PI * 2);
    else if (d.logoShape === "rounded") x.roundRect(i, i, s, s, S * 0.2);
    else x.rect(i, i, s, s);
  };
  path();
  if (d.logoBg) {
    x.fillStyle = C(d.logoBgColor, "#ffffff");
    x.fill();
  }
  x.save();
  path();
  x.clip();
  x.globalAlpha = d.logoOpacity / 100;
  const p = d.logoBg || bw ? S * (d.logoShape === "circle" ? 0.17 : 0.1) : 0;
  contain(x, img, p, p, S - 2 * p, S - 2 * p);
  x.restore();
  if (bw) {
    path();
    x.lineWidth = bw;
    x.strokeStyle = C(d.logoBorderColor, "#845ec2");
    x.stroke();
  }
  return c.toDataURL("image/png");
}
export async function renderQR(cfg, size, { forceBg } = {}) {
  const { mode, logo, design: d, modeOpts: m, data } = cfg,
    transparent = d.bgMode === "transparent" && !forceBg,
    bg = C(d.bg, "#ffffff");
  const QR = (await import("qr-code-styling")).default;
  const raw = async (o) => {
    const b = await new QR(o).getRawData("png");
    if (!b) throw new Error("QR generation failed");
    const u = URL.createObjectURL(b);
    try {
      return await loadImg(u);
    } finally {
      URL.revokeObjectURL(u);
    }
  };
  const fin = (i) => {
    const [c, x] = mk(i.naturalWidth, i.naturalHeight);
    x.drawImage(i, 0, 0);
    return c;
  };
  if (!logo) return fin(await raw(baseOptions(d, data, size, { transparent })));
  const li = await loadImg(logo.url);
  if (mode === "center")
    return fin(
      await raw(
        baseOptions(d, data, size, {
          transparent,
          image: await makeBadge(logo.url, d),
        }),
      ),
    );
  if (mode === "watermark") {
    const qr = await raw(baseOptions(d, data, size, { transparent: true })),
      [c, x] = mk(size, size);
    if (!transparent) {
      x.fillStyle = bg;
      x.fillRect(0, 0, size, size);
    }
    const w = (size * m.wmSize) / 100;
    x.globalAlpha = m.wmOpacity / 100;
    contain(
      x,
      li,
      (size - w) / 2 + (m.wmX / 100) * size,
      (size - w) / 2 + (m.wmY / 100) * size,
      w,
      w,
    );
    x.globalAlpha = 1;
    x.drawImage(qr, 0, 0);
    return c;
  }
  if (mode === "integrated") {
    const qr = await raw(
        baseOptions(
          { ...d, gradient: { ...d.gradient, on: false }, fg: "#000000" },
          data,
          size,
          { transparent: true },
        ),
      ),
      [t, tx] = mk(size, size),
      [c, x] = mk(size, size);
    tx.drawImage(qr, 0, 0);
    tx.globalCompositeOperation = "source-in";
    cover(tx, li, size, m.intScale, m.intX, m.intY);
    tx.globalCompositeOperation = "source-atop";
    tx.fillStyle = rgba(d.fg, 0.5);
    tx.fillRect(0, 0, size, size);
    if (!transparent) {
      x.fillStyle = bg;
      x.fillRect(0, 0, size, size);
    }
    x.globalAlpha = 0.1;
    cover(x, li, size, m.intScale, m.intX, m.intY);
    x.globalAlpha = 1;
    x.drawImage(t, 0, 0);
    return c;
  }
  const W = size,
    pad = Math.round(W * 0.07),
    qs = W - 2 * pad,
    qr = await raw(baseOptions(d, data, qs, { transparent: false }));
  const logoH = Math.round(W * 0.16),
    nameH = m.bizName ? Math.round(W * 0.07) : 0,
    blockH = logoH + nameH + (nameH ? Math.round(W * 0.015) : 0),
    ctaH = m.cta ? Math.round(W * 0.1) : 0,
    top = m.framePos === "top";
  const H =
      pad +
      (top ? blockH + pad : 0) +
      qs +
      (top ? 0 : pad + blockH) +
      (ctaH ? pad + ctaH : 0) +
      pad,
    [c, x] = mk(W, H);
  const fc = C(m.frameColor, "#845ec2"),
    tc = lum(fc) > 0.5 ? "#202124" : "#ffffff";
  x.fillStyle = fc;
  x.beginPath();
  x.roundRect(0, 0, W, H, W * 0.05);
  x.fill();
  let y = pad;
  const block = () => {
    contain(x, li, pad, y, qs, logoH);
    const by = y + logoH;
    if (nameH) {
      x.fillStyle = tc;
      x.font = `700 ${nameH * 0.8}px system-ui,sans-serif`;
      x.textAlign = "center";
      x.textBaseline = "middle";
      x.fillText(m.bizName, W / 2, by + W * 0.015 + nameH / 2, qs);
    }
    y += blockH + pad;
  };
  if (top) block();
  x.save();
  x.beginPath();
  x.roundRect(pad, y, qs, qs, W * 0.035);
  x.clip();
  x.drawImage(qr, pad, y);
  x.restore();
  y += qs + pad;
  if (!top) block();
  if (ctaH) {
    x.font = `800 ${ctaH * 0.42}px system-ui,sans-serif`;
    const pw = Math.min(qs, x.measureText(m.cta).width + ctaH * 1.2);
    x.fillStyle = tc;
    x.beginPath();
    x.roundRect((W - pw) / 2, y, pw, ctaH, ctaH / 2);
    x.fill();
    x.fillStyle = fc;
    x.textAlign = "center";
    x.textBaseline = "middle";
    x.fillText(m.cta, W / 2, y + ctaH / 2 + 1, pw - 10);
  }
  return c;
}
export function assessRisk(cfg) {
  const { design: d, mode, logo, modeOpts: m } = cfg,
    w = [],
    cols = [d.fg, ...(d.gradient.on ? [d.gradient.start, d.gradient.end] : [])];
  if (d.bgMode !== "transparent" && cols.some((c) => ratio(c, d.bg) < 4))
    w.push(
      "Low contrast between QR colors and background. Use a darker foreground or lighter background.",
    );
  if (d.bgMode !== "transparent" && cols.some((c) => lum(c) > lum(d.bg)))
    w.push("Light-on-dark (inverted) QR codes are not read by many scanners.");
  if (d.bgMode === "transparent")
    w.push(
      "Transparent background: scanning depends on whatever it is placed on. JPG export fills with your background color.",
    );
  if (d.margin < 3)
    w.push(
      "Quiet zone is very small. Scanners need a clear margin around the code.",
    );
  if (logo && mode === "center") {
    if (d.ec !== "H")
      w.push("Use error correction H when a logo covers the center.");
    if (d.logoSize > 30)
      w.push("Logo is large (over 30%). Reduce it or test carefully.");
  }
  if (logo && mode === "watermark" && m.wmOpacity > 25)
    w.push("Watermark opacity above 25% can reduce contrast.");
  if (logo && mode === "integrated")
    w.push(
      "Integrated logo pattern is experimental. Always test with several phones before printing.",
    );
  return w;
}
export async function selfCheck(canvas, data) {
  const { default: jsQR } = await import("jsqr"),
    [c, x] = mk(canvas.width, canvas.height);
  x.fillStyle = "#fff";
  x.fillRect(0, 0, c.width, c.height);
  x.drawImage(canvas, 0, 0);
  const im = x.getImageData(0, 0, c.width, c.height),
    r = jsQR(im.data, c.width, c.height);
  return !!r && r.data === data;
}
const toBlob = (c, t, q) =>
  new Promise((res, rej) =>
    c.toBlob((b) => (b ? res(b) : rej(new Error("Export failed"))), t, q),
  );
export async function exportQR(cfg, format, size) {
  if (format === "svg") {
    const { design: d, mode, logo, data } = cfg;
    if (!logo || mode === "center") {
      const QR = (await import("qr-code-styling")).default;
      const o = baseOptions(d, data, size, {
        transparent: d.bgMode === "transparent",
        image: logo ? await makeBadge(logo.url, d) : undefined,
      });
      o.type = "svg";
      return { blob: await new QR(o).getRawData("svg"), note: "" };
    }
    const c = await renderQR(cfg, size),
      u = c.toDataURL("image/png");
    return {
      blob: new Blob(
        [
          `<svg xmlns="http://www.w3.org/2000/svg" width="${c.width}" height="${c.height}" viewBox="0 0 ${c.width} ${c.height}"><image href="${u}" width="${c.width}" height="${c.height}"/></svg>`,
        ],
        { type: "image/svg+xml" },
      ),
      note: "This mode exports SVG with an embedded high-resolution image (not pure vectors).",
    };
  }
  const c = await renderQR(cfg, size, { forceBg: format === "jpg" });
  return {
    blob: await toBlob(c, format === "jpg" ? "image/jpeg" : "image/png", 0.95),
    note: "",
  };
}
