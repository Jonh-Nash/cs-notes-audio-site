import fs from "fs";
import path from "path";
import Layout from "@/components/Layout";
import SearchBox from "@/components/SearchBox";
import RandomPlayButton from "@/components/RandomPlayButton";
import StickyIndexLink from "@/components/StickyIndexLink";

type TopicMeta = {
  slug: string;
  title: string;
  categories: string[];
  keywords: string[];
  audio: string[];
};
type Doc = TopicMeta & { id: string; content: string };

export default function Home({
  topics,
  docs,
}: {
  topics: TopicMeta[];
  docs: Doc[];
}) {
  const categoryMap = new Map<string, number>();
  topics.forEach((t) =>
    t.categories.forEach((c) =>
      categoryMap.set(c, (categoryMap.get(c) || 0) + 1)
    )
  );
  const categories = Array.from(categoryMap.entries()).sort();

  return (
    <Layout>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">検索</h1>
        <RandomPlayButton topics={topics} />
      </div>

      <SearchBox docs={docs} />

      <h2 className="mt-8 mb-3 font-semibold">カテゴリ</h2>
      <div className="flex flex-wrap gap-2">
        {categories.map(([t, n]) => (
          <a
            key={t}
            href={`/categories/${encodeURIComponent(t)}`}
            className="text-sm px-2 py-1 border rounded"
          >
            #{t} <span className="opacity-60">({n})</span>
          </a>
        ))}
      </div>

      <div className="mt-8">
        <a className="underline" href="/keywords">
          👉 索引ページへ
        </a>
      </div>

      <StickyIndexLink />
    </Layout>
  );
}

export async function getStaticProps() {
  const dataDir = path.join(process.cwd(), "public", "data");
  const topics = JSON.parse(
    fs.readFileSync(path.join(dataDir, "topics.json"), "utf-8")
  );
  const docs = JSON.parse(
    fs.readFileSync(path.join(dataDir, "search.json"), "utf-8")
  );
  return { props: { topics, docs } };
}
