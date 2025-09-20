"use client";
import { useMemo, useState } from "react";
import MiniSearch from "minisearch";
import Link from "next/link";
import CategoryBadge from "./CategoryBadge";

type Doc = {
  id: string;
  slug: string;
  title: string;
  categories: string[];
  keywords: string[];
  audio: string[];
  content: string;
};

export default function SearchBox({ docs }: { docs: Doc[] }) {
  const [q, setQ] = useState("");
  const [category, setCategory] = useState<string | null>(null);

  const mini = useMemo(() => {
    const ms = new MiniSearch<Doc>({
      fields: ["title", "content", "categories", "keywords"],
      storeFields: [
        "id",
        "slug",
        "title",
        "categories",
        "keywords",
        "audio",
        "content",
      ],
      searchOptions: { fuzzy: 0.2, prefix: true },
    });
    ms.addAll(docs);
    return ms;
  }, [docs]);

  const docsById = useMemo(() => {
    const m = new Map<string, Doc>();
    docs.forEach((d) => m.set(d.id, d));
    return m;
  }, [docs]);

  const categories = useMemo(() => {
    const map = new Map<string, number>();
    docs.forEach((d) =>
      d.categories.forEach((t) => map.set(t, (map.get(t) || 0) + 1))
    );
    return Array.from(map.entries()).sort();
  }, [docs]);

  const results = useMemo(() => {
    let resDocs: Doc[] = [];
    if (!q && !category) return resDocs;
    if (q) {
      resDocs = (mini.search(q) as any[])
        .map((r) => docsById.get(String(r.id)))
        .filter(Boolean) as Doc[];
    } else {
      resDocs = docs.slice();
    }
    if (category) {
      resDocs = resDocs.filter((d) => d.categories.includes(category));
    }
    // unique by id
    const seen = new Set<string>();
    resDocs = resDocs.filter((d) =>
      seen.has(d.id) ? false : (seen.add(d.id), true)
    );
    return resDocs;
  }, [q, category, mini, docs, docsById]);

  return (
    <div>
      <div className="flex gap-2 mb-3">
        <input
          className="w-full border rounded px-3 py-2"
          placeholder="全文検索（例: 二分探索 / binary / #algorithm）"
          value={q}
          onChange={(e) => {
            const val = e.target.value;
            setQ(val);
            if (val.startsWith("#")) {
              setCategory(val.slice(1));
            }
          }}
        />
        <button
          className="border rounded px-3"
          onClick={() => {
            setQ("");
            setCategory(null);
          }}
        >
          クリア
        </button>
      </div>

      <div className="mb-4 flex flex-wrap gap-2">
        {categories.map(([t, n]) => (
          <button
            key={t}
            onClick={() => setCategory(category === t ? null : t)}
            className={`text-xs px-2 py-1 rounded border ${
              category === t ? "bg-gray-200 dark:bg-gray-700" : ""
            }`}
          >
            #{t} <span className="opacity-60">({n})</span>
          </button>
        ))}
      </div>

      {results.length > 0 ? (
        <ul className="space-y-4">
          {results.map((r) => (
            <li key={r.id} className="border rounded p-3">
              <Link
                href={`/topics/${r.slug}`}
                className="font-medium underline"
              >
                {r.title}
              </Link>
              <div className="mt-2">
                {r.categories.map((t) => (
                  <CategoryBadge key={t} category={t} />
                ))}
              </div>
              <p className="text-sm opacity-80 mt-2 line-clamp-2">
                {r.content}
              </p>
            </li>
          ))}
        </ul>
      ) : q || category ? (
        <p className="opacity-70">一致なし</p>
      ) : (
        <p className="opacity-60">キーワードで検索、またはカテゴリを選択</p>
      )}
    </div>
  );
}
