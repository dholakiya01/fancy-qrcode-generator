export const QR_TYPES = [
  {
    id: "url",
    label: "Website URL",
    f: [{ k: "url", l: "Website URL", p: "https://example.com" }],
  },
  {
    id: "text",
    label: "Plain Text",
    f: [{ k: "text", l: "Text", p: "Your text here", area: 1 }],
  },
  {
    id: "email",
    label: "Email",
    f: [
      { k: "to", l: "Email address", p: "name@example.com" },
      { k: "subject", l: "Subject (optional)" },
      { k: "body", l: "Message (optional)", area: 1 },
    ],
  },
  {
    id: "phone",
    label: "Phone Number",
    f: [{ k: "phone", l: "Phone number", p: "+919876543210" }],
  },
  {
    id: "whatsapp",
    label: "WhatsApp",
    f: [
      { k: "cc", l: "Country code", p: "91" },
      { k: "phone", l: "Phone number", p: "9876543210" },
      { k: "msg", l: "Pre-filled message (optional)", area: 1 },
    ],
  },
  {
    id: "wifi",
    label: "Wi-Fi",
    f: [
      { k: "ssid", l: "Network name" },
      { k: "pass", l: "Password" },
      { k: "sec", l: "Security type", opts: ["WPA", "WEP", "nopass"] },
    ],
  },
  {
    id: "vcard",
    label: "vCard / Contact",
    f: [
      { k: "name", l: "Full name" },
      { k: "org", l: "Company (optional)" },
      { k: "title", l: "Job title (optional)" },
      { k: "phone", l: "Phone (optional)" },
      { k: "email", l: "Email (optional)" },
      { k: "web", l: "Website (optional)" },
      { k: "adr", l: "Address (optional)" },
    ],
  },
  {
    id: "location",
    label: "Location",
    f: [
      { k: "lat", l: "Latitude", p: "23.0225" },
      { k: "lng", l: "Longitude", p: "72.5714" },
    ],
  },
  {
    id: "upi",
    label: "UPI Payment",
    f: [
      { k: "pa", l: "UPI ID", p: "name@bank" },
      { k: "pn", l: "Payee name" },
      { k: "am", l: "Amount (optional)" },
    ],
  },
];
const esc = (s) => String(s).replace(/([\\;,:"])/g, "\\$1");
export function buildData(type, v) {
  const g = (k) => (v[k] || "").trim(),
    E = (error) => ({ error });
  switch (type) {
    case "url": {
      let u = g("url");
      if (!u) return E("Enter a website URL.");
      if (!/^https?:\/\//i.test(u)) u = "https://" + u;
      try {
        const h = new URL(u).hostname;
        if (!h.includes(".") && h !== "localhost") throw 0;
      } catch {
        return E("Enter a valid URL, e.g. https://example.com");
      }
      return { data: u };
    }
    case "text":
      return g("text")
        ? g("text").length > 1000
          ? E("Text is too long (max 1000 characters).")
          : { data: g("text") }
        : E("Enter some text.");
    case "email": {
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(g("to")))
        return E("Enter a valid email address.");
      const q = [
        g("subject") && "subject=" + encodeURIComponent(g("subject")),
        g("body") && "body=" + encodeURIComponent(g("body")),
      ]
        .filter(Boolean)
        .join("&");
      return { data: `mailto:${g("to")}${q ? "?" + q : ""}` };
    }
    case "phone": {
      const p = g("phone").replace(/[\s()-]/g, "");
      return /^\+?\d{6,15}$/.test(p)
        ? { data: "tel:" + p }
        : E("Enter a valid phone number (6–15 digits).");
    }
    case "whatsapp": {
      const c = g("cc").replace(/\D/g, ""),
        p = g("phone").replace(/\D/g, "");
      if (!/^\d{1,4}$/.test(c))
        return E("Enter a valid country code, e.g. 91.");
      if (!/^\d{5,14}$/.test(p)) return E("Enter a valid phone number.");
      return {
        data: `https://wa.me/${c}${p}${g("msg") ? "?text=" + encodeURIComponent(g("msg")) : ""}`,
      };
    }
    case "wifi": {
      const s = v.sec || "WPA";
      if (!g("ssid")) return E("Enter the network name.");
      if (s !== "nopass" && !v.pass) return E("Enter the Wi-Fi password.");
      return {
        data: `WIFI:T:${s};S:${esc(g("ssid"))};${s !== "nopass" ? `P:${esc(v.pass)};` : ""};`,
      };
    }
    case "vcard": {
      if (!g("name")) return E("Enter a name.");
      if (g("email") && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(g("email")))
        return E("Enter a valid email.");
      const L = [
        "BEGIN:VCARD",
        "VERSION:3.0",
        "FN:" + g("name"),
        g("org") && "ORG:" + g("org"),
        g("title") && "TITLE:" + g("title"),
        g("phone") && "TEL:" + g("phone"),
        g("email") && "EMAIL:" + g("email"),
        g("web") && "URL:" + g("web"),
        g("adr") && "ADR;TYPE=WORK:;;" + g("adr"),
        "END:VCARD",
      ].filter(Boolean);
      return { data: L.join("\n") };
    }
    case "location": {
      const a = parseFloat(g("lat")),
        b = parseFloat(g("lng"));
      if (
        !(a >= -90 && a <= 90) ||
        !(b >= -180 && b <= 180) ||
        !g("lat") ||
        !g("lng")
      )
        return E("Enter valid latitude (−90…90) and longitude (−180…180).");
      return { data: `geo:${a},${b}` };
    }
    case "upi": {
      if (!/^[\w.\-]{2,}@[a-zA-Z]{2,}$/.test(g("pa")))
        return E("Enter a valid UPI ID, e.g. name@bank.");
      if (!g("pn")) return E("Enter the payee name.");
      if (g("am") && !(parseFloat(g("am")) > 0))
        return E("Amount must be a positive number.");
      return {
        data: `upi://pay?pa=${encodeURIComponent(g("pa"))}&pn=${encodeURIComponent(g("pn"))}${g("am") ? "&am=" + parseFloat(g("am")) : ""}&cu=INR`,
      };
    }
  }
  return E("Unknown type");
}
export const LOGO_TYPES = [
  "image/png",
  "image/jpeg",
  "image/svg+xml",
  "image/webp",
];
