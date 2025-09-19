"use client";
import { useMemo, useState } from "react";
import MiniSearch from "minisearch";
import Link from "next/link";
import TagBadge from "./TagBadge";

type Doc = {
  id: string; slug: string; title: string; tags: string[]; keywords: string[]; audio: string[]; content: string;
};

export default function SearchBox({ docs }: { docs: Doc[] }) {
  const [q, setQ] = useState("");
  const [tag, setTag] = useState<string | null>(null);

  const mini = useMemo(() => {
    const ms = new MiniSearch<Doc>({
      fields: ["title", "content", "tags", "keywords"],
      storeFields: ["id", "slug", "title", "tags", "keywords", "audio", "content"],
      searchOptions: { fuzzy: 0.2, prefix: true }
    });
    ms.addAll(docs);
    return ms;
  }, [docs]);

  const docsById = useMemo(() => {
    const m = new Map<string, Doc>();
    docs.forEach(d => m.set(d.id, d));
    return m;
  }, [docs]);

  const tags = useMemo(() => {
    const map = new Map<string, number>();
    docs.forEach(d => d.tags.forEach(t => map.set(t, (map.get(t) || 0) + 1)));
    return Array.from(map.entries()).sort();
  }, [docs]);

  const results = useMemo(() => {
    let resDocs: Doc[] = [];
    if (!q && !tag) return resDocs;
    if (q) {
      resDocs = (mini.search(q) as any[]).map(r => docsById.get(String(r.id))).filter(Boolean) as Doc[];
    } else {
      resDocs = docs.slice();
    }
    if (tag) {
      resDocs = resDocs.filter(d => d.tags.includes(tag));
    }
    // unique by id
    const seen = new Set<string>();
    resDocs = resDocs.filter(d => (seen.has(d.id) ? false : (seen.add(d.id), true)));
    return resDocs;
  }, [q, tag, mini, docs, docsById]);

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
              setTag(val.slice(1));
            }
          }}
        />
        <button className="border rounded px-3" onClick={() => { setQ(""); setTag(null); }}>クリア</button>
      </div>

      <div className="mb-4 flex flex-wrap gap-2">
        {tags.map(([t, n]) => (
          <button key={t}
            onClick={() => setTag(tag === t ? null : t)}
            className={`text-xs px-2 py-1 rounded border ${tag === t ? "bg-gray-200 dark:bg-gray-700" : ""}`}>
            #{t} <span className="opacity-60">({n})</span>
          </button>
        ))}
      </div>

      {results.length > 0 ? (
        <ul className="space-y-4">
          {results.map(r => (
            <li key={r.id} className="border rounded p-3">
              <Link href={`/topics/${r.slug}`} className="font-medium underline">{r.title}</Link>
              <div className="mt-2">{r.tags.map(t => <TagBadge key={t} tag={t} />)}</div>
              <p className="text-sm opacity-80 mt-2 line-clamp-2">{r.content}</p>
            </li>
          ))}
        </ul>
      ) : (
        (q || tag) ? <p className="opacity-70">一致なし</p> : <p className="opacity-60">キーワードで検索、またはタグを選択</p>
      )}
    </div>
  );
}
