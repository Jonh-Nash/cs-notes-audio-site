import fs from "fs";
import path from "path";
import { GetStaticPaths, GetStaticProps } from "next";
import Layout from "@/components/Layout";
import RandomPlayButton from "@/components/RandomPlayButton";

type TopicMeta = { slug: string; title: string; tags: string[]; keywords: string[]; audio: string[] };

export default function TagPage({ tag, topics }: { tag: string; topics: TopicMeta[] }) {
  return (
    <Layout title={`#${tag}`}>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-semibold">#{tag}</h1>
        <RandomPlayButton topics={topics} tag={tag} />
      </div>
      <ul className="space-y-3">
        {topics.filter(t => t.tags.includes(tag)).map(t => (
          <li key={t.slug} className="border rounded p-3">
            <a className="underline font-medium" href={`/topics/${t.slug}`}>{t.title}</a>
            <div className="text-xs opacity-70 mt-1">{t.keywords.join(" / ")}</div>
          </li>
        ))}
      </ul>
    </Layout>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const dataDir = path.join(process.cwd(), "public", "data");
  const topics: TopicMeta[] = JSON.parse(fs.readFileSync(path.join(dataDir, "topics.json"), "utf-8"));
  const tags = Array.from(new Set(topics.flatMap(t => t.tags)));
  return {
    paths: tags.map(tag => ({ params: { tag } })),
    fallback: false
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const tag = String(params?.tag || "");
  const dataDir = path.join(process.cwd(), "public", "data");
  const topics = JSON.parse(fs.readFileSync(path.join(dataDir, "topics.json"), "utf-8"));
  return { props: { tag, topics } };
};
