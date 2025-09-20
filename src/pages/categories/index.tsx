import fs from "fs";
import path from "path";
import Layout from "@/components/Layout";

type TopicMeta = {
  slug: string;
  title: string;
  categories: string[];
  keywords: string[];
  audio: string[];
};

export default function Categories({ topics }: { topics: TopicMeta[] }) {
  const map = new Map<string, number>();
  topics.forEach((t) =>
    t.categories.forEach((c) => map.set(c, (map.get(c) || 0) + 1))
  );
  const categories = Array.from(map.entries()).sort();
  return (
    <Layout title="カテゴリ">
      <h1 className="text-xl font-semibold mb-4">カテゴリ一覧</h1>
      <ul className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {categories.map(([t, n]) => (
          <li key={t}>
            <a
              className="block border rounded p-3"
              href={`/categories/${encodeURIComponent(t)}`}
            >
              #{t} <span className="opacity-60">({n})</span>
            </a>
          </li>
        ))}
      </ul>
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
