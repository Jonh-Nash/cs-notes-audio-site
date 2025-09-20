import fs from "fs";
import path from "path";
import Layout from "@/components/Layout";
import ScrollToTopButton from "@/components/ScrollToTopButton";
import { initialCategory } from "@/lib/utils";

type TopicMeta = {
  slug: string;
  title: string;
  categories: string[];
  keywords: string[];
  audio: string[];
};

export default function KeywordsPage({ topics }: { topics: TopicMeta[] }) {
  const map = new Map<string, TopicMeta[]>();
  topics.forEach((t) =>
    (t.keywords || []).forEach((k) => {
      const key = String(k);
      const arr = map.get(key) || [];
      arr.push(t);
      map.set(key, arr);
    })
  );

  const entries = Array.from(map.entries()).sort((a, b) =>
    a[0].localeCompare(b[0])
  );

  const jpLetters =
    "あいうえおかきくけこさしすせそたちつてとなにぬねのはひふへほまみむめもやゆよらりるれろわをん".split(
      ""
    );
  const enLetters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

  const groupBy = (isJP: boolean) => {
    const group = new Map<string, [string, TopicMeta[]][]>();
    entries.forEach(([k, arr]) => {
      const init = initialCategory(k);
      const idx = isJP ? init.jp || "その他" : init.en || "Others";
      const cur = group.get(idx) || [];
      cur.push([k, arr]);
      group.set(idx, cur);
    });
    return group;
  };

  const jp = groupBy(true);
  const en = groupBy(false);

  return (
    <Layout title="索引">
      <h1 className="text-xl font-semibold mb-4">索引（Keywords）</h1>

      <div
        id="character-navigation"
        className="sticky top-0 z-10 bg-white/90 dark:bg-gray-900/90 backdrop-blur border-y py-2 mb-4 keyboard-safe-area"
      >
        <div className="text-sm mb-1">日本語</div>
        <div className="flex flex-wrap gap-2">
          {jpLetters.map((l) => (
            <a
              key={l}
              href={`#jp-${l}`}
              className="px-2 py-1 border rounded text-sm"
            >
              {l}
            </a>
          ))}
          <a href="#jp-その他" className="px-2 py-1 border rounded text-sm">
            その他
          </a>
        </div>
        <div className="text-sm mt-3 mb-1">English</div>
        <div className="flex flex-wrap gap-2">
          {enLetters.map((l) => (
            <a
              key={l}
              href={`#en-${l}`}
              className="px-2 py-1 border rounded text-sm"
            >
              {l}
            </a>
          ))}
          <a href="#en-Others" className="px-2 py-1 border rounded text-sm">
            Others
          </a>
        </div>
      </div>

      <section className="space-y-8">
        {["その他", ...jpLetters].map((letter) => (
          <div key={`jp-${letter}`} id={`jp-${letter}`}>
            <h2 className="font-semibold text-lg mb-3">[{letter}]</h2>
            <ul className="space-y-2">
              {(jp.get(letter) || []).map(([k, arr]) => (
                <li key={k} className="border rounded p-3">
                  <div className="font-medium">{k}</div>
                  <ul className="mt-2 text-sm list-disc pl-5">
                    {arr.map((t) => (
                      <li key={t.slug}>
                        <a className="underline" href={`/topics/${t.slug}`}>
                          {t.title}
                        </a>
                      </li>
                    ))}
                  </ul>
                </li>
              ))}
              {(jp.get(letter) || []).length === 0 && (
                <li className="opacity-60">（なし）</li>
              )}
            </ul>
          </div>
        ))}

        {["Others", ...enLetters].map((letter) => (
          <div key={`en-${letter}`} id={`en-${letter}`}>
            <h2 className="font-semibold text-lg mb-3">[{letter}]</h2>
            <ul className="space-y-2">
              {(en.get(letter) || []).map(([k, arr]) => (
                <li key={k} className="border rounded p-3">
                  <div className="font-medium">{k}</div>
                  <ul className="mt-2 text-sm list-disc pl-5">
                    {arr.map((t) => (
                      <li key={t.slug}>
                        <a className="underline" href={`/topics/${t.slug}`}>
                          {t.title}
                        </a>
                      </li>
                    ))}
                  </ul>
                </li>
              ))}
              {(en.get(letter) || []).length === 0 && (
                <li className="opacity-60">（なし）</li>
              )}
            </ul>
          </div>
        ))}
      </section>

      <ScrollToTopButton
        targetSelector="#character-navigation"
        showAfterScroll={300}
        buttonText="↑"
      />
    </Layout>
  );
}

export async function getStaticProps() {
  const dataDir = path.join(process.cwd(), "public", "data");
  const topics = JSON.parse(
    fs.readFileSync(path.join(dataDir, "topics.json"), "utf-8")
  );
  return { props: { topics } };
}
