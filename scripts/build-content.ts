import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkStringify from "remark-stringify";
import stripMarkdown from "strip-markdown";

type TopicMeta = {
  slug: string;
  title: string;
  tags: string[];
  keywords: string[];
  audio: string[];
};

type SearchDoc = TopicMeta & { id: string; content: string };

const CONTENT_DIR = path.join(process.cwd(), "content");
const DATA_DIR = path.join(process.cwd(), "public", "data");

async function markdownToPlain(md: string): Promise<string> {
  const file = await unified()
    .use(remarkParse)
    .use(stripMarkdown)
    .use(remarkStringify)
    .process(md);
  return String(file)
    .replace(/<[^>]+>/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

async function main() {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });

  const files = fs.readdirSync(CONTENT_DIR).filter((f) => f.endsWith(".md"));
  const topics: TopicMeta[] = [];
  const searchDocs: SearchDoc[] = [];

  for (const file of files) {
    const full = path.join(CONTENT_DIR, file);
    const raw = fs.readFileSync(full, "utf-8");
    const { data, content } = matter(raw);

    const slug = file.replace(/\.md$/, "");
    const title = String(data.title || slug);
    const tags = Array.isArray(data.tags) ? data.tags.map(String) : [];
    const keywords = Array.isArray(data.keywords)
      ? data.keywords.map(String)
      : [];
    const audio = Array.isArray(data.audio) ? data.audio.map(String) : [];

    const plain = await markdownToPlain(content);

    const meta: TopicMeta = { slug, title, tags, keywords, audio };
    const doc: SearchDoc = { id: slug, ...meta, content: plain };

    topics.push(meta);
    searchDocs.push(doc);
  }

  fs.writeFileSync(
    path.join(DATA_DIR, "topics.json"),
    JSON.stringify(topics, null, 2)
  );
  fs.writeFileSync(
    path.join(DATA_DIR, "search.json"),
    JSON.stringify(searchDocs, null, 2)
  );
  console.log(
    `Generated ${topics.length} topics & ${searchDocs.length} search docs.`
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
