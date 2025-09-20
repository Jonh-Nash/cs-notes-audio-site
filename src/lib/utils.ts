export const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH || "";

export const withBase = (basePath: string, p: string) => {
  const base = basePath ? basePath.replace(/\/+$/, "") : "";
  const path = p.startsWith("/") ? p : `/${p}`;
  return `${base}${path}` || path;
};

export function toHiragana(s: string): string {
  return s.replace(/[\u30A1-\u30F6]/g, (ch) =>
    String.fromCharCode(ch.charCodeAt(0) - 0x60)
  );
}

// 濁音・半濁音を清音に変換
function toSeion(char: string): string {
  const dakutenMap: Record<string, string> = {
    が: "か",
    ぎ: "き",
    ぐ: "く",
    げ: "け",
    ご: "こ",
    ざ: "さ",
    じ: "し",
    ず: "す",
    ぜ: "せ",
    ぞ: "そ",
    だ: "た",
    ぢ: "ち",
    づ: "つ",
    で: "て",
    ど: "と",
    ば: "は",
    び: "ひ",
    ぶ: "ふ",
    べ: "へ",
    ぼ: "ほ",
    ぱ: "は",
    ぴ: "ひ",
    ぷ: "ふ",
    ぺ: "へ",
    ぽ: "ほ",
  };
  return dakutenMap[char] || char;
}

// 基本的な漢字の読み方マッピング
const kanjiReadingMap: Record<string, string> = {
  冪: "へ",
};

export function initialCategory(word: string): { jp?: string; en?: string } {
  const w = word.trim();
  if (!w) return {};
  const ch = w[0];
  const code = ch.charCodeAt(0);

  if ((code >= 0x41 && code <= 0x5a) || (code >= 0x61 && code <= 0x7a)) {
    return { en: ch.toUpperCase() };
  }

  const hira = toHiragana(ch);
  const hiraSet =
    "あいうえおかきくけこさしすせそたちつてとなにぬねのはひふへほまみむめもやゆよらりるれろわをん";

  // 濁音・半濁音を清音に変換してから分類
  const seionHira = toSeion(hira);
  if (hiraSet.includes(seionHira)) return { jp: seionHira };

  // 漢字の読み方チェック
  const kanjiReading = kanjiReadingMap[ch];
  if (kanjiReading) {
    const seionKanji = toSeion(kanjiReading);
    if (hiraSet.includes(seionKanji)) {
      return { jp: seionKanji };
    }
  }

  // 漢字（CJK統合漢字）の場合
  if (code >= 0x4e00 && code <= 0x9faf) {
    // 漢字だが読み方が分からない場合は未分類として扱う
    return {};
  }

  return {};
}
