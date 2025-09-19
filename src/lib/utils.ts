export const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH || "";

export const withBase = (basePath: string, p: string) => {
  const base = basePath ? basePath.replace(/\/+$/, "") : "";
  const path = p.startsWith("/") ? p : `/${p}`;
  return `${base}${path}` || path;
};

export function toHiragana(s: string): string {
  return s.replace(/[\u30A1-\u30F6]/g, ch => String.fromCharCode(ch.charCodeAt(0) - 0x60));
}

export function initialCategory(word: string): { jp?: string; en?: string } {
  const w = word.trim();
  if (!w) return {};
  const ch = w[0];
  const code = ch.charCodeAt(0);

  if ((code >= 0x41 && code <= 0x5a) || (code >= 0x61 && code <= 0x7a)) {
    return { en: ch.toUpperCase() };
  }

  const hira = toHiragana(ch);
  const hiraSet = "あいうえおかきくけこさしすせそたちつてとなにぬねのはひふへほまみむめもやゆよらりるれろわをん";
  if (hiraSet.includes(hira)) return { jp: hira };

  return {};
}
