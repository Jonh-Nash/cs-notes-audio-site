import fs from "fs";
import path from "path";
import Layout from "@/components/Layout";

type TopicMeta = { slug: string; title: string; tags: string[]; keywords: string[]; audio: string[] };

export default function Tags({ topics }: { topics: TopicMeta[] }) {
  const map = new Map<string, number>();
  topics.forEach(t => t.tags.forEach(tag => map.set(tag, (map.get(tag) || 0) + 1)));
  const tags = Array.from(map.entries()).sort();
  return (
    <Layout title="タグ">
      <h1 className="text-xl font-semibold mb-4">タグ一覧</h1>
      <ul className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {tags.map(([t, n]) => (
          <li key={t}><a className="block border rounded p-3" href={`/tags/${encodeURIComponent(t)}`}>#{t} <span className="opacity-60">({n})</span></a></li>
        ))}
      </ul>
    </Layout>
  );
}

export async function getStaticProps() {
  const dataDir = path.join(process.cwd(), "public", "data");
  const topics = JSON.parse(fs.readFileSync(path.join(dataDir, "topics.json"), "utf-8"));
  return { props: { topics } };
}
