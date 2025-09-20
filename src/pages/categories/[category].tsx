import fs from "fs";
import path from "path";
import { GetStaticPaths, GetStaticProps } from "next";
import Layout from "@/components/Layout";
import RandomPlayButton from "@/components/RandomPlayButton";

type TopicMeta = {
  slug: string;
  title: string;
  categories: string[];
  keywords: string[];
  audio: string[];
};

export default function CategoryPage({
  category,
  topics,
}: {
  category: string;
  topics: TopicMeta[];
}) {
  return (
    <Layout title={`#${category}`}>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-semibold">#{category}</h1>
        <RandomPlayButton topics={topics} category={category} />
      </div>
      <ul className="space-y-3">
        {topics
          .filter((t) => t.categories.includes(category))
          .map((t) => (
            <li key={t.slug} className="border rounded p-3">
              <a className="underline font-medium" href={`/topics/${t.slug}`}>
                {t.title}
              </a>
              <div className="text-xs opacity-70 mt-1">
                {t.keywords.join(" / ")}
              </div>
            </li>
          ))}
      </ul>
    </Layout>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const dataDir = path.join(process.cwd(), "public", "data");
  const topics: TopicMeta[] = JSON.parse(
    fs.readFileSync(path.join(dataDir, "topics.json"), "utf-8")
  );
  const categories = Array.from(new Set(topics.flatMap((t) => t.categories)));
  return {
    paths: categories.map((category) => ({ params: { category } })),
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const category = String(params?.category || "");
  const dataDir = path.join(process.cwd(), "public", "data");
  const topics = JSON.parse(
    fs.readFileSync(path.join(dataDir, "topics.json"), "utf-8")
  );
  return { props: { category, topics } };
};
